export interface Settlement {
  id: string
  date: string
  amount: number
  status: 'initiated' | 'processing' | 'completed' | 'failed'
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
}

export const mockSettlements: Settlement[] = [
  {
    id: "LIQ-2024-001",
    date: "2024-01-15",
    amount: 125000.00,
    status: "completed",
    ticker: "PETR4",
    shares: 1000,
    grossAmount: 125000.00,
    netAmount: 124375.00,
    fees: [
      { name: "Taxa de Corretagem", amount: 350.00 },
      { name: "Taxa de Liquidação", amount: 125.00 },
      { name: "Emolumentos", amount: 150.00 }
    ],
    paymentDate: "2024-01-17",
    brokerName: "XP Investimentos",
    history: [
      { status: "initiated", timestamp: "2024-01-15T09:00:00Z", description: "Liquidação iniciada" },
      { status: "processing", timestamp: "2024-01-15T09:30:00Z", description: "Em processamento pela clearing" },
      { status: "completed", timestamp: "2024-01-15T14:00:00Z", description: "Liquidação concluída com sucesso" }
    ]
  },
  {
    id: "LIQ-2024-002",
    date: "2024-01-16",
    amount: 85000.00,
    status: "processing",
    ticker: "VALE3",
    shares: 500,
    grossAmount: 85000.00,
    netAmount: 84525.00,
    fees: [
      { name: "Taxa de Corretagem", amount: 275.00 },
      { name: "Taxa de Liquidação", amount: 85.00 },
      { name: "Emolumentos", amount: 115.00 }
    ],
    paymentDate: "2024-01-18",
    brokerName: "BTG Pactual",
    history: [
      { status: "initiated", timestamp: "2024-01-16T10:15:00Z", description: "Liquidação iniciada" },
      { status: "processing", timestamp: "2024-01-16T11:00:00Z", description: "Aguardando confirmação da clearing" }
    ]
  },
  {
    id: "LIQ-2024-003",
    date: "2024-01-16",
    amount: 45000.00,
    status: "failed",
    ticker: "MGLU3",
    shares: 300,
    grossAmount: 45000.00,
    netAmount: 44775.00,
    fees: [
      { name: "Taxa de Corretagem", amount: 125.00 },
      { name: "Taxa de Liquidação", amount: 45.00 },
      { name: "Emolumentos", amount: 55.00 }
    ],
    paymentDate: "2024-01-18",
    brokerName: "Rico Investimentos",
    history: [
      { status: "initiated", timestamp: "2024-01-16T14:30:00Z", description: "Liquidação iniciada" },
      { status: "processing", timestamp: "2024-01-16T15:00:00Z", description: "Erro na validação dos dados" },
      { status: "failed", timestamp: "2024-01-16T15:30:00Z", description: "Falha na liquidação - ticker inválido" }
    ]
  },
  {
    id: "LIQ-2024-004",
    date: "2024-01-17",
    amount: 200000.00,
    status: "initiated",
    ticker: "ITUB4",
    shares: 2000,
    grossAmount: 200000.00,
    netAmount: 199250.00,
    fees: [
      { name: "Taxa de Corretagem", amount: 450.00 },
      { name: "Taxa de Liquidação", amount: 200.00 },
      { name: "Emolumentos", amount: 100.00 }
    ],
    paymentDate: "2024-01-19",
    brokerName: "Nubank",
    history: [
      { status: "initiated", timestamp: "2024-01-17T16:45:00Z", description: "Liquidação iniciada" }
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
  ]
}