// Popular stocks grouped by sector for the Explore page
export const POPULAR_STOCKS = [
  // Tech
  { symbol: 'AAPL',  name: 'Apple Inc.',        sector: 'Technology' },
  { symbol: 'MSFT',  name: 'Microsoft Corp.',    sector: 'Technology' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.',      sector: 'Technology' },
  { symbol: 'NVDA',  name: 'NVIDIA Corp.',       sector: 'Technology' },
  { symbol: 'META',  name: 'Meta Platforms',     sector: 'Technology' },
  { symbol: 'AMD',   name: 'Advanced Micro Dev.', sector: 'Technology' },
  { symbol: 'INTC',  name: 'Intel Corp.',        sector: 'Technology' },
  { symbol: 'AVGO',  name: 'Broadcom Inc.',      sector: 'Technology' },
  // Finance
  { symbol: 'JPM',   name: 'JPMorgan Chase',     sector: 'Finance' },
  { symbol: 'BAC',   name: 'Bank of America',    sector: 'Finance' },
  { symbol: 'GS',    name: 'Goldman Sachs',      sector: 'Finance' },
  { symbol: 'V',     name: 'Visa Inc.',          sector: 'Finance' },
  { symbol: 'MA',    name: 'Mastercard Inc.',    sector: 'Finance' },
  { symbol: 'BRK.B', name: 'Berkshire Hathaway', sector: 'Finance' },
  // EV / Auto
  { symbol: 'TSLA',  name: 'Tesla Inc.',         sector: 'Auto & EV' },
  { symbol: 'F',     name: 'Ford Motor Co.',     sector: 'Auto & EV' },
  { symbol: 'GM',    name: 'General Motors',     sector: 'Auto & EV' },
  // E-commerce
  { symbol: 'AMZN',  name: 'Amazon.com Inc.',    sector: 'E-Commerce' },
  { symbol: 'SHOP',  name: 'Shopify Inc.',       sector: 'E-Commerce' },
  { symbol: 'BABA',  name: 'Alibaba Group',      sector: 'E-Commerce' },
  // Healthcare
  { symbol: 'JNJ',   name: 'Johnson & Johnson',  sector: 'Healthcare' },
  { symbol: 'UNH',   name: 'UnitedHealth Group', sector: 'Healthcare' },
  { symbol: 'PFE',   name: 'Pfizer Inc.',        sector: 'Healthcare' },
  // Energy
  { symbol: 'XOM',   name: 'Exxon Mobil Corp.',  sector: 'Energy' },
  { symbol: 'CVX',   name: 'Chevron Corp.',      sector: 'Energy' },
  // Crypto-adjacent
  { symbol: 'COIN',  name: 'Coinbase Global',    sector: 'Crypto' },
  { symbol: 'MSTR',  name: 'MicroStrategy',      sector: 'Crypto' },
]

export const SECTORS = [...new Set(POPULAR_STOCKS.map((s) => s.sector))]

export const INDICES = [
  { symbol: '^GSPC', name: 'S&P 500',      label: 'SPX' },
  { symbol: '^DJI',  name: 'Dow Jones',    label: 'DJI' },
  { symbol: '^IXIC', name: 'NASDAQ',       label: 'NDX' },
  { symbol: '^VIX',  name: 'Volatility',   label: 'VIX' },
]
