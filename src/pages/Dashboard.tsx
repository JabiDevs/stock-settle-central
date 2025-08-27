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
} from "recharts"
import { TrendingUp, DollarSign, Calendar, AlertCircle, XCircle, ShieldX } from "lucide-react"
import { mockSettlements, mockBlockedSettlements, Settlement } from "@/data/mockData"
import SettlementModal from "@/components/SettlementModal"

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(amount)
}

const Dashboard = () => {
  const [selectedSettlement, setSelectedSettlement] = useState<Settlement | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const allSettlements = [...mockSettlements, ...mockBlockedSettlements]
  
  const stats = {
    total: mockSettlements.length,
    completed: mockSettlements.filter(s => s.status === 'completed').length,
    processing: mockSettlements.filter(s => s.status === 'processing').length,
    failed: mockSettlements.filter(s => s.status === 'failed').length,
    totalAmount: mockSettlements.reduce((sum, s) => sum + s.netAmount, 0),
    blockedByLimit: mockBlockedSettlements.filter(s => 
      s.history.some(h => h.description.includes('limite'))
    ).length,
    blockedByTicker: mockBlockedSettlements.filter(s => 
      s.history.some(h => h.description.includes('proibidos'))
    ).length
  }

  // Dados para gráfico de barras por liquidação
  const volumeBySettlement = mockSettlements.map(settlement => ({
    id: settlement.id,
    ticker: settlement.ticker,
    valor: settlement.netAmount,
    status: settlement.status,
    settlement: settlement
  }))

  // Dados para gráfico de pizza por status
  const statusData = [
    { name: 'Concluídas', value: stats.completed, color: 'hsl(var(--success))' },
    { name: 'Em Processamento', value: stats.processing, color: 'hsl(var(--accent))' },
    { name: 'Falhas', value: stats.failed, color: 'hsl(var(--destructive))' },
    { name: 'Iniciadas', value: mockSettlements.filter(s => s.status === 'initiated').length, color: 'hsl(var(--muted))' }
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
        <Card className="card-financial">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">liquidações</p>
          </CardContent>
        </Card>

        <Card className="card-financial">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Concluídas</CardTitle>
            <div className="w-3 h-3 rounded-full bg-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{stats.completed}</div>
            <p className="text-xs text-muted-foreground">finalizadas</p>
          </CardContent>
        </Card>

        <Card className="card-financial">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processando</CardTitle>
            <div className="w-3 h-3 rounded-full bg-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">{stats.processing}</div>
            <p className="text-xs text-muted-foreground">em andamento</p>
          </CardContent>
        </Card>

        <Card className="card-financial">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Falhas</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{stats.failed}</div>
            <p className="text-xs text-muted-foreground">com erro</p>
          </CardContent>
        </Card>

        <Card className="card-financial">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{formatCurrency(stats.totalAmount)}</div>
            <p className="text-xs text-muted-foreground">valor líquido</p>
          </CardContent>
        </Card>

        <Card className="card-financial">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bloq. Limite</CardTitle>
            <XCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{stats.blockedByLimit}</div>
            <p className="text-xs text-muted-foreground">acima limite</p>
          </CardContent>
        </Card>

        <Card className="card-financial">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bloq. Ticker</CardTitle>
            <ShieldX className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{stats.blockedByTicker}</div>
            <p className="text-xs text-muted-foreground">ticker proibido</p>
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
              Clique nas barras para ver detalhes da liquidação
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <BarChart data={volumeBySettlement}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="ticker" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
                />
                <ChartTooltip 
                  content={<ChartTooltipContent 
                    formatter={(value: any, name: any) => [
                      formatCurrency(value),
                      "Valor Líquido"
                    ]}
                    labelFormatter={(label: any, payload: any) => {
                      const data = payload?.[0]?.payload
                      return data ? `${data.ticker} (${data.id})` : label
                    }}
                  />}
                />
                <Bar 
                  dataKey="valor" 
                  fill="var(--color-valor)"
                  radius={[4, 4, 0, 0]}
                  onClick={(data: any) => {
                    if (data?.settlement) {
                      handleViewDetails(data.settlement)
                    }
                  }}
                  style={{ cursor: 'pointer' }}
                />
              </BarChart>
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
            <CardDescription>
              Liquidações rejeitadas por limite financeiro ou ticker proibido
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium mb-4">Por Tipo de Bloqueio</h4>
                <ChartContainer config={chartConfig} className="h-[200px]">
                  <BarChart data={blockedData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="type" type="category" width={100} fontSize={12} />
                    <ChartTooltip 
                      content={<ChartTooltipContent 
                        formatter={(value: any, name: any) => [
                          name === 'quantidade' ? `${value} liquidações` : formatCurrency(value),
                          name === 'quantidade' ? 'Quantidade' : 'Valor Total'
                        ]}
                      />}
                    />
                    <Bar dataKey="quantidade" fill="var(--color-quantidade)" />
                  </BarChart>
                </ChartContainer>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-4">Liquidações Bloqueadas</h4>
                <div className="space-y-3">
                  {mockBlockedSettlements.map((settlement) => (
                    <div 
                      key={settlement.id}
                      className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => handleViewDetails(settlement)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm font-medium">{settlement.id}</span>
                            <Badge variant="destructive" className="text-xs">
                              {settlement.ticker}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {settlement.history[settlement.history.length - 1]?.description}
                          </p>
                        </div>
                        <span className="font-mono text-sm font-bold">
                          {formatCurrency(settlement.grossAmount)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
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