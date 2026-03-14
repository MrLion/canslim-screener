import { getIBDSectors } from "@/lib/ibd-groups";
import { ALL_TICKERS } from "@/lib/tickers";

export interface IndustryGroup {
  symbol: string;
  name: string;
  tickers: string[];
  count: number;
}

export interface SectorMap {
  [sector: string]: IndustryGroup[];
}

export const dynamic = "force-dynamic";

export async function GET() {
  const sectors = getIBDSectors();

  const map: SectorMap = {};
  for (const sector of sectors) {
    map[sector.name] = sector.groups.map((g) => ({
      symbol: g.symbol,
      name: g.name,
      tickers: g.tickers,
      count: g.tickers.length,
    }));
  }

  return Response.json({
    sectors: map,
    totalGroups: 197,
    totalTickers: ALL_TICKERS.length,
    tickersAssigned: sectors.reduce(
      (sum, s) => sum + s.groups.reduce((gs, g) => gs + g.tickers.length, 0),
      0
    ),
  });
}
