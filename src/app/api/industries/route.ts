import { ALL_TICKERS } from "@/lib/tickers";
import { getSectorIndustry } from "@/lib/yahoo";
import NodeCache from "node-cache";

const industryCache = new NodeCache({ stdTTL: 86400 }); // 24 hour cache

export interface IndustryMap {
  [sector: string]: {
    [industry: string]: {
      tickers: string[];
      count: number;
    };
  };
}

export const dynamic = "force-dynamic";
export const maxDuration = 300;

export async function GET() {
  const cached = industryCache.get<IndustryMap>("industries");
  if (cached) {
    return Response.json(cached);
  }

  const BATCH_SIZE = 10;
  const allData: { symbol: string; sector: string; industry: string }[] = [];

  // Fetch sector/industry via quoteSummary in batches
  for (let i = 0; i < ALL_TICKERS.length; i += BATCH_SIZE) {
    const batch = ALL_TICKERS.slice(i, i + BATCH_SIZE);
    const results = await Promise.allSettled(
      batch.map(async (symbol) => {
        const data = await getSectorIndustry(symbol);
        return { symbol, ...data };
      })
    );
    for (const r of results) {
      if (r.status === "fulfilled") {
        allData.push(r.value);
      }
    }
  }

  // Group by sector → industry
  const map: IndustryMap = {};
  for (const { symbol, sector, industry } of allData) {
    if (!map[sector]) map[sector] = {};
    if (!map[sector][industry]) map[sector][industry] = { tickers: [], count: 0 };
    map[sector][industry].tickers.push(symbol);
    map[sector][industry].count++;
  }

  // Sort tickers within each industry
  for (const sector of Object.values(map)) {
    for (const ind of Object.values(sector)) {
      ind.tickers.sort();
    }
  }

  industryCache.set("industries", map);

  return Response.json(map);
}
