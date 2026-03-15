// IBD 197 Industry Groups (from Investor's Business Daily / MarketSurge)
// Tickers for each group will be populated later

export interface IBDGroup {
  symbol: string;
  name: string;
  tickers: string[];
}

export interface IBDSector {
  name: string;
  groups: IBDGroup[];
}

// All 197 IBD industry groups organized by sector
export const IBD_GROUPS: IBDGroup[] = [
  { symbol: "G3722", name: "Aerospace/Defense", tickers: ["ISSC", "KTOS", "WWD", "HWM", "MOGB", "CRS", "ATI", "ESP", "MOGA", "ESLT", "AIR", "CW", "HII", "RYCEY", "GE", "KRMN", "BAESY", "TXT", "ATRO", "ATROB", "DRS", "RTX", "DCO", "TDY", "OSIS", "MRCY", "POWW", "UMAC", "SIF", "TATT", "FTAI", "CODA", "VVX", "MPTI", "HXL", "GD", "AVAV", "LHX", "ONDS", "NOC", "OPXS", "LMT", "SATL", "RKLB", "HEI", "BA", "CAE", "HEIA", "RNMBY", "CVU", "LUNR", "EADSY", "NPK", "TDG", "KRKNF", "DPRO", "BAER", "SARO", "LOAR", "DRSHF", "EMBJ", "RDW", "HOVR", "SPIR", "PRZO", "SPAI", "SOAR", "AIRO", "VWAV", "AIRI", "ASLE", "DFSC", "SPCE", "MNTS", "EVTL", "ACHR", "EH", "JOBY", "FJET", "MDA", "FLYX", "AERG", "VOYG", "YSS", "FLY", "EVEX", "BETA"] },
  { symbol: "G1000", name: "Agricultural Operations", tickers: ["VFF", "CTVA", "ALCO", "BG", "LND", "DAR", "AGRO", "CBUS", "AVO", "ABVE", "AGRZ", "AVX", "PFAI", "EDBL", "RYM", "LOCL", "RKDA", "SEED", "EVGN", "LMNR", "UGRO", "BNC", "BIOX"] },
  { symbol: "G2300", name: "Apparel-Clothing Mfg", tickers: ["TPR", "FIGS", "RL", "NCI", "ZGN", "GIL", "KTB", "VSCO", "VRA", "UA", "UAA", "HESAY", "CFRUY", "MAMK", "VNCE", "SHZHY", "SMSEY", "LVMUY", "ANPDY", "CRI", "LEVI", "PVH", "GIII", "JEM", "MONRY", "JRSH", "VFC", "COLM", "GOOS", "PMNT", "BRIA", "CPRI", "LANV", "JL", "CULP", "UFI", "OXM", "JXG", "PASW"] },
  { symbol: "G3141", name: "Apparel-Shoes & Rel Mfg", tickers: ["RCKY", "WEYS", "DECK", "BIRK", "ONON", "SHOO", "CROX", "ADDYY", "WWW", "PUMSY", "NKE", "BIRD", "FMFC"] },
  { symbol: "G3711", name: "Auto Manufacturers", tickers: ["GM", "NIO", "TM", "TYIDY", "BYDDF", "TSLA", "SZKMY", "RACE", "XPEV", "GP", "RIVN", "F", "POAHY", "SSM", "LI", "HMC", "FUJHY", "FFAI", "LOT", "MBGAF", "VWAGY", "VWAPY", "GGR", "DCX", "VFS", "CENN", "LVWR", "PSNY", "KNDI", "EVTV", "NSANY", "LCID", "SEV", "FLYE", "STLA", "LOBO", "SBLX"] },
  { symbol: "G3714", name: "Auto/Truck-Original Eqp", tickers: ["PHIN", "BWA", "ELVA", "ATMU", "STRT", "DAN", "HSAI", "MGA", "ADNT", "LEA", "OUST", "LIDR", "ALSN", "VLEEY", "AEVA", "CAAS", "GTX", "APTV", "ALV", "MEC", "CPS", "CVR", "GNTX", "THRM", "VC", "HLLY", "DCH", "QS", "WKHS", "REE", "SRI", "INVZ", "GTEC", "ARBE", "AUR", "WBX", "PONY", "KDK", "FRSX", "SCAG"] },
  { symbol: "G3715", name: "Auto/Truck-Replace Parts", tickers: ["SMP", "XPEL", "DORM", "WKSP", "MPAA", "INEO", "AZI"] },
  { symbol: "G3011", name: "Auto/Truck-Tires & Misc", tickers: ["PLOW", "AMTY", "BRDCY", "MGDDY", "TWI", "GT", "CREVF"] },
  { symbol: "G1440", name: "Banks-Foreign", tickers: ["BAP", "CIB", "ITUB", "CM", "VBNK", "NTB", "SHG", "NRDBY", "SWDBY", "OVCHY", "ING", "BLX", "BHKLY", "KB", "IFS", "INTR", "WF", "BBD", "KBCSY", "AVAL", "NABZY", "BBDO", "BCH", "BSAC", "CICHY", "BSBR", "NU", "PPERY", "ISNPY", "CIHKY", "IBN", "HDB", "UOVEY", "GGAL", "PBCRY", "BBAR", "BMA", "SUPV"] },
  { symbol: "G6023", name: "Banks-Midwest", tickers: [] },
  { symbol: "G6020", name: "Banks-Money Center", tickers: [] },
  { symbol: "G6021", name: "Banks-Northeast", tickers: [] },
  { symbol: "G6022", name: "Banks-Southeast", tickers: [] },
  { symbol: "G1008", name: "Banks-Super Regional", tickers: [] },
  { symbol: "G6024", name: "Banks-West/Southwest", tickers: [] },
  { symbol: "G2085", name: "Beverages-Alcoholic", tickers: [] },
  { symbol: "G2086", name: "Beverages-Non-Alcoholic", tickers: [] },
  { symbol: "G3585", name: "Bldg-A/C & Heating Prds", tickers: [] },
  { symbol: "G8074", name: "Bldg-Cement/Concrt/Ag", tickers: [] },
  { symbol: "G3299", name: "Bldg-Constr Prds/Misc", tickers: [] },
  { symbol: "G3548", name: "Bldg-Hand Tools", tickers: [] },
  { symbol: "G1621", name: "Bldg-Heavy Construction", tickers: [] },
  { symbol: "G7340", name: "Bldg-Maintenance & Svc", tickers: [] },
  { symbol: "G3791", name: "Bldg-Mobile/Mfg & Rv", tickers: [] },
  { symbol: "G1520", name: "Bldg-Resident/Comml", tickers: [] },
  { symbol: "G2400", name: "Bldg-Wood Prds", tickers: [] },
  { symbol: "G1800", name: "Chemicals-Agricultural", tickers: [] },
  { symbol: "G2818", name: "Chemicals-Basic", tickers: [] },
  { symbol: "G2851", name: "Chemicals-Paints", tickers: [] },
  { symbol: "G3079", name: "Chemicals-Plastics", tickers: [] },
  { symbol: "G2899", name: "Chemicals-Specialty", tickers: [] },
  { symbol: "G7310", name: "Comml Svcs-Advertising", tickers: [] },
  { symbol: "G8242", name: "Comml Svcs-Consulting", tickers: [] },
  { symbol: "G2751", name: "Comml Svcs-Document Mgmt", tickers: [] },
  { symbol: "G3441", name: "Comml Svcs-Healthcare", tickers: [] },
  { symbol: "G7394", name: "Comml Svcs-Leasing", tickers: [] },
  { symbol: "G8244", name: "Comml Svcs-Market Rsrch", tickers: [] },
  { symbol: "G1001", name: "Comml Svcs-Outsourcing", tickers: [] },
  { symbol: "G1011", name: "Comml Svcs-Staffing", tickers: [] },
  { symbol: "G2761", name: "Comp Sftwr-Spec Enterprs", tickers: [] },
  { symbol: "G3582", name: "Computer Sftwr-Database", tickers: [] },
  { symbol: "G3575", name: "Computer Sftwr-Design", tickers: [] },
  { symbol: "G3270", name: "Computer Sftwr-Desktop", tickers: [] },
  { symbol: "G3357", name: "Computer Sftwr-Edu/Media", tickers: [] },
  { symbol: "G3583", name: "Computer Sftwr-Enterprse", tickers: [] },
  { symbol: "G2821", name: "Computer Sftwr-Financial", tickers: [] },
  { symbol: "G3584", name: "Computer Sftwr-Gaming", tickers: [] },
  { symbol: "G3069", name: "Computer Sftwr-Medical", tickers: [] },
  { symbol: "G3220", name: "Computer Sftwr-Security", tickers: [] },
  { symbol: "G3578", name: "Computer-Data Storage", tickers: [] },
  { symbol: "G3580", name: "Computer-Hardware/Perip", tickers: [] },
  { symbol: "G1004", name: "Computer-Integrated Syst", tickers: [] },
  { symbol: "G3574", name: "Computer-Networking", tickers: [] },
  { symbol: "G7392", name: "Computer-Tech Services", tickers: [] },
  { symbol: "G3651", name: "Consumer Prod-Electronic", tickers: [] },
  { symbol: "G1007", name: "Consumer Prod-Specialty", tickers: [] },
  { symbol: "G8240", name: "Consumer Svcs-Education", tickers: [] },
  { symbol: "G2653", name: "Containers/Packaging", tickers: [] },
  { symbol: "G2844", name: "Cosmetics/Personal Care", tickers: [] },
  { symbol: "G9900", name: "Diversified Operations", tickers: [] },
  { symbol: "G3664", name: "Elec-Contract Mfg", tickers: [] },
  { symbol: "G3662", name: "Elec-Misc Products", tickers: [] },
  { symbol: "G3611", name: "Elec-Scientific/Msrng", tickers: [] },
  { symbol: "G3676", name: "Elec-Semicondctor Fablss", tickers: [] },
  { symbol: "G3674", name: "Elec-Semiconductor Equip", tickers: [] },
  { symbol: "G3677", name: "Elec-Semiconductor Mfg", tickers: [] },
  { symbol: "G3621", name: "Electrical-Power/Equipmt", tickers: [] },
  { symbol: "G3680", name: "Electronic-Parts", tickers: [] },
  { symbol: "G1318", name: "Energy-Alternative/Other", tickers: [] },
  { symbol: "G1319", name: "Energy-Coal", tickers: [] },
  { symbol: "G1320", name: "Energy-Solar", tickers: [] },
  { symbol: "G6146", name: "Finance-Blank Check", tickers: [] },
  { symbol: "G6147", name: "Finance-Commercial Loans", tickers: [] },
  { symbol: "G6148", name: "Finance-Consumer Loans", tickers: [] },
  { symbol: "G6413", name: "Finance-CrdtCard/PmtPr", tickers: [] },
  { symbol: "G6722", name: "Finance-ETF / ETN", tickers: [] },
  { symbol: "G8073", name: "Finance-Invest Bnk/Bkrs", tickers: [] },
  { symbol: "G8072", name: "Finance-Investment Mgmt", tickers: [] },
  { symbol: "G6731", name: "Finance-Mortgage REIT", tickers: [] },
  { symbol: "G6151", name: "Finance-Mrtg&Rel Svc", tickers: [] },
  { symbol: "G6730", name: "Finance-Property REIT", tickers: [] },
  { symbol: "G6725", name: "Finance-Publ Inv Fd-Bal", tickers: [] },
  { symbol: "G6723", name: "Finance-Publ Inv Fd-Bond", tickers: [] },
  { symbol: "G3442", name: "Finance-Publ Inv Fd-Eqt", tickers: [] },
  { symbol: "G6724", name: "Finance-Publ Inv Fd-Glbl", tickers: [] },
  { symbol: "G6120", name: "Finance-Savings & Loan", tickers: [] },
  { symbol: "G6412", name: "Financial Svcs-Specialty", tickers: [] },
  { symbol: "G2070", name: "Food-Confectionery", tickers: [] },
  { symbol: "G2020", name: "Food-Dairy Products", tickers: [] },
  { symbol: "G2041", name: "Food-Grain & Related", tickers: [] },
  { symbol: "G2010", name: "Food-Meat Products", tickers: [] },
  { symbol: "G2092", name: "Food-Misc Preparation", tickers: [] },
  { symbol: "G2091", name: "Food-Packaged", tickers: [] },
  { symbol: "G7950", name: "Funeral Svcs & Rel", tickers: [] },
  { symbol: "G3631", name: "Hsehold-Appliances/Wares", tickers: [] },
  { symbol: "G2510", name: "Hsehold/Office Furniture", tickers: [] },
  { symbol: "G6320", name: "Insurance-Acc & Health", tickers: [] },
  { symbol: "G6410", name: "Insurance-Brokers", tickers: [] },
  { symbol: "G1009", name: "Insurance-Diversified", tickers: [] },
  { symbol: "G6310", name: "Insurance-Life", tickers: [] },
  { symbol: "G6330", name: "Insurance-Prop/Cas/Titl", tickers: [] },
  { symbol: "G3334", name: "Internet-Content", tickers: [] },
  { symbol: "G3586", name: "Internet-Network Sltns", tickers: [] },
  { symbol: "G7901", name: "Leisure-Gaming/Equip", tickers: [] },
  { symbol: "G7011", name: "Leisure-Lodging", tickers: [] },
  { symbol: "G7810", name: "Leisure-Movies & Related", tickers: [] },
  { symbol: "G3949", name: "Leisure-Products", tickers: [] },
  { symbol: "G7900", name: "Leisure-Services", tickers: [] },
  { symbol: "G3941", name: "Leisure-Toys/Games/Hobby", tickers: [] },
  { symbol: "G7903", name: "Leisure-Travel Booking", tickers: [] },
  { symbol: "G3531", name: "Machinery-Constr/Mining", tickers: [] },
  { symbol: "G3522", name: "Machinery-Farm", tickers: [] },
  { symbol: "G3569", name: "Machinery-Gen Industrial", tickers: [] },
  { symbol: "G3537", name: "Machinery-Mtl Hdlg/Autmn", tickers: [] },
  { symbol: "G3541", name: "Machinery-Tools & Rel", tickers: [] },
  { symbol: "G2731", name: "Media-Books", tickers: [] },
  { symbol: "G2712", name: "Media-Diversified", tickers: [] },
  { symbol: "G2711", name: "Media-Newspapers", tickers: [] },
  { symbol: "G2721", name: "Media-Periodicals", tickers: [] },
  { symbol: "G4830", name: "Media-Radio/Tv", tickers: [] },
  { symbol: "G8063", name: "Medical-Biomed/Biotech", tickers: [] },
  { symbol: "G1005", name: "Medical-Diversified", tickers: [] },
  { symbol: "G2830", name: "Medical-Ethical Drugs", tickers: [] },
  { symbol: "G8064", name: "Medical-Generic Drugs", tickers: [] },
  { symbol: "G8060", name: "Medical-Hospitals", tickers: [] },
  { symbol: "G8059", name: "Medical-Long-term Care", tickers: [] },
  { symbol: "G8061", name: "Medical-Managed Care", tickers: [] },
  { symbol: "G1031", name: "Medical-Outpnt/Hm Care", tickers: [] },
  { symbol: "G2831", name: "Medical-Products", tickers: [] },
  { symbol: "G8058", name: "Medical-Research Eqp/Svc", tickers: [] },
  { symbol: "G1044", name: "Medical-Services", tickers: [] },
  { symbol: "G3840", name: "Medical-Supplies", tickers: [] },
  { symbol: "G3831", name: "Medical-Systems/Equip", tickers: [] },
  { symbol: "G5022", name: "Medical-Whlsle Drg/Suppl", tickers: [] },
  { symbol: "G5091", name: "Metal Prds-Distributor", tickers: [] },
  { symbol: "G3499", name: "Metal Proc & Fabrication", tickers: [] },
  { symbol: "G1040", name: "Mining-Gold/Silver/Gems", tickers: [] },
  { symbol: "G1099", name: "Mining-Metal Ores", tickers: [] },
  { symbol: "G1002", name: "Office Supplies Mfg", tickers: [] },
  { symbol: "G1312", name: "Oil&Gas-Cdn Expl&Prod", tickers: [] },
  { symbol: "G1381", name: "Oil&Gas-Drilling", tickers: [] },
  { symbol: "G1380", name: "Oil&Gas-Field Services", tickers: [] },
  { symbol: "G1317", name: "Oil&Gas-Integrated", tickers: [] },
  { symbol: "G1315", name: "Oil&Gas-Intl Expl&Prod", tickers: [] },
  { symbol: "G3533", name: "Oil&Gas-Machinery/Equip", tickers: [] },
  { symbol: "G2900", name: "Oil&Gas-Refining/Mktg", tickers: [] },
  { symbol: "G1311", name: "Oil&Gas-Royalty Trust", tickers: [] },
  { symbol: "G4922", name: "Oil&Gas-Transprt/Pipelne", tickers: [] },
  { symbol: "G1310", name: "Oil&Gas-U S Expl&Prod", tickers: [] },
  { symbol: "G2621", name: "Paper & Paper Products", tickers: [] },
  { symbol: "G3566", name: "Pollution Control", tickers: [] },
  { symbol: "G6732", name: "Real Estate Dvlpmt/Ops", tickers: [] },
  { symbol: "G5621", name: "Retail-Apparel/Shoes/Acc", tickers: [] },
  { symbol: "G1094", name: "Retail-Consumer Elec", tickers: [] },
  { symbol: "G8077", name: "Retail-Department Stores", tickers: [] },
  { symbol: "G5331", name: "Retail-Discount&Variety", tickers: [] },
  { symbol: "G5912", name: "Retail-Drug Stores", tickers: [] },
  { symbol: "G5710", name: "Retail-Home Furnishings", tickers: [] },
  { symbol: "G3559", name: "Retail-Internet", tickers: [] },
  { symbol: "G5342", name: "Retail-Leisure Products", tickers: [] },
  { symbol: "G5321", name: "Retail-Mail Order&Direct", tickers: [] },
  { symbol: "G8076", name: "Retail-Major Disc Chains", tickers: [] },
  { symbol: "G5812", name: "Retail-Restaurants", tickers: [] },
  { symbol: "G5391", name: "Retail-Specialty", tickers: [] },
  { symbol: "G5411", name: "Retail-Super/Mini Mkts", tickers: [] },
  { symbol: "G5013", name: "Retail/Whlsle-Auto Parts", tickers: [] },
  { symbol: "G5014", name: "Retail/Whlsle-Automobile", tickers: [] },
  { symbol: "G5211", name: "Retail/Whlsle-Bldg Prds", tickers: [] },
  { symbol: "G5971", name: "Retail/Whlsle-Jewelry", tickers: [] },
  { symbol: "G5313", name: "Retail/Whlsle-Office Sup", tickers: [] },
  { symbol: "G3999", name: "Security/Sfty", tickers: [] },
  { symbol: "G2840", name: "Soap & Clng Preparatns", tickers: [] },
  { symbol: "G3312", name: "Steel-Producers", tickers: [] },
  { symbol: "G3313", name: "Steel-Specialty Alloys", tickers: [] },
  { symbol: "G4811", name: "Telecom Svcs-Foreign", tickers: [] },
  { symbol: "G4896", name: "Telecom Svcs-Cable/Satl", tickers: [] },
  { symbol: "G4891", name: "Telecom Svcs-Integrated", tickers: [] },
  { symbol: "G4892", name: "Telecom Svcs-Wireless", tickers: [] },
  { symbol: "G4893", name: "Telecom-Cable/Satl Eqp", tickers: [] },
  { symbol: "G4894", name: "Telecom-Consumer Prods", tickers: [] },
  { symbol: "G3552", name: "Telecom-Fiber Optics", tickers: [] },
  { symbol: "G4895", name: "Telecom-Infrastructure", tickers: [] },
  { symbol: "G2100", name: "Tobacco", tickers: [] },
  { symbol: "G4512", name: "Transport-Air Freight", tickers: [] },
  { symbol: "G4511", name: "Transportation-Airline", tickers: [] },
  { symbol: "G8075", name: "Transportation-Equip Mfg", tickers: [] },
  { symbol: "G4700", name: "Transportation-Logistics", tickers: [] },
  { symbol: "G4010", name: "Transportation-Rail", tickers: [] },
  { symbol: "G4411", name: "Transportation-Ship", tickers: [] },
  { symbol: "G4210", name: "Transportation-Truck", tickers: [] },
  { symbol: "G1010", name: "Trucks & Parts-Hvy Duty", tickers: [] },
  { symbol: "G4942", name: "Utility-Diversified", tickers: [] },
  { symbol: "G4911", name: "Utility-Electric Power", tickers: [] },
  { symbol: "G4920", name: "Utility-Gas Distribution", tickers: [] },
  { symbol: "G4941", name: "Utility-Water Supply", tickers: [] },
  { symbol: "G3577", name: "Wholesale-Electronics", tickers: [] },
  { symbol: "G5040", name: "Wholesale-Food", tickers: [] },
];

// Derive sector from group name (text before first hyphen, or full name if no hyphen)
function deriveSector(name: string): string {
  // Special cases for multi-word prefixes
  if (name.startsWith("Auto/Truck")) return "Auto/Truck";
  if (name.startsWith("Comp Sftwr") || name.startsWith("Computer Sftwr")) return "Computer Software";
  if (name.startsWith("Computer-")) return "Computer Hardware";
  if (name.startsWith("Comml Svcs")) return "Commercial Services";
  if (name.startsWith("Consumer Prod")) return "Consumer Products";
  if (name.startsWith("Consumer Svcs")) return "Consumer Services";
  if (name.startsWith("Elec-")) return "Electronics";
  if (name.startsWith("Electrical")) return "Electrical";
  if (name.startsWith("Electronic")) return "Electronic";
  if (name.startsWith("Financial Svcs")) return "Financial Services";
  if (name.startsWith("Hsehold") || name.startsWith("Hsehold/Office")) return "Household";
  if (name.startsWith("Metal Prds") || name.startsWith("Metal Proc")) return "Metals";
  if (name.startsWith("Oil&Gas")) return "Oil & Gas";
  if (name.startsWith("Retail/Whlsle")) return "Retail/Wholesale";
  if (name.startsWith("Telecom Svcs")) return "Telecom Services";
  if (name.startsWith("Telecom-")) return "Telecom Equipment";
  if (name.startsWith("Transport") || name.startsWith("Transportation")) return "Transportation";
  if (name.startsWith("Trucks & Parts")) return "Transportation";

  const hyphenIdx = name.indexOf("-");
  if (hyphenIdx > 0) return name.substring(0, hyphenIdx);
  return name;
}

// Get all groups organized by sector
export function getIBDSectors(): IBDSector[] {
  const sectorMap = new Map<string, IBDGroup[]>();

  for (const group of IBD_GROUPS) {
    const sector = deriveSector(group.name);
    if (!sectorMap.has(sector)) {
      sectorMap.set(sector, []);
    }
    sectorMap.get(sector)!.push(group);
  }

  return Array.from(sectorMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([name, groups]) => ({
      name,
      groups: groups.sort((a, b) => a.name.localeCompare(b.name)),
    }));
}

// Lookup: get group by symbol
export function getGroupBySymbol(symbol: string): IBDGroup | undefined {
  return IBD_GROUPS.find((g) => g.symbol === symbol);
}

// Get all tickers across all groups (for "Scan All")
export function getAllIBDTickers(): string[] {
  const all = new Set<string>();
  for (const group of IBD_GROUPS) {
    for (const ticker of group.tickers) {
      all.add(ticker);
    }
  }
  return Array.from(all).sort();
}
