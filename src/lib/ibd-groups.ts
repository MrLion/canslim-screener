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
  { symbol: "G6023", name: "Banks-Midwest", tickers: ["NIC","NPB","ATLO","ISBA","SRCE","OVBC","BFC","CPBI","THFF","QCRH","SMBC","MBWM","ALRS","BY","OSBC","BWB","WTFC","UBCP","BUSE","FMBH","GABC","HWBK","FBIZ","CIVB","ASB","HBT","EQBK","UMBF","FNWD","WTBA","PEBO","ONB","CBC","IBCP","MBIN","PRK","NSTS","LCNB","HYNE","SBFG","GSBC","LKFN","LARK","FMAO","MSBI","COFS","EFSC","FMNB","FRME","CBSH","HBNC","INBK"] },
  { symbol: "G6020", name: "Banks-Money Center", tickers: ["SAN","BK","TD","HSBC","BBVA","BNPQY","RY","BMO","NWG","BNS","LYG","MFG","MS","MUFG","GS","DBSDY","SMFG","BCS","JPM","C","DB","WFC","SUTNY","UBS","BAC","PSTVY","AGBK"] },
  { symbol: "G6021", name: "Banks-Northeast", tickers: ["CMTV","OBT","BVFL","BWFG","NBBK","WBS","PKBK","CBNA","WSBK","ASRV","MBBC","AMAL","EBC","VLY","AROW","NBN","FRAF","CBFV","CFG","INDB","PDLB","MRBK","CCNE","PGC","DCOM","PBFS","TMP","PFS","ECBK","CUBI","CLBK","CAC","UNTY","SHBI","UVSP","MCB","MTB","ACNB","FNB","FNLC","LNKB","SRBK","FISI","CHMG","FCF","HIFS","FFIC","CNOB","CZNC","BSBK","NWFL","MPB","ORRF","WASH","BPRN","BHB","FUNC","CBU","PFIS","STBA","BLFY","CZFS","NBTB","FDBC","TBBK","FRBA","PNBK","AVBC","EGBN","CBNK","UNB","HNVR","GLBZ","BCBP"] },
  { symbol: "G6022", name: "Banks-Southeast", tickers: ["BOTJ","RRBI","NKSH","PEBK","FBNC","FUSB","SFST","SMBK","PTBS","HTB","BPOP","ISTR","FDSB","FRST","FVCB","FCCO","UBSI","OPHC","FBLA","CBAN","CCBG","PCLB","MNSB","ABCB","CTBI","AMTB","CARE","BRBS","FBP","AFBI","TRMK","FXNC","FHN","FCBC","WSBC","HWC","JMSB","OBK","FBK","CFFI","FGBI","LOB","SSB","CHCO","VABK","OFG","RBCAA","SFBS","AUB","USCB","MVBF","RNST","TOWN","SBCF","CBK","CLST","HOMB","FCNCA","BHRB","UCB","MCBS","SYBT","SFNC","PNFP","COSO","OZK","AUBN","EFSI","BAFN"] },
  { symbol: "G1008", name: "Banks-Super Regional", tickers: ["NTRS","PNC","USB","FULT","FITB","KEY","RF","TFC","HBAN"] },
  { symbol: "G6024", name: "Banks-West/Southwest", tickers: ["FSBC","HTBK","TSBK","PLBC","TCBI","CWBC","TCBX","EBMT","MCHB","BOH","FIBK","BOKF","EWBC","CFR","BSRR","TCBK","BCAL","CPF","OVLY","PCB","UBFO","STEL","HTH","CATY","TCBS","MYFW","SPFI","HFWA","HAFC","PFBC","WAFD","AVBH","FNWB","BCML","NRIM","FHB","IBOC","WABC","ZION","HOPE","BMRC","GBFH","BANR","WAL","FINW","NBHC","BANF","FSUN","FSBW","BSVN","CVBF","SFBC","FFIN","GBCI","PB","COLB","FFWM","SBSI","TFIN"] },
  { symbol: "G2085", name: "Beverages-Alcoholic", tickers: ["KNBWY","ABEV","BUD","SAM","AGCC","HEINY","STZ","TAPA","DEO","TAP","BFA","BFB","PRNDY","CCU","IPST","MGPI","SBEV","WVVI","IBG","EPSM"] },
  { symbol: "G2086", name: "Beverages-Non-Alcoholic", tickers: ["COKE","COCO","CCHGY","MNST","CCEP","AKOA","KOF","CELH","AKOB","KO","PRMB","FMX","BUDA","STBFY","KDP","REED","FIZZ","BRFH","BRCB","ZVIA","WEST","CHA","REBN","MWYN"] },
  { symbol: "G3585", name: "Bldg-A/C & Heating Prds", tickers: ["FIX","MOD","THR","TT","AAON","LMB","AOS","CSW","LII","DKILY","WSO","WSOB","CARR","GCDT","AIRJ","WXM"] },
  { symbol: "G8074", name: "Bldg-Cement/Concrt/Ag", tickers: ["USLM","CPAC","MLM","AHCHY","VMC","KNF","CRH","CX","EXP","BBCP","SMID","LOMA"] },
  { symbol: "G3299", name: "Bldg-Constr Prds/Misc", tickers: ["SPB","WTS","ACA","TILE","MWA","WMS","FERG","TTAM","LYTS","SSD","AWI","BLD","ASGLY","AYI","GFF","CNM","AMRZ","MIMI","APT","LGN","SWIM","NX","MAS","EFOI","APOG","TGLS","TREX","OC","RETO","JHX","AEHL","MHK","FBGL","FBIN","BLDR","HCMLY","WBRBY","ATKR","AMWD","SMJF","TIC","NCL","MSGY","CAPT","CAPS","CSTE","JELD"] },
  { symbol: "G3548", name: "Bldg-Hand Tools", tickers: ["TTC","SNA","TTNDY","MKTAY","SWK"] },
  { symbol: "G1621", name: "Bldg-Heavy Construction", tickers: ["STRL","ECG","AGX","PWR","GVA","ROAD","WLDN","PRIM","MTZ","TPC","FLR","CDNL","GLDD","FER","SHIM","PHOE","J","MWH","ACM","ORN","SKYH","BBU","MGN","SKK","SKBL","SLND","ONEG"] },
  { symbol: "G7340", name: "Bldg-Maintenance & Svc", tickers: ["IESC","EME","MG","MYRG","IBP","JLHL","FTDR","ROL","ABM","PMEC","EJH","BV","MSW"] },
  { symbol: "G3791", name: "Bldg-Mobile/Mfg & Rv", tickers: ["LCII","PATK","CVCO","WGO","THO","SKY"] },
  { symbol: "G1520", name: "Bldg-Resident/Comml", tickers: ["TOL","CHCI","SKHSY","TPH","MRP","PHM","GRBK","MHO","TMHC","NVR","DHI","KBH","DFH","SDHC","HOV","MTH","CCS","LENB","BZH","UHG","LEN","LGIH","OFAL"] },
  { symbol: "G2400", name: "Bldg-Wood Prds", tickers: ["UFPI","WFG","LPX","BCC","NWGL"] },
  { symbol: "G1800", name: "Chemicals-Agricultural", tickers: ["CF","LXU","NTR","IPI","SQM","YARIY","UAN","MOS","SMG","AVD","ICL","ENFY","NXTS","FMC","LVRO"] },
  { symbol: "G2818", name: "Chemicals-Basic", tickers: ["CMP","DD","BAK","HWKN","ECVT","BASFY","LYB","CE","WLKP","WLK","NTIC","HUN","GURE"] },
  { symbol: "G2851", name: "Chemicals-Paints", tickers: ["SHW","AXTA","PPG","RPM","AKZOY"] },
  { symbol: "G3079", name: "Chemicals-Plastics", tickers: ["CMT","TG","AVNT","LOOP","DOW","ASIX","PCT","EMN","WFF","TSEOF"] },
  { symbol: "G2899", name: "Chemicals-Specialty", tickers: ["PRM","AHKSY","BCPC","LIN","ESI","ALB","HENKY","APD","GEVO","MTX","KOP","WDFC","LZAGY","SND","NGVT","FUL","SHECY","RYAM","KWR","CC","MEOH","CNEY","OLN","TROX","NVZMY","CBT","CITR","FF","NEU","IOSP","LXFR","FSI","ASH","AQMS","LNZA","ARKAY","SCL","NAGE","VHI","ASPI","BGLC","OEC","KRO","ASPN","EXOZ","TANH"] },
  { symbol: "G7310", name: "Comml Svcs-Advertising", tickers: ["BUUU","STGW","LAMR","SWAG","OMC","QMMM","FLNT","HAO","DSP","PUBGY","TBLA","PERI","PRSU","MAX","CCO","MCHX","CREX","CRTO","TTD","MNTN","NCMI","GAMB","ASST","TULP","QNST","VSME","WPP","EEX","PUBM","TEAD","KNRX","SGRP","BOC","INTJ","HHS","SST","TNMG","IBTA","BAOS","THRY","UBXG","TDIC","STFS","DTCX","FTRK","LZMH","TJGC"] },
  { symbol: "G8242", name: "Comml Svcs-Consulting", tickers: ["VSEC","EFTY","SWKH","QXO","LDOS","FCN","STN","TROO","HURN","MMS","ANDG","BWMN","SAIC","KBR","WFCF","EXPO","ROMA","CRAI","PPHC","III","BAH","NIQ","EGG","ZGM","MATH","FOFO","CBZ","SGSOY","ICFI","WAI","REKR","ADV","BMHL","RGP","LICN","RITR","AIOS","ZBAI","VCIG","SHWZ","ACAN"] },
  { symbol: "G2751", name: "Comml Svcs-Document Mgmt", tickers: ["QUAD","PBI","CMPR","ANPA","CRE","ACCL","SFHG","PMAX"] },
  { symbol: "G3441", name: "Comml Svcs-Healthcare", tickers: ["HCSG","SBC","RYOJ","CRVL","HSTM","NRC","HCTI","AGL"] },
  { symbol: "G7394", name: "Comml Svcs-Leasing", tickers: ["AL","AER","GATX","R","WLFC","URI","MGRC","CTOS","ALTG","EQPT","PRG","WSC","HRI","UPBD","MPU","UHALB","UHAL"] },
  { symbol: "G8244", name: "Comml Svcs-Market Rsrch", tickers: ["MCO","SPGI","MORN","RELX","VRSK","SCOR","WTKWY","TRI","FDS","IT","CSGP","RSSS","HWH","BNZI","FORR","SDM","EDHL"] },
  { symbol: "G1001", name: "Comml Svcs-Outsourcing", tickers: ["CSGS","ARMK","UNF","RTO","CTAS","RDVT","HQY","G","EXLS","ADP","VSTS","PAYX","CRDB","CRDA","TTEC","SGC","QH","TNET","CNDT","NSP","SHFS"] },
  { symbol: "G1011", name: "Comml Svcs-Staffing", tickers: ["BGSF","HQI","KELYB","ATLN","STRR","JOB","RCRUY","FA","KFY","BBSI","DLHC","UPWK","MHH","NIXX","AMN","KELYA","ASGN","KFRC","MAN","TBI","CCRN","RHI","GLXG","CLIK","YYGH","BIYA"] },
  { symbol: "G2761", name: "Comp Sftwr-Spec Enterprs", tickers: ["MITK","KARO","AMTM","APP","DSGX","APPF","HUBS","RCAT","YEXT","SPSC","CLBT","TEAM","TYL","BL","TRAK","SEMR","VRRM","VTEX","TONX","LSPD","STEM","JTAI","DV","VERI","NVVE","CLVT","SOUN","CXAI","ECX","INLX","GGRP","ANY","AI"] },
  { symbol: "G3582", name: "Computer Sftwr-Database", tickers: ["NTCT","CFLT","TDC","MDB","DBX","ORCL","ZETA","JG","PRGS","ESTC","CVLT","BOX","WK","AVPT","OTEX","ROC","DTST","VRNS","ULY","PTRN","SMWB","BRAI","WYFI","TGHL"] },
  { symbol: "G3575", name: "Computer Sftwr-Design", tickers: ["PDFS","PTC","CDNS","ADSK","SNPS","BSY","DASTY","SVCO","FIG","U","APPN"] },
  { symbol: "G3270", name: "Computer Sftwr-Desktop", tickers: ["MSFT","ADBE","PD","LIF","VS","CRNC"] },
  { symbol: "G3357", name: "Computer Sftwr-Edu/Media", tickers: ["XNET","ZDGE","SPOT","DAO","UDMY","DUOL","SGN","AMST","NRDY","GNS","MYND","COUR","VTSI","ANGH","HERE","JDZG","NAMI","NTCL"] },
  { symbol: "G3583", name: "Computer Sftwr-Enterprse", tickers: ["RNG","NET","FSLY","MGRT","EGAN","AKAM","DOCN","PLTR","ATEN","TWLO","BNAI","KORE","CCSI","DDOG","LVOX","EGHT","ONTF","RXT","LAWR","FROG","SNOW","PATH","DCBO","DT","KC","CRM","GLBE","CXM","BAND","API","EVCM","NOW","SHOP","WDAY","NTNX","PCTY","IPM","GDDY","LCFY","RSKD","PCOR","YSXT","NBIS","PAYC","FIVN","MANH","IOT","SPT","DUOT","GTM","XZO","WIX","XTIA","ZM","MGNI","MNDY","TTAN","BLKB","DOCU","APPS","SAP","ASUR","BRZE","PSN","ARX","GOAI","ASAN","SWVL","DOMO","KVYO","AIXI","BBAI","CRWV","CDLX","HPAI","FRGT","AEYE","RZLV","CNXC","LAW","FATN","PERF","KLTR","AISP","IFBD","TGL","MNDO","KD","COMP","AUDC","NEXN","YMT","AMPL","LPSN","NAVN","SURG","FRSH","CCC","TUYA","VIA","CMRC","YXT","BZUN","ALIT","BLIV","XTKG","TTGT","ZENV","BLND","MTEK","UPLD","GLOO","HTCR","RCT","NOTE","MAPS","ZENA","WCT","DGNX","RAASY","DAIC","YAAS"] },
  { symbol: "G2821", name: "Computer Sftwr-Financial", tickers: ["OS","CWAN","CURR","NYAX","JKHY","NTWK","BITF","PLTS","PDC","PEGA","INTU","SSNC","FICO","INTA","BILL","ACCS","GWRE","VERX","PGY","QTWO","ACIW","ALKT","OPFI","NCNO","CLPS","YRD","CXT","ZNB","ARBK","WRCDF","AIHS","BTGO","ATCH","ALTS","MKTW","OWLS","ABTC","CANG","DFNS","BGIN","EXFY","AMOD","ATHR"] },
  { symbol: "G3584", name: "Computer Sftwr-Gaming", tickers: ["MSGM","ROLR","SOHU","EA","GXAI","NTES","GRVY","TTWO","GMHS","CTW","NTDOY","PLTK","GDEV","GCL","NEXOY","SEGG","DDI","GIGM","MRDN","RBLX","VTIX","MYPS","BRAG","NCTY","NIPG","SNAL","TRUG","DKI"] },
  { symbol: "G3069", name: "Computer Sftwr-Medical", tickers: ["PRVA","VEEV","CCLD","OPRX","TDOC","DOCS","TBRG","HNGE","PHR","EVH","FORA","WAY","AMWL","CERT","SLP","MSPR","DH","MNDR","GDRX","CTEV","HCAT","EUDA","AGPU","RBOT","VSEE","WEAV","HTFL","WORX"] },
  { symbol: "G3220", name: "Computer Sftwr-Security", tickers: ["MOB","CMCM","CRWD","TLS","FTNT","PANW","OKTA","VRSN","NICE","CHKP","ZS","TENB","QLYS","CGNT","GEN","INVE","S","SAIL","RBRK","DMRC","RPD","INTZ","SVRE","RVSN","HUBC","CISO","ARQQ","NTSK","BB","OSPN","ALAR","CSAI","BTQ","CYCU","OBAI"] },
  { symbol: "G3578", name: "Computer-Data Storage", tickers: ["MU","WDC","STX","SIMO","SNDK","PSTG","NTAP","BLZE","PENG","QMCO"] },
  { symbol: "G3580", name: "Computer-Hardware/Perip", tickers: ["DELL","OSS","LOGI","SMCI","WETH","TACT","CRSR","LNVGY","QBTS","FUJIY","HPQ","QUBT","CRCT","IONQ","INFQ","SCKT","YIBO","HKIT","XRX"] },
  { symbol: "G1004", name: "Computer-Integrated Syst", tickers: ["NATL","DBD","AGYS","VYX","PAR","CYN","RGTI","SOBR","SPPL","FUSE","AZ","ARBB","MASK","MI"] },
  { symbol: "G3574", name: "Computer-Networking", tickers: ["ANET","DGII","BOSC","CSCO","CALX","RDWR","FIEE","LTRX","SILC","EXTR","ALLT","NTGR","DTSS","VEEA","SANG"] },
  { symbol: "G7392", name: "Computer-Tech Services", tickers: ["ISMAY","GCT","CACI","ULS","DAVE","TCGL","HPE","CINT","PLUS","RAMP","AIFF","IBEX","TSSI","SAGT","INGM","IBM","AMADY","RCMT","TASK","CGEMY","FJTSY","CTSH","DOX","GIB","NRILY","EPAM","ACN","CNSWF","CTM","CHOW","CDW","INFY","GLOB","FTCI","DXC","JF","FORTY","UIS","HCKT","WYY","WIT","GDYN","PHUN","NABL","NVNI","AERT","RMNI","INOD","FTFT","CSPI","GTLB","ONFO","NXTT","GRRR","DAVA","PRCH","QNC","LGCL","SUPX","ATGL","MTBLY","BMR","BZAI","GMM","IMTE","SHAZ","ORKT","GLE","MLGO","RPGL","TDTH"] },
  { symbol: "G3651", name: "Consumer Prod-Electronic", tickers: ["DSWL","GRMN","ZEPP","NN","RAY","AXIL","SYNX","SONO","FEBO","CGTL","WLDS","UEIC","KOSS","MSN","TBCH","RIME","GPRO","BOXL"] },
  { symbol: "G1007", name: "Consumer Prod-Specialty", tickers: ["ODC","CVSI","CRON","CWBHF","GPGI","CENT","CENTA","GTBIF","CBAT","VRNO","CURLF","TSNDF","CBWTF","TLRY","NASC","SNDL","CRLBF","TCNNF","YMAT","LFSWF","CRWS","CGC","ULBI","UPXI","GNLN","OGI","AKAN","VUZI","MRMD","ENR","ACB","ZSTK","CANN","YHGJ","MJNA","ISPR","HITI","YCBD","FFNTF","CNTMF","VREOF","AYRWF","BHST","ITHUF","MMNFQ","IMCC","TLLTF","BLMH","AFCG","BMMJ","INCR","CBSTF"] },
  { symbol: "G8240", name: "Consumer Svcs-Education", tickers: ["LINC","LAUR","LGCY","PRDO","EDU","APEI","WAFU","UTI","CVSA","EDTK","STRA","AFYA","LOPE","LRN","TAL","FEDU","BFAM","LFS","AACG","COGNY","STG","RYET","YQ","VSA","MH","GSUN","AMBO","KLC","JZ","IH","SKIL","KIDZ","GOTU","EEIQ","PXED","LXEH","FC","CHGG","COE","GV","ZSPC"] },
  { symbol: "G2653", name: "Containers/Packaging", tickers: ["MYE","SON","KRT","CCDBF","BALL","SEE","CCK","GEFB","GEF","UFPT","AMCR","ATR","OI","SLGN","REYN","SW","SLVM","JBDI","PACK","FWDI"] },
  { symbol: "G2844", name: "Cosmetics/Personal Care", tickers: ["EMPG","NATR","KCDMY","EWCZ","HLF","EL","CL","XWEL","LRLCY","SSDOY","ELF","IPAR","HEGIY","PTNM","PG","ODD","KMB","BON","IFF","PBH","ABLV","KVUE","BRBR","KAOOY","EPC","ATPC","ELAB","NUS","SKIN","COTY","PAVS","LFVN","UNICY","FTLF","MTEX","NAII","OLPX","PRPH","WW","SNYR","USNA","TKLF","HELE","SLSN","YSG","HNST","NHTC","WALD","MED","CABR","DSY","BYAH"] },
  { symbol: "G9900", name: "Diversified Operations", tickers: ["JCI","SEB","HON","MITSY","MIELY","HTHIY","IEP","BAYZF","PHG","BAYRY","EMR","OTTR","ITOCY","SSUMY","MGLD","MDU","BRKA","BRKB","CR","SIEGY","CSL","SOLS","TRS","ROP","MMM","CHE","ORBS","ATXG"] },
  { symbol: "G3664", name: "Elec-Contract Mfg", tickers: ["CLS","TTMI","FN","JBL","FLEX","SANM","BHE","PLXS","NSYS","LWLG","SYPR","KE","KTCC","MSAI","ELTK","MVIS"] },
  { symbol: "G3662", name: "Elec-Misc Products", tickers: ["GLW","DAKT","CPSH","IDCC","ACTG","KN","KYOCY","WATT","ST","SYNA","RELL","IMMR","PDYN","NDEKY","LPL","INTT","ALOT","VHC","TRMB","OLED","DLB","DVLT","NTIP","NNDM","OST","LINK","ZBRA","VIAOY","REFR","MKDW","CETX","NEON","NMGX","GAUZ"] },
  { symbol: "G3611", name: "Elec-Scientific/Msrng", tickers: ["CAMT","KEYS","CGNX","VPG","IPGP","NOVT","ITRI","SLNH"] },
  { symbol: "G3676", name: "Elec-Semicondctor Fablss", tickers: ["RMBS","MPWR","AMD","NVDA","MRVL","AVGO","CRUS","LSCC","SLAB","SITM","CRDO","SMTC","MXL","ALGM","PRSO","GSIT","ALAB","NVTS","WKEY","AIP","ARM","LAES","QUIK","PI","POWI","AMBA","HIMX","QCOM","MOBX","CEVA","PXLW","CAN","AMBQ","INDI","EBON","ICG","AOSL","MBLY","VLN","SQNS"] },
  { symbol: "G3674", name: "Elec-Semiconductor Equip", tickers: ["ATEYY","LRCX","LSRCY","NVMI","ASML","AEIS","KLAC","PLAB","TER","AMAT","FORM","MKSI","ACMR","ONTO","ACLS","Q","KOPN","VECO","CVV","KLIC","ASYS","TRT","ENTG","BESIY","TOELY","COHU","ATOM","UCTT","AEHR","ICHR","ALMU","SMTK"] },
  { symbol: "G3677", name: "Elec-Semiconductor Mfg", tickers: ["TSM","MTSI","TSEM","ADI","ASX","INTC","IMOS","AMKR","IFNNY","UMC","ROG","AXTI","GFS","WOLF","DIOD","ON","SKYT","MRAM","POET","STM","QRVO","TXN","NXPI","AMPG","HOLO","MCHP","SWKS","MX","XPER","DAIO","LEDS","GCTS"] },
  { symbol: "G3621", name: "Electrical-Power/Equipmt", tickers: ["VRT","SEI","POWL","ALNT","NVT","ABBNY","BWXT","ENS","AZZ","HUBB","SMERY","AME","ETN","ROK","SBGSY","TURB","BW","RRX","GTES","YASKY","SES","OESX","WRTBY","FELE","GNRC","SLDP","SKYX","AMSC","MAGH","LNKS","APWC","SOTGY","XPON","ADSE","FPS","NJDCY","EPOW","GPUS","DFLI","EZGO","GWH","FLUX","SDST","MVST","EVGO","EOSE","PPSI","IPWR","EM","ELPW","BEEM","TOSYY","NVX","POLA","ENVX","ELBM","TGEN","ENGS","CCTG","RAYA"] },
  { symbol: "G3680", name: "Electronic-Parts", tickers: ["BELFA","BELFB","APH","PKE","VICR","LASR","COHR","TEL","LFUS","TTDKY","WCC","APELY","ARW","AVT","CTS","TRNS","MRAAY","VSH","NVEC","CYATY","AIRG","SELX","MEI"] },
  { symbol: "G1318", name: "Energy-Alternative/Other", tickers: ["ENLT","ALTO","REX","GEV","CWENA","CWEN","AMPX","BE","ORA","XIFR","BEP","LEU","GPRE","BLDP","KEN","ELLO","AMTX","VWDRY","AMRC","NRGV","PLUG","FLNC","ADNH","TE","BEPC","BWEN","IMSR","XCH","CEG","FCEL","CLNE","NMG","OKLO","HTOO","NAAS","LTBR","GRFXY","VGAS","RNW","MNTK","CHPT","ORGN","STI","OPAL","OPTT","BLNK","NPWR","BESS","CLIR","OIGBQ","SMR","CETY","CREG","NNE","ZOOZ","NKLR","FRMI","BNRG"] },
  { symbol: "G1319", name: "Energy-Coal", tickers: ["ARLP", "GLNCY", "NRP", "AREC", "HCC", "HNRG", "BTU", "CNR", "NC", "AMR", "METCB", "METC", "SXC"] },
  { symbol: "G1320", name: "Energy-Solar", tickers: ["NXT", "SHLS", "TYGO", "SUNE", "SPRU", "SEDG", "FSLR", "ASTI", "RUN", "ARRY", "DQ", "TOYO", "ENPH", "JKS", "VIVO", "MAXN", "NEOV", "SMXT", "SPWR", "CSIQ", "SUUN", "ZEO", "FGL", "PN"] },
  { symbol: "G6146", name: "Finance-Blank Check", tickers: ["COLA", "PLMK", "UYSC", "TAVI", "TDAC", "TVAI", "SVCC", "TACH", "WTG", "PGAC", "NTWO", "LPBB", "MLAC", "NHIC", "NOEM", "DMAA", "CHAR", "APAD", "ATII", "FGMC", "HVII", "IPEX", "JACS", "FERA", "BEAG", "OACC", "DNAB", "ENTF", "CEPT", "HWKZ", "VBOC", "VACH", "ALOR", "VCIC", "BRIV", "YHNA", "CHPG", "INAC", "DTSQ", "FSHP", "AFJK", "LKSP", "CAPN", "CEPF", "GSRF", "MEOA", "RIBB", "RANG", "SDHI", "SOUL", "IPOD", "KFII", "FVN", "GSHR", "DRDB", "FACT", "BSAA", "AACB", "ANSC", "BDCI", "BKHA", "CAEP", "ASPC", "ALDF", "KOYN", "ORIQ", "PACH", "OBA", "LPAA", "ETHM", "ALF", "MACI", "GPAT", "GRAF", "POLE", "SIMA", "LHC", "KVSA", "CORS", "HSPT", "MBAV", "TACO", "CEPV", "EOCW", "RDAC", "ALIS", "EURK", "SBXD", "SCAQ", "KVAC", "LEGT", "MBAC", "HYAC", "BAYA", "CUB", "HMA", "IBAC", "DISA", "RFAI", "QUMS", "LAFA", "DMII", "CCVI", "APAC", "FRXB", "GIG", "ESHA", "QETA", "SPEG", "CEPS", "WLAC", "TWLV", "ALUB", "ALCY", "BCAR", "BLUW", "COPL", "EGHA", "KCHV", "GTERA", "TLNC", "SZZL", "SSEA", "QSEA", "PAII", "RAAQ", "RAC", "LWAC", "LCCC", "NMP", "TWCB", "CEPO", "IPCX", "SPKL", "SOCA", "TDWD", "VNME", "WSTN", "XRPN", "YCY", "MKLY", "MMTX", "LFAC", "LOKV", "SCII", "SAAQ", "OYSE", "HVMC", "JENA", "EMIS", "EVAC", "EVOX", "FIGX", "FMIV", "CCIX", "CGCT", "CHEC", "BPAC", "CRAC", "CRAQ", "BBCQ", "AXIN", "BACC", "APXT", "AIIA", "FATP", "GIW", "FORL", "FVAV", "GPAC", "FGII", "DYOR", "KBON", "ITHA", "IRAB", "KTWO", "LATA", "IEAG", "IGAC", "GTEN", "HCMA", "HLXC", "AEAQ", "ALOV", "ARTC", "BCSS", "CMII", "CRAN", "DNMX", "DAAQ", "DBCA", "BLRK", "CCII", "PMTR", "OTGA", "SAC", "SBXE", "SCPQ", "SDAC", "RDAG", "RNGT", "LPCV", "MBVI", "MLAA", "MESH", "MEVO", "NPAC", "OIM", "XSLL", "XFLH", "WPAC", "WENN", "SORN", "SVAQ", "SVAC", "SSAC", "VACI", "TVA", "CLBR", "BIXI", "ARCI", "AEXA", "AACI", "HCAC", "IRHO", "DSAC", "FCRS", "BEBE", "BIII", "BLZR", "BLNG", "CCXI", "SVIV", "XCBE", "ZKP", "ONCH", "LEGO", "RFAM", "PCAP", "TBCP", "UAC", "PTOR", "KRAQ", "KRSP", "NWAX", "GIX", "ACQC", "MCGA", "PCSC", "RTAC", "IGTA", "SDON", "YOUL", "MUZE", "NBRG", "CYAB"] },
  { symbol: "G6147", name: "Finance-Commercial Loans", tickers: ["RBKB", "ESQ", "MFIN", "ANTA", "CION", "MSDL", "CCB", "RWAY", "TSLX", "CGBD", "GSBD", "LPRO", "WD", "CNF", "DXF"] },
  { symbol: "G6148", name: "Finance-Consumer Loans", tickers: ["EZPW", "FCFS", "IX", "ENVA", "NNI", "MNY", "OMF", "SLM", "RM", "SOFI", "ATLC", "CACC", "COF", "OMCC", "ORIO", "AIJTY", "LX", "CPSS", "WRLD", "OPRT", "SNTG", "UPST", "HTT", "SUNLQ"] },
  { symbol: "G6413", name: "Finance-CrdtCard/PmtPr", tickers: ["PAYS", "BFH", "PAGS", "PAYP", "DLO", "CASS", "LSAK", "WEX", "STNE", "AXP", "MA", "PAY", "V", "XYZ", "EEFT", "SEZL", "ADYEY", "EVTC", "GPN", "KSPI", "TOST", "AFRM", "FOUR", "PYPL", "PMTS", "CTLP", "FLYW", "MQ", "IIIV", "PSFE", "RVYL", "RPAY", "OLB", "GDOT", "PAYO", "USIO", "KLAR"] },
  { symbol: "G6722", name: "Finance-ETF / ETN", tickers: [] },
  { symbol: "G8073", name: "Finance-Invest Bnk/Bkrs", tickers: ["IBKR", "SNEX", "RILY", "COHN", "DFDV", "OPY", "XP", "BGC", "SCHW", "AXG", "NMR", "FUTU", "EVR", "PIPR", "SF", "LPLA", "AMP", "TIGR", "PJT", "HLI", "RJF", "HOOD", "AGMH", "FRHC", "MKTX", "LAZ", "MC", "JEF", "PWP", "BULL", "ETOR", "MFI", "BTM", "TOP", "SIEB", "GRAN"] },
  { symbol: "G8072", name: "Finance-Investment Mgmt", tickers: ["SII", "WT", "ABX", "AAMI", "AMG", "FHI", "JHG", "DBRG", "STT", "VCTR", "IVZ", "BIP", "MAAS", "DHIL", "AMTD", "PLUT", "MTC", "HKD", "BEN", "CODI", "BCG", "LIEN", "SEIC", "STEP", "BN", "EFC", "GRNQ", "OTF", "MSIF", "HLNE", "CSWC", "WHG", "GCMG", "NEWT", "PFX", "BKFG", "APO", "ALTI", "EQS", "PAX", "TRIN", "SSSS", "OWL", "BBDC", "MAIN", "MFIC", "TPG", "GAIN", "BLK", "APAM", "NOAH", "DOMH", "NCDL", "TROW", "VINP", "BANX", "AB", "GROW", "GBDC", "FDUS", "PFLT", "SLRC", "HTGC", "BENF", "BX", "GLAD", "HNNA", "WHF", "PSBD", "ARES", "AURE", "RAND", "SAR", "CNS", "HGBL", "OBDC", "ARCC", "NMFC", "PSEC", "BBUC", "CCAP", "EQH", "BVC", "BAM", "RFL", "OXSQ", "SCM", "CG", "BIPC", "GECC", "OCSL", "NCPL", "PNNT", "SAMG", "VRTS", "BCIC", "KKR", "FSK", "TPVG", "TCPC", "OFS", "HRZN", "ACFN", "VTS", "DEFT", "CWD", "MRCC", "ICMB", "INV", "CNNE", "OCCI", "BUR"] },
  { symbol: "G6731", name: "Finance-Mortgage REIT", tickers: ["HASI", "TWO", "ACRE", "MITT", "SACH", "AGNC", "ORC", "DX", "ADAM", "ARR", "ARI", "RITM", "NLY", "IVR", "MFA", "BRSP", "SAFE", "PMT", "CIM", "LADR", "REFI", "CHMI", "LOAN", "AOMR", "BXMT", "ACR", "NREF", "STWD", "GPMT", "SEVN", "ABR", "EARN", "CMTG", "LFT", "RC"] },
  { symbol: "G6151", name: "Finance-Mrtg&Rel Svc", tickers: ["ACT", "VEL", "BLNE", "BETR", "NMIH", "JCAP", "SNFCA", "RDN", "AGMA", "TREE", "FOA", "AGM", "ESNT", "ONIT", "RKT", "UWMC", "FMCC", "FNMA", "FNMAS", "KREF", "TRTX", "LDI", "PFSI", "GHI"] },
  { symbol: "G6730", name: "Finance-Property REIT", tickers: ["EQIX", "WSR", "HST", "CTRE", "PECO", "PSTL", "IRM", "OHI", "TRNO", "SPG", "AHR", "BRX", "CBL", "OUT", "SKT", "PINE", "CRESY", "NTST", "REG", "O", "FRT", "VRE", "GTY", "NSA", "WPC", "VTR", "EPRT", "EGP", "FVR", "BNL", "ELS", "DRH", "ADC", "LTC", "HR", "STAG", "UE", "ILPT", "NNN", "CURB", "PLD", "EPR", "DLR", "STRW", "XHR", "FPI", "FR", "GLPI", "GNL", "CDP", "CLDT", "LAND", "MAC", "UDR", "NHI", "DHC", "SELF", "IVT", "CPT", "SBAC", "RMCO", "WELL", "KRG", "UNIT", "APLE", "SMA", "UHT", "INVH", "SITC", "LRE", "MPT", "PEB", "RHP", "MDRR", "AMH", "ESRT", "REXR", "SILA", "PSA", "PKST", "KIM", "LXP", "ESS", "OLP", "SUI", "EQR", "ALX", "AIV", "FCPT", "LINE", "BFS", "CUBE", "CHCT", "AMT", "AAT", "SHO", "VICI", "SBRA", "PW", "IIPR", "RYN", "EXR", "WY", "WHLR", "HIW", "DOC", "MDV", "BXP", "LPA", "GYRO", "SRG", "NYC", "IRT", "AVB", "DEA", "RLJ", "SVC", "CMCT", "MAA", "NXRT", "CCI", "SQFT", "VNO", "BHM", "CSR", "KRC", "PK", "HPP", "RPT", "AKR", "AHT", "SLG", "GOOD", "UMH", "CUZ", "JBGS", "ONL", "FBRT", "BHR", "BRT", "INN", "PDM", "IHT", "CLPR", "COLD", "BDN", "ELME", "GIPR", "ARE", "DEI"] },
  { symbol: "G6725", name: "Finance-Publ Inv Fd-Bal", tickers: ["BPRE", "ZTR", "DNP", "HTD", "ERH", "CII", "FT", "NCV", "SOR", "GLO", "FOF", "GUG", "FMY", "WIW", "SCD", "PFO", "NIE", "NMAI", "BCAT", "RLTY", "SDHY", "KBDC", "LGI", "CSQ", "JPC", "HYT", "AVK", "FSSL", "CPZ", "PDCC", "SPMC"] },
  { symbol: "G6723", name: "Finance-Publ Inv Fd-Bond", tickers: ["NXDT", "NCA", "BCV", "NMT", "BMN", "CMU", "NMS", "HYB", "MIY", "CXH", "OIA", "RMMZ", "BTT", "NIM", "KSM", "MFV", "ENX", "EOT", "ETX", "CXE", "DTF", "NMI", "VPV", "NXP", "NQP", "NUV", "NUW", "FSD", "DCF", "AFT", "NID", "MQT", "MVT", "MYD", "AIF", "BKN", "BTA", "EVM", "EGF", "ECF", "DSM", "CEV", "CHI", "MUJ", "NMCO", "NCZ", "NAC", "NAZ", "LEO", "HNW", "NRK", "NXJ", "NPV", "PHT", "VKQ", "NUO", "CBH", "MVF", "NDMO", "IHTA", "IIM", "MFM", "BHV", "FMN", "NXN", "NNY", "PMO", "VTN", "VMO", "SBI", "VCV", "PNI", "PPT", "PHD", "EDI", "BFK", "JPT", "EIM", "MHD", "KTF", "NEA", "NAN", "NBH", "MMD", "MMT", "MMU", "MPA", "AFB", "DMB", "HFRO", "PIM", "PMM", "PCQ", "NVG", "NZF", "RFM", "RFMZ", "NKG", "MUE", "MHN", "BFZ", "BLE", "BYM", "NXC", "NMZ", "PML", "RA", "VFL", "VGM", "WIA", "CHY", "BBN", "EVN", "JLS", "IQI", "MYI", "MYN", "MUA", "MUC", "NBB", "NAD", "NKX", "MQY", "IGI", "MHF", "MGF", "FCT", "FLC", "VBF", "VKI", "MUI", "JHS", "BTX", "WEA", "PAI", "NOM", "PGZ", "ERC", "JMM", "MCR", "MIN", "DMF", "DMO", "DMA", "HIO", "GBAB", "BSL", "CIF", "DHF", "BKT", "BGB", "JGH", "JHI", "PFL", "PHK", "SPE", "TSI", "WDI", "OPP", "HYI", "BHK", "FTF", "DSU", "EAD", "INSI", "IHIT", "JQC", "MPV", "EHI", "EVV", "BIT", "VLT", "VVR", "PFN", "PCM", "PCN", "DHY", "HIX", "JRI", "JFR", "KIO", "EVF", "EFR", "EFT", "BRW", "BGX", "ACP", "BLW", "GHY", "PCF", "PTY", "CRF", "ARDC", "MHI", "NHS", "CIK", "FRA", "MCI", "PCK", "PYN", "PNF", "MAV", "BXSL", "PMX", "PZC", "RCS", "PMF", "FSCO", "GOF", "EIC", "XFLT", "OXLC", "ECC"] },
  { symbol: "G3442", name: "Finance-Publ Inv Fd-Eqt", tickers: ["TTP", "RVI", "NTG", "PEO", "BGR", "RCG", "NML", "TYG", "GNT", "BCX", "EMO", "NDP", "KYN", "FEI", "FPL", "RMT", "SRV", "FIF", "NXG", "STK", "UTG", "FEN", "HQL", "IHD", "GAM", "GGN", "GGZ", "BUI", "RGT", "TPZ", "MFD", "GRF", "GLU", "HIE", "IDE", "GCV", "JHAA", "MEGI", "RVT", "ASGI", "CEM", "CTR", "CET", "UTF", "RMI", "BSTZ", "GLQ", "GUT", "GLV", "ACV", "TY", "RSF", "PDT", "HQH", "HEQ", "GDV", "GDL", "EVT", "BME", "NFJ", "RQI", "RMM", "ADX", "BTO", "CCD", "JPI", "JPS", "AIO", "DIAX", "ETB", "BXMX", "FINS", "IGA", "PFD", "QQQX", "THW", "RFI", "PSF", "HPS", "GRX", "FFA", "BDJ", "BMEZ", "ETV", "DFP", "ETG", "HPF", "HPI", "MCN", "NPCT", "STEW", "TEAF", "NPFD", "LDP", "RIV", "RNP", "FFC", "FPF", "FTHY", "GAB", "BST", "JCE", "JRS", "SPXX", "ETJ", "BTZ", "EOI", "DSL", "IGR", "NRO", "NBXG", "THQ", "ETY", "CLM", "ASG", "DXYZ", "ECAT", "EOS", "USA", "ETHE", "GDLC", "GBTC", "LTCN", "CCIF", "CFND", "SVVC"] },
  { symbol: "G6724", name: "Finance-Publ Inv Fd-Glbl", tickers: ["AWP", "TWN", "KF", "ASA", "CEF", "CHN", "JEQ", "FUND", "DPG", "MXE", "EMF", "AEF", "MXF", "CAF", "PDX", "TBLD", "JOF", "CEE", "EOD", "IAE", "TEI", "HTY", "EEA", "BOE", "CHW", "FAM", "EDD", "TDF", "IGD", "EDF", "ETW", "FGB", "EVG", "AOD", "SWZ", "PGP", "CGO", "ETO", "EMD", "EXG", "SABA", "MSD", "VGI", "GGT", "DBL", "AGD", "AWF", "BGY", "IAF", "PAXS", "PDO", "GDO", "FAX", "GF", "DLY", "BWG", "PDI", "ISD", "BGT", "BGH", "MIO", "IIF", "FCO", "HERZ", "IFN"] },
  { symbol: "G6120", name: "Finance-Savings & Loan", tickers: ["CASH", "AMFC", "BBT", "LSBK", "HFBL", "FCAP", "WSFS", "HBCP", "TRST", "WNEB", "KFFB", "AX", "CZWI", "MGYR", "SSBI", "RBB", "FFBC", "WSBF", "KRNY", "CFFN", "GCBC", "GTPS", "FLG", "NECB", "BANC", "BKU", "FSEA", "NWBI", "PROV", "TFSL", "RMBI", "CFBK", "SYF", "NFBK", "RVSB", "OCFC", "BYFC", "PBHC", "CARV"] },
  { symbol: "G6412", name: "Financial Svcs-Specialty", tickers: ["MRX", "CBOE", "ECPG", "JFU", "VIRT", "CME", "CAIXY", "BFST", "CORZ", "OPBK", "OTCM", "IMXI", "TW", "APLD", "NDAQ", "GOLD", "DFIN", "CIFR", "HUT", "MSCI", "HKXCY", "IREN", "CPAY", "ICE", "RELY", "LC", "CRCL", "ALLY", "ASPS", "JFIN", "TAOX", "PRAA", "BR", "WU", "WULF", "AHG", "FUFU", "RIOT", "PRTH", "TRU", "MIAX", "FIGR", "BTBT", "SAIH", "BCSF", "SRL", "GREE", "FIS", "XYF", "XBP", "FISV", "EFX", "LMFA", "MIGI", "FINV", "HRB", "NRDS", "NAVI", "CLSK", "COIN", "MARA", "CNCK", "BTCS", "QFIN", "OSG", "TIPT", "FLD", "EXOD", "MSTR", "BTDR", "BRR", "SOS", "HIVE", "WLTH", "LU", "BTCT", "BKKT", "STEX"] },
  { symbol: "G2070", name: "Food-Confectionery", tickers: ["TR", "RMCF", "HSY", "MDLZ", "SMPL", "MICC", "CHSN", "SOWG"] },
  { symbol: "G2020", name: "Food-Dairy Products", tickers: ["LWAY", "DANOY", "OTLY"] },
  { symbol: "G2041", name: "Food-Grain & Related", tickers: ["ANDE", "ADM", "INGR", "TATYY", "AFRI"] },
  { symbol: "G2010", name: "Food-Meat Products", tickers: ["SFD", "JBS", "MAMA", "TSN", "CALM", "VITL", "TWG", "DDL", "PPC", "HRL", "BTOG", "STKH", "BYND", "WYHG"] },
  { symbol: "G2092", name: "Food-Misc Preparation", tickers: ["FDP", "JBSS", "CVGW", "CHEF", "DOLE", "SXT", "KRYAY", "PLAG", "DDC", "MKCV", "MKC", "CMPGY", "COOT"] },
  { symbol: "G2091", name: "Food-Packaged", tickers: ["STKL", "SENEA", "SENEB", "PEP", "POST", "BGS", "BOF", "UL", "FRPT", "AMBP", "PETZ", "UTZ", "UCFI", "NSRGY", "JJSF", "LW", "MZTI", "NOMD", "SJM", "CIMG", "KHC", "OFRM", "FLO", "CPB", "CAG", "BRID", "GIS", "BRLS", "MEHA", "FAMI", "LSF", "HAIN", "ORIS"] },
  { symbol: "G7950", name: "Funeral Svcs & Rel", tickers: ["CSV", "SCI", "MATW"] },
  { symbol: "G3631", name: "Hsehold-Appliances/Wares", tickers: ["BWMX", "SN", "LCUT", "HBB", "ELUXY", "MIDD", "NWL", "MBC", "WHR", "LBGJ", "COOK", "VIOT", "ATER"] },
  { symbol: "G2510", name: "Hsehold/Office Furniture", tickers: ["FLXS", "XWIN", "CIX", "SGI", "LEG", "HOFT", "HNI", "KEQU", "BSET", "MLKN", "NTZ", "PRPL", "NL", "VIRC"] },
  { symbol: "G6320", name: "Insurance-Acc & Health", tickers: ["AFL", "UNM", "CNO", "HIT", "TRUP", "OSCR"] },
  { symbol: "G6410", name: "Insurance-Brokers", tickers: ["WDH", "AON", "MRSH", "KINS", "WTW", "BRO", "BWIN", "AIFU", "AJG", "NP", "RYAN", "ERIE", "ASIC", "ZBAO", "SLQT", "EHTH", "GOCO"] },
  { symbol: "G1009", name: "Insurance-Diversified", tickers: ["HG", "AAGIY", "HIG", "L", "JXN", "PFG", "MSADY", "PNGAY", "MFC", "ALIZY", "AIZ", "MURGY", "PLMR", "YB", "AXAHY", "AIG", "SSREY", "TWFG", "BOW", "BNT", "EVER", "FGNX", "NODK", "EZRA"] },
  { symbol: "G6310", name: "Insurance-Life", tickers: ["RGA", "GL", "SLF", "PRI", "CIA", "VOYA", "BHF", "PUK", "MET", "PRU", "FG", "CRBG", "LNC", "LIFE", "GNW", "HUIZ", "AEG"] },
  { symbol: "G6330", name: "Insurance-Prop/Cas/Titl", tickers: ["SMPNY", "RNR", "CB", "UVE", "TRV", "HRTG", "ACGL", "JRVR", "WTM", "UFCS", "MCY", "AAME", "SPNT", "FIHL", "AII", "TKOMY", "CINF", "IGIC", "ALL", "AXS", "SLDE", "ACIC", "CNA", "FRFHF", "GLRE", "LMND", "AGO", "SKWD", "RLI", "WRB", "MKL", "KNSL", "ORI", "PGR", "EG", "HGTY", "FAF", "HCI", "AFG", "SAFT", "SIGI", "PRA", "MTG", "HIPO", "GBLI", "MBI", "THG", "DGICB", "HMN", "STC", "CCG", "FNF", "GSHD", "ITIC", "PRHI", "DGICA", "AMSF", "EIG", "RDZN", "KFS", "OXBR", "KG", "KMPR", "ROOT"] },
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
