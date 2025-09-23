import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer
} from "recharts"
import { TrendingUp, DollarSign, Calendar, AlertCircle, XCircle, ShieldX } from "lucide-react"
import { mockSettlements, mockBlockedSettlements, Settlement } from "@/data/mockData"
import SettlementModal from "@/components/SettlementModal"

import { formatCurrency } from "@/lib/utils"
import { getSettlementStats, getTickerData, getStatusDistribution } from "@/lib/settlementCalculations"

const Dashboard = () => {
  const [selectedSettlement, setSelectedSettlement] = useState<Settlement | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const stats = getSettlementStats()
  const tickerData = getTickerData()
  const statusData = getStatusDistribution()

  // Dados para gráfico de bloqueios
  const blockedData = [
    { 
      type: 'Limite Financeiro', 
      quantidade: stats.blockedByLimit, 
      valor: mockBlockedSettlements
        .filter(s => s.history.some(h => h.description.includes('limite')))
        .reduce((sum, s) => sum + s.grossAmount, 0)
    },
    { 
      type: 'Ticker Proibido', 
      quantidade: stats.blockedByTicker,
      valor: mockBlockedSettlements
        .filter(s => s.history.some(h => h.description.includes('proibidos')))
        .reduce((sum, s) => sum + s.grossAmount, 0)
    }
  ]

  const handleViewDetails = (settlement: Settlement) => {
    setSelectedSettlement(settlement)
    setIsModalOpen(true)
  }

  const chartConfig = {
    valor: {
      label: "Valor (R$)",
      color: "hsl(var(--primary))",
    },
    quantidade: {
      label: "Quantidade",
      color: "hsl(var(--destructive))",
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard de Liquidações</h1>
        <p className="text-muted-foreground">
          Visão geral e análise dos volumes financeiros
        </p>
      </div>

      {/* Stats Cards - Status */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="card-financial">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Não Aceitas</CardTitle>
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'hsl(var(--status-notaccepted))' }} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ color: 'hsl(var(--status-notaccepted))' }}>{stats.notaccepted}</div>
          </CardContent>
        </Card>

        <Card className="card-financial">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Iniciadas</CardTitle>
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'hsl(var(--status-initiated))' }} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ color: 'hsl(var(--status-initiated))' }}>{stats.initiated}</div>
          </CardContent>
        </Card>

        <Card className="card-financial">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Enviado para Criar</CardTitle>
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'hsl(var(--status-senttocreate))' }} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ color: 'hsl(var(--status-senttocreate))' }}>{stats.senttocreate}</div>
          </CardContent>
        </Card>

        <Card className="card-financial">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Criadas</CardTitle>
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'hsl(var(--status-created))' }} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ color: 'hsl(var(--status-created))' }}>{stats.created}</div>
          </CardContent>
        </Card>

        <Card className="card-financial">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Enviado para Pagar</CardTitle>
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'hsl(var(--status-senttopay))' }} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ color: 'hsl(var(--status-senttopay))' }}>{stats.senttopay}</div>
          </CardContent>
        </Card>

        <Card className="card-financial">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pagas</CardTitle>
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'hsl(var(--status-paid))' }} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ color: 'hsl(var(--status-paid))' }}>{stats.paid}</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Total de Liquidações */}
        <Card className="card-financial">
          <CardHeader className="flex flex-col items-center space-y-2 pb-2">
            <CardTitle className="text-lg font-medium text-center">Total de Liquidações</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center min-h-[250px]">
            <div className="text-9xl font-bold mb-4">{stats.total}</div>
            <p className="text-sm text-muted-foreground">liquidações processadas</p>
          </CardContent>
        </Card>

        {/* Status Distribution */}
        <Card className="card-financial">
          <CardHeader className="flex flex-col items-center space-y-2 pb-2">
            <CardTitle className="text-lg font-medium text-center">Distribuição por Status</CardTitle>
            <CardDescription className="text-center">
              Proporção de liquidações por status atual
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center p-2 sm:p-6">
            <ChartContainer config={chartConfig} className="h-[250px] sm:h-[300px] w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={false}
                    outerRadius="60%"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip 
                    content={<ChartTooltipContent 
                      formatter={(value: any, name: any) => [
                        `${value} liquidações (${((value / stats.total) * 100).toFixed(1)}%)`,
                        name
                      ]}
                    />}
                  />
                  <ChartLegend 
                    content={({ payload }) => (
                      <div className="flex flex-wrap justify-center gap-2 mt-2">
                        {payload?.map((entry, index) => (
                          <div key={index} className="flex items-center gap-1 text-xs">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: entry.color }}
                            />
                            <span>{entry.value}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Liquidações Bloqueadas */}
        <Card className="card-financial lg:col-span-2">
          <CardHeader>
            <CardTitle>Análise de Liquidações Não Aceitas</CardTitle>
            <CardDescription>Liquidações que foram rejeitadas pelo sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {stats.allSettlements.filter(s => s.status === 'NotAccepted').map((settlement) => (
                <div key={settlement.id} className="p-3 border rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-sm font-medium">{settlement.id}</span>
                    <Badge variant="destructive">Não Aceita</Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    <p className="text-sm text-muted-foreground">
                      {settlement.ticker} - {formatCurrency(settlement.amount)}
                    </p>
                    <p className="text-sm text-muted-foreground text-center">
                      Criado: {new Date(settlement.date).toLocaleDateString('pt-BR')}
                    </p>
                    <p className="text-sm text-muted-foreground text-right">
                      {new Date(settlement.date).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {settlement.history[settlement.history.length - 1]?.description}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Settlement Modal */}
      <SettlementModal
        settlement={selectedSettlement}
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  )
}

export default Dashboard