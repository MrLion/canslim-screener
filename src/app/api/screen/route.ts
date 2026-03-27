import { ALL_TICKERS } from "@/lib/tickers";
import { screenBatch, getMarketDirection } from "@/lib/canslim";
import { getSP500History } from "@/lib/yahoo";

export const maxDuration = 300;
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tickersParam = searchParams.get("tickers");

  // Use filtered tickers if provided, otherwise scan all
  const tickers = tickersParam
    ? tickersParam.split(",").map((t) => t.trim()).filter(Boolean)
    : ALL_TICKERS;

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      function send(event: string, data: unknown) {
        controller.enqueue(
          encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`)
        );
      }

      try {
        // Get market direction and S&P 500 history first
        const [market, sp500Prices] = await Promise.all([
          getMarketDirection(),
          getSP500History(14),
        ]);

        send("market", market);
        send("progress", { scanned: 0, total: tickers.length });

        // Process tickers in batches of 10 concurrently
        const BATCH_SIZE = 10;
        const BATCH_DELAY_MS = 200; // ~50 req/sec — avoids Yahoo Finance rate limiting
        let scanned = 0;
        let invalid = 0;
        let errors = 0;

        for (let i = 0; i < tickers.length; i += BATCH_SIZE) {
          const batch = tickers.slice(i, i + BATCH_SIZE);
          const batchResult = await screenBatch(batch, sp500Prices, market);

          scanned += batch.length;
          invalid += batchResult.invalidCount;
          errors += batchResult.errorCount;

          // Send each result as it comes
          for (const result of batchResult.results) {
            send("stock", result);
          }

          send("progress", { scanned, total: tickers.length, invalid });

          if (i + BATCH_SIZE < tickers.length) {
            await new Promise((r) => setTimeout(r, BATCH_DELAY_MS));
          }
        }

        send("done", { scanned, invalid, errors, timestamp: new Date().toISOString() });
      } catch (error) {
        console.error("Screen error:", error);
        send("error", { message: "Failed to run screener" });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
