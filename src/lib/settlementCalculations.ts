import { Settlement, mockSettlements, mockBlockedSettlements } from "@/data/mockData"

// Shared calculations to ensure consistency across all pages
export const getSettlementStats = () => {
  const allSettlements = [...mockSettlements, ...mockBlockedSettlements]
  const processedSettlements = mockSettlements.filter(s => s.status !== 'NotAccepted')
  const paidSettlements = processedSettlements.filter(s => s.status === 'Paid')

  return {
    total: mockSettlements.length,
    initiated: mockSettlements.filter(s => s.status === 'Initiated').length,
    notaccepted: allSettlements.filter(s => s.status === 'NotAccepted').length,
    senttocreate: mockSettlements.filter(s => s.status === 'SentToCreate').length,
    created: mockSettlements.filter(s => s.status === 'Created').length,
    senttopay: mockSettlements.filter(s => s.status === 'SentToPay').length,
    paid: paidSettlements.length,
    totalAmount: processedSettlements.reduce((sum, s) => sum + s.netAmount, 0),
    totalPaid: paidSettlements.reduce((sum, s) => sum + s.netAmount, 0),
    totalFeesReceived: paidSettlements.reduce((sum, s) => 
      sum + s.fees.reduce((feeSum, fee) => feeSum + fee.amount, 0), 0
    ),
    blockedByLimit: mockBlockedSettlements.filter(s => 
      s.history.some(h => h.description.includes('limite'))
    ).length,
    blockedByTicker: mockBlockedSettlements.filter(s => 
      s.history.some(h => h.description.includes('proibidos'))
    ).length,
    allSettlements,
    processedSettlements,
    paidSettlements
  }
}

// Get ticker volume data for treemap - ordered by frequency
export const getTickerData = () => {
  const tickerCountMap = new Map<string, { count: number, volume: number, settlements: Settlement[] }>()
  
  mockSettlements.forEach(settlement => {
    if (tickerCountMap.has(settlement.ticker)) {
      const existing = tickerCountMap.get(settlement.ticker)!
      existing.count += 1
      existing.volume += settlement.netAmount
      existing.settlements.push(settlement)
    } else {
      tickerCountMap.set(settlement.ticker, {
        count: 1,
        volume: settlement.netAmount,
        settlements: [settlement]
      })
    }
  })

  // Sort by count (frequency) from highest to lowest
  return Array.from(tickerCountMap.entries())
    .sort(([, a], [, b]) => b.count - a.count)
    .map(([ticker, data]) => ({
      name: ticker,
      size: data.count, // Use count for treemap size
      volume: data.volume,
      settlements: data.settlements,
      fill: `hsl(var(--primary))`
    }))
}

// Get status distribution data
export const getStatusDistribution = () => {
  const stats = getSettlementStats()
  
  return [
    { name: 'Pagas', value: stats.paid, color: 'hsl(var(--status-paid))' },
    { name: 'Criadas', value: stats.created, color: 'hsl(var(--status-created))' },
    { name: 'Enviado para Criar', value: stats.senttocreate, color: 'hsl(var(--status-senttocreate))' },
    { name: 'Envio Pagamento', value: stats.senttopay, color: 'hsl(var(--status-senttopay))' },
    { name: 'Não Aceitas', value: stats.notaccepted, color: 'hsl(var(--status-notaccepted))' },
    { name: 'Iniciadas', value: stats.initiated, color: 'hsl(var(--status-initiated))' }
  ]
}