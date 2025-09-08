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
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Treemap,
} from "recharts"
import { TrendingUp, DollarSign, Calendar, AlertCircle, XCircle, ShieldX } from "lucide-react"
import { mockSettlements, mockBlockedSettlements, Settlement } from "@/data/mockData"
import SettlementModal from "@/components/SettlementModal"
import TreemapContent from "@/components/TreemapContent"
import { formatCurrency } from "@/lib/utils"

const Dashboard = () => {
  const [selectedSettlement, setSelectedSettlement] = useState<Settlement | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const allSettlements = [...mockSettlements, ...mockBlockedSettlements]
  
  const stats = {
    total: mockSettlements.length,
    initiated: mockSettlements.filter(s => s.status === 'Initiated').length,
    notaccepted: mockSettlements.filter(s => s.status === 'NotAccepted').length,
    senttocreate: mockSettlements.filter(s => s.status === 'SentToCreate').length,
    created: mockSettlements.filter(s => s.status === 'Created').length,
    senttopay: mockSettlements.filter(s => s.status === 'SentToPay').length,
    paid: mockSettlements.filter(s => s.status === 'Paid').length,
    totalAmount: mockSettlements.reduce((sum, s) => sum + s.netAmount, 0),
    blockedByLimit: mockBlockedSettlements.filter(s => 
      s.history.some(h => h.description.includes('limite'))
    ).length,
    blockedByTicker: mockBlockedSettlements.filter(s => 
      s.history.some(h => h.description.includes('proibidos'))
    ).length
  }

  // Dados para gráfico treemap por liquidação
  const volumeBySettlement = mockSettlements.map(settlement => ({
    name: settlement.ticker,
    size: settlement.netAmount,
    status: settlement.status,
    settlement: settlement,
    fill: `hsl(var(--status-${settlement.status.toLowerCase()}))`
  }))

  // Dados para gráfico de pizza por status
  const statusData = [
    { name: 'Pagas', value: stats.paid, color: 'hsl(var(--status-paid))' },
    { name: 'Criadas', value: stats.created, color: 'hsl(var(--status-created))' },
    { name: 'Enviado para Criar', value: stats.senttocreate, color: 'hsl(var(--status-senttocreate))' },
    { name: 'Envio Pagamento', value: stats.senttopay, color: 'hsl(var(--status-senttopay))' },
    { name: 'Não Aceitas', value: stats.notaccepted, color: 'hsl(var(--status-notaccepted))' },
    { name: 'Iniciadas', value: stats.initiated, color: 'hsl(var(--status-initiated))' }
  ]

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

      {/* Stats Cards - Primeira Linha */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card className="card-financial">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">Total de Liquidações</CardTitle>
            <TrendingUp className="h-6 w-6 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{stats.total}</div>
            <p className="text-sm text-muted-foreground mt-2">liquidações processadas</p>
          </CardContent>
        </Card>

        <Card className="card-financial">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">Volume Financeiro Total</CardTitle>
            <DollarSign className="h-6 w-6 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{formatCurrency(stats.totalAmount)}</div>
            <p className="text-sm text-muted-foreground mt-2">valor líquido total</p>
          </CardContent>
        </Card>
      </div>

      {/* Stats Cards - Segunda Linha - Status */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="card-financial">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Não Aceitas</CardTitle>
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'hsl(var(--status-notaccepted))' }} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ color: 'hsl(var(--status-notaccepted))' }}>{stats.notaccepted}</div>
            <p className="text-xs text-muted-foreground">não aceitas</p>
          </CardContent>
        </Card>

        <Card className="card-financial">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Iniciadas</CardTitle>
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'hsl(var(--status-initiated))' }} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ color: 'hsl(var(--status-initiated))' }}>{stats.initiated}</div>
            <p className="text-xs text-muted-foreground">iniciadas</p>
          </CardContent>
        </Card>

        <Card className="card-financial">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Enviado para Criar</CardTitle>
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'hsl(var(--status-senttocreate))' }} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ color: 'hsl(var(--status-senttocreate))' }}>{stats.senttocreate}</div>
            <p className="text-xs text-muted-foreground">envio criação</p>
          </CardContent>
        </Card>

        <Card className="card-financial">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Criadas</CardTitle>
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'hsl(var(--status-created))' }} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ color: 'hsl(var(--status-created))' }}>{stats.created}</div>
            <p className="text-xs text-muted-foreground">criadas</p>
          </CardContent>
        </Card>

        <Card className="card-financial">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Enviado para Pagar</CardTitle>
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'hsl(var(--status-senttopay))' }} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ color: 'hsl(var(--status-senttopay))' }}>{stats.senttopay}</div>
            <p className="text-xs text-muted-foreground">envio pagamento</p>
          </CardContent>
        </Card>

        <Card className="card-financial">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pagas</CardTitle>
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'hsl(var(--status-paid))' }} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ color: 'hsl(var(--status-paid))' }}>{stats.paid}</div>
            <p className="text-xs text-muted-foreground">pagas</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Volume por Liquidação */}
        <Card className="card-financial">
          <CardHeader>
            <CardTitle>Volume Financeiro por Liquidação</CardTitle>
            <CardDescription>
              Clique nas células para ver detalhes da liquidação
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <Treemap
                  data={volumeBySettlement}
                  dataKey="size"
                  aspectRatio={4/3}
                  stroke="#fff"
                  content={<TreemapContent onCellClick={(payload) => {
                    if (payload?.settlement) {
                      handleViewDetails(payload.settlement)
                    }
                  }} />}
                />
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Status Distribution */}
        <Card className="card-financial">
          <CardHeader>
            <CardTitle>Distribuição por Status</CardTitle>
            <CardDescription>
              Proporção de liquidações por status atual
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip 
                  content={<ChartTooltipContent 
                    formatter={(value: any, name: any) => [
                      `${value} liquidações`,
                      name
                    ]}
                  />}
                />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Liquidações Bloqueadas */}
        <Card className="card-financial lg:col-span-2">
          <CardHeader>
            <CardTitle>Análise de Liquidações Bloqueadas</CardTitle>
            <CardDescription>Liquidações que foram rejeitadas pelo sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {mockBlockedSettlements.map((settlement) => (
                <div key={settlement.id} className="p-3 border rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-sm font-medium">{settlement.id}</span>
                    <Badge variant="destructive">Não Aceita</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {settlement.ticker} - {formatCurrency(settlement.amount)}
                  </p>
                  <p className="text-xs text-muted-foreground">
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