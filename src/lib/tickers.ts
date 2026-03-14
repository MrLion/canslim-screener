// S&P 500 + select NASDAQ 100 tickers for CAN SLIM screening
// This is a representative subset focused on liquid, widely-held stocks
// Last updated: 2026-03-14 — removed delisted tickers, fixed renamed symbols

export const SP500_TICKERS = [
  "AAPL", "ABBV", "ABT", "ACN", "ADBE", "ADI", "ADM", "ADP", "ADSK", "AEE",
  "AEP", "AES", "AFL", "AIG", "AIZ", "AJG", "AKAM", "ALB", "ALGN", "ALK",
  "ALL", "ALLE", "AMAT", "AMCR", "AMD", "AME", "AMGN", "AMP", "AMT", "AMZN",
  "ANET", "AON", "AOS", "APA", "APD", "APH", "APTV", "ARE", "ATO",
  "AVB", "AVGO", "AVY", "AWK", "AXP", "AZO", "BA", "BAC", "BAX",
  "BBWI", "BBY", "BDX", "BEN", "BF-B", "BIIB", "BIO", "BK", "BKNG", "BKR",
  "BLK", "BMY", "BR", "BRK-B", "BRO", "BSX", "BWA", "BXP", "C", "CAG",
  "CAH", "CARR", "CAT", "CB", "CBOE", "CBRE", "CCI", "CCL", "DAY", "CDNS",
  "CDW", "CE", "CEG", "CF", "CFG", "CHD", "CHRW", "CHTR", "CI", "CINF",
  "CL", "CLX", "CMA", "CMCSA", "CME", "CMG", "CMI", "CMS", "CNC", "CNP",
  "COF", "COO", "COP", "COST", "CPB", "CPRT", "CPT", "CRL", "CRM", "CSCO",
  "CSGP", "CSX", "CTAS", "CTRA", "CTSH", "CTVA", "CVS", "CVX", "CZR",
  "D", "DAL", "DD", "DE", "DG", "DGX", "DHI", "DHR", "DIS",
  "DLR", "DLTR", "DOC", "DOV", "DOW", "DPZ", "DRI", "DTE", "DUK", "DVA",
  "DVN", "DXC", "DXCM", "EA", "EBAY", "ECL", "ED", "EFX", "EIX", "EL",
  "EMN", "EMR", "ENPH", "EOG", "EPAM", "EQIX", "EQR", "EQT", "ES", "ESS",
  "ETN", "ETR", "ETSY", "EVRG", "EW", "EXC", "EXPD", "EXPE", "EXR", "F",
  "FANG", "FAST", "FBIN", "FCX", "FDS", "FDX", "FE", "FFIV", "FIS",
  "FITB", "CPAY", "FMC", "FOX", "FOXA", "FRT", "FTNT", "FTV", "GD",
  "GE", "GILD", "GIS", "GL", "GLW", "GM", "GNRC", "GOOG", "GOOGL", "GPC",
  "GPN", "GRMN", "GS", "GWW", "HAL", "HAS", "HBAN", "HCA", "HD",
  "HIG", "HII", "HLT", "HOLX", "HON", "HPE", "HPQ", "HRL", "HSIC",
  "HST", "HSY", "HUM", "HWM", "IBM", "ICE", "IDXX", "IEX", "IFF", "ILMN",
  "INCY", "INTC", "INTU", "INVH", "IP", "IQV", "IR", "IRM", "ISRG",
  "IT", "ITW", "IVZ", "J", "JBHT", "JCI", "JKHY", "JNJ", "JPM",
  "KDP", "KEY", "KEYS", "KHC", "KIM", "KLAC", "KMB", "KMI", "KMX",
  "KO", "KR", "L", "LDOS", "LEN", "LH", "LHX", "LIN", "LKQ", "LLY",
  "LMT", "LNC", "LNT", "LOW", "LRCX", "LUMN", "LUV", "LVS", "LW", "LYB",
  "LYV", "MA", "MAA", "MAR", "MAS", "MCD", "MCHP", "MCK", "MCO", "MDLZ",
  "MDT", "MET", "META", "MGM", "MHK", "MKC", "MKTX", "MLM", "MMC", "MMM",
  "MNST", "MO", "MOH", "MOS", "MPC", "MPWR", "MRK", "MRNA", "MS",
  "MSCI", "MSFT", "MSI", "MTB", "MTCH", "MTD", "MU", "NCLH", "NDAQ", "NDSN",
  "NEE", "NEM", "NFLX", "NI", "NKE", "NOC", "NOW", "NRG", "NSC", "NTAP",
  "NTRS", "NUE", "NVDA", "NVR", "NWL", "NWS", "NWSA", "NXPI", "O", "ODFL",
  "OGN", "OKE", "OMC", "ON", "ORCL", "ORLY", "OTIS", "OXY", "PAYC",
  "PAYX", "PCAR", "PCG", "PEG", "PEP", "PFE", "PFG", "PG", "PGR",
  "PH", "PHM", "PKG", "RVTY", "PLD", "PM", "PNC", "PNR", "PNW", "POOL",
  "PPG", "PPL", "PRU", "PSA", "PSX", "PTC", "PVH", "PWR", "PYPL",
  "QCOM", "QRVO", "RCL", "EG", "REG", "REGN", "RF", "RHI", "RJF", "RL",
  "RMD", "ROK", "ROL", "ROP", "ROST", "RSG", "RTX", "SBAC", "SBNY", "SBUX",
  "SCHW", "SEE", "SHW", "SJM", "SLB", "SNA", "SNPS", "SO", "SPG",
  "SPGI", "SRE", "STE", "STT", "STX", "STZ", "SWK", "SWKS", "SYF", "SYK",
  "SYY", "T", "TAP", "TDG", "TDY", "TECH", "TEL", "TER", "TFC", "TFX",
  "TGT", "TMO", "TMUS", "TPR", "TRGP", "TRMB", "TROW", "TRV", "TSCO", "TSLA",
  "TSN", "TT", "TTWO", "TXN", "TXT", "TYL", "UAL", "UDR", "UHS", "ULTA",
  "UNH", "UNP", "UPS", "URI", "USB", "V", "VFC", "VICI", "VLO", "VMC",
  "VNO", "VRSK", "VRSN", "VRTX", "VTR", "VTRS", "VZ", "WAB", "WAT",
  "WBD", "WDC", "WEC", "WELL", "WFC", "WHR", "WM", "WMB", "WMT", "WRB",
  "WST", "WTW", "WY", "WYNN", "XEL", "XOM", "XRAY", "XYL", "YUM",
  "ZBH", "ZBRA", "ZION", "ZTS"
];

// Additional high-growth NASDAQ names not in S&P 500
export const EXTRA_NASDAQ = [
  "ABNB", "ARM", "COIN", "CRWD", "DASH", "DDOG", "DUOL", "FTAI",
  "GRAB", "IOT", "MELI", "MDB", "NET", "PANW", "PLTR", "SHOP",
  "SMCI", "SNOW", "SPOT", "XYZ", "TTD", "UBER", "WDAY", "ZS"
];

export const ALL_TICKERS = [...new Set([...SP500_TICKERS, ...EXTRA_NASDAQ])];
