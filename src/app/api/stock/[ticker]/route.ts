import { NextResponse } from "next/server";
import { scoreStock, getMarketDirection } from "@/lib/canslim";
import { getQuotes, getSP500History } from "@/lib/yahoo";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ ticker: string }> }
) {
  const { ticker } = await params;
  const symbol = ticker.toUpperCase();

  try {
    const [quotes, sp500Prices, market] = await Promise.all([
      getQuotes([symbol]),
      getSP500History(14),
      getMarketDirection(),
    ]);

    const quote = quotes.get(symbol);
    if (!quote) {
      return NextResponse.json({ error: "Stock not found" }, { status: 404 });
    }

    const result = await scoreStock(symbol, quote, sp500Prices, market);

    return NextResponse.json({ result, market });
  } catch (error) {
    console.error(`Error fetching ${symbol}:`, error);
    return NextResponse.json({ error: "Failed to fetch stock" }, { status: 500 });
  }
}
