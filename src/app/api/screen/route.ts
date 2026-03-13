import { ALL_TICKERS } from "@/lib/tickers";
import { screenBatch, getMarketDirection } from "@/lib/canslim";
import { getSP500History } from "@/lib/yahoo";

export const maxDuration = 300;
export const dynamic = "force-dynamic";

export async function GET() {
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
        send("progress", { scanned: 0, total: ALL_TICKERS.length });

        // Process tickers in batches of 10 concurrently
        const BATCH_SIZE = 10;
        let scanned = 0;

        for (let i = 0; i < ALL_TICKERS.length; i += BATCH_SIZE) {
          const batch = ALL_TICKERS.slice(i, i + BATCH_SIZE);
          const results = await screenBatch(batch, sp500Prices, market);

          scanned += batch.length;

          // Send each result as it comes
          for (const result of results) {
            send("stock", result);
          }

          send("progress", { scanned, total: ALL_TICKERS.length });
        }

        send("done", { scanned, timestamp: new Date().toISOString() });
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
