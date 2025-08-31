export interface Settlement {
  id: string
  date: string
  amount: number
  status: 'Initiated' | 'NotAccepted' | 'SentToCreate' | 'Created' | 'SentToPay' | 'Paid'
  ticker: string
  shares: number
  grossAmount: number
  netAmount: number
  fees: Array<{ name: string; amount: number }>
  paymentDate: string
  brokerName: string
  history: Array<{
    status: string
    timestamp: string
    description: string
  }>
}

export interface AdminSettings {
  maxSettlementAmount: number
  prohibitedTickers: string[]
  customFees: Array<{ id: string; name: string; amount: number }>
  settlementAccount: string
  advancedVolume: number
}

const brokers = ["XP Investimentos", "BTG Pactual", "Rico Investimentos", "Nubank", "Inter", "Clear", "Itaú", "Bradesco"];
const tickers = ["PETR4", "VALE3", "MGLU3", "ITUB4", "BBAS3", "WEGE3", "RENT3", "ABEV3", "LREN3", "JBSS3", "BBDC4", "SUZB3", "RADL3", "HAPV3", "PCAR3"];
const statuses: Settlement['status'][] = ["Initiated", "NotAccepted", "SentToCreate", "Created", "SentToPay", "Paid"];

const generateMockSettlement = (index: number): Settlement => {
  const status = statuses[Math.floor(Math.random() * statuses.length)];
  const ticker = tickers[Math.floor(Math.random() * tickers.length)];
  const broker = brokers[Math.floor(Math.random() * brokers.length)];
  const shares = Math.floor(Math.random() * 5000) + 100;
  const pricePerShare = Math.floor(Math.random() * 200) + 10;
  const grossAmount = shares * pricePerShare;
  const fees = [
    { name: "Taxa de Corretagem", amount: Math.floor(Math.random() * 500) + 100 },
    { name: "Taxa de Liquidação", amount: Math.floor(Math.random() * 200) + 50 },
    { name: "Emolumentos", amount: Math.floor(Math.random() * 150) + 50 }
  ];
  const totalFees = fees.reduce((sum, fee) => sum + fee.amount, 0);
  const netAmount = status === "NotAccepted" ? 0 : grossAmount - totalFees;
  const date = new Date(2024, 0, Math.floor(Math.random() * 30) + 1).toISOString().split('T')[0];
  const paymentDate = new Date(2024, 0, Math.floor(Math.random() * 30) + 1).toISOString().split('T')[0];

  return {
    id: `LIQ-2024-${String(index + 1).padStart(3, '0')}`,
    date,
    amount: grossAmount,
    status,
    ticker,
    shares,
    grossAmount,
    netAmount,
    fees: status === "NotAccepted" ? [] : fees,
    paymentDate,
    brokerName: broker,
    history: generateHistory(status)
  };
};

const generateHistory = (status: Settlement['status']) => {
  const history = [
    { status: "Initiated", timestamp: "2024-01-15T09:00:00Z", description: "Liquidação iniciada" }
  ];

  if (status === "NotAccepted") {
    history.push({ status: "NotAccepted", timestamp: "2024-01-15T09:05:00Z", description: "Não aceito - validação falhou" });
    return history;
  }

  if (["SentToCreate", "Created", "SentToPay", "Paid"].includes(status)) {
    history.push({ status: "SentToCreate", timestamp: "2024-01-15T09:30:00Z", description: "Enviado para criação na clearing" });
  }

  if (["Created", "SentToPay", "Paid"].includes(status)) {
    history.push({ status: "Created", timestamp: "2024-01-15T10:00:00Z", description: "Criado na clearing" });
  }

  if (["SentToPay", "Paid"].includes(status)) {
    history.push({ status: "SentToPay", timestamp: "2024-01-15T13:00:00Z", description: "Enviado para pagamento" });
  }

  if (status === "Paid") {
    history.push({ status: "Paid", timestamp: "2024-01-15T14:00:00Z", description: "Liquidação paga com sucesso" });
  }

  return history;
};

export const mockSettlements: Settlement[] = Array.from({ length: 50 }, (_, index) => generateMockSettlement(index));

export const mockBlockedSettlements: Settlement[] = [
  {
    id: "LIQ-2024-051",
    date: "2024-01-18",
    amount: 600000.00,
    status: "NotAccepted",
    ticker: "BBAS3",
    shares: 3000,
    grossAmount: 600000.00,
    netAmount: 0,
    fees: [],
    paymentDate: "2024-01-20",
    brokerName: "XP Investimentos",
    history: [
      { status: "Initiated", timestamp: "2024-01-18T09:00:00Z", description: "Liquidação iniciada" },
      { status: "NotAccepted", timestamp: "2024-01-18T09:05:00Z", description: "Não aceito - valor acima do limite (R$ 500.000)" }
    ]
  },
  {
    id: "LIQ-2024-052",
    date: "2024-01-18",
    amount: 75000.00,
    status: "NotAccepted",
    ticker: "OIBR3",
    shares: 500,
    grossAmount: 75000.00,
    netAmount: 0,
    fees: [],
    paymentDate: "2024-01-20",
    brokerName: "Rico Investimentos",
    history: [
      { status: "Initiated", timestamp: "2024-01-18T11:00:00Z", description: "Liquidação iniciada" },
      { status: "NotAccepted", timestamp: "2024-01-18T11:01:00Z", description: "Não aceito - ticker na lista de proibidos" }
    ]
  },
  {
    id: "LIQ-2024-053",
    date: "2024-01-19",
    amount: 800000.00,
    status: "NotAccepted",
    ticker: "WEGE3",
    shares: 4000,
    grossAmount: 800000.00,
    netAmount: 0,
    fees: [],
    paymentDate: "2024-01-21",
    brokerName: "BTG Pactual",
    history: [
      { status: "Initiated", timestamp: "2024-01-19T14:00:00Z", description: "Liquidação iniciada" },
      { status: "NotAccepted", timestamp: "2024-01-19T14:05:00Z", description: "Não aceito - valor acima do limite (R$ 500.000)" }
    ]
  }
]

export const mockAdminSettings: AdminSettings = {
  maxSettlementAmount: 500000.00,
  prohibitedTickers: ["OIBR3", "OIBR4", "IRBR3"],
  customFees: [
    { id: "1", name: "Taxa de Corretagem", amount: 350.00 },
    { id: "2", name: "Taxa de Liquidação", amount: 125.00 },
    { id: "3", name: "Emolumentos", amount: 150.00 }
  ],
  settlementAccount: "001-12345-6",
  advancedVolume: 600000.00
}