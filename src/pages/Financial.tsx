import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { mockSettlements, mockAdminSettings } from "@/data/mockData"
import { Calculator, TrendingUp, Receipt } from "lucide-react"

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(amount)
}

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    'Paid': 'bg-green-100 text-green-800',
    'Created': 'bg-yellow-100 text-yellow-800',
    'SentToPay': 'bg-purple-100 text-purple-800',
    'SentToCreate': 'bg-orange-100 text-orange-800',
    'Initiated': 'bg-blue-100 text-blue-800',
    'NotAccepted': 'bg-red-100 text-red-800'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    'Paid': 'Paga',
    'Created': 'Criada',
    'SentToPay': 'Enviado para Pagar',
    'SentToCreate': 'Enviado para Criar',
    'Initiated': 'Iniciada',
    'NotAccepted': 'Não Aceita'
  }
  return labels[status] || status
}

export default function Financial() {
  // Filtrar apenas liquidações processadas (excluir NotAccepted)
  const processedSettlements = mockSettlements.filter(s => s.status !== 'NotAccepted')
  
  // Cálculos de totais
  const totalGrossAmount = processedSettlements.reduce((sum, s) => sum + s.grossAmount, 0)
  const totalFees = processedSettlements.reduce((sum, s) => 
    sum + s.fees.reduce((feeSum, fee) => feeSum + fee.amount, 0), 0
  )
  const totalNetAmount = processedSettlements.reduce((sum, s) => sum + s.netAmount, 0)

  // Cálculo de volume financeiro = total líquido dos pagamentos realizados
  const paidSettlements = processedSettlements.filter(s => s.status === 'Paid')
  const financialVolume = paidSettlements.reduce((sum, s) => sum + s.netAmount, 0)

  // Resumo das taxas por tipo
  const feesSummary = processedSettlements.reduce((acc, settlement) => {
    settlement.fees.forEach(fee => {
      if (!acc[fee.name]) {
        acc[fee.name] = { total: 0, count: 0 }
      }
      acc[fee.name].total += fee.amount
      acc[fee.name].count += 1
    })
    return acc
  }, {} as Record<string, { total: number; count: number }>)

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Calculator className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Financeiro</h1>
          <p className="text-muted-foreground">Detalhamento do cálculo do volume financeiro</p>
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Volume Bruto Total</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">{formatCurrency(totalGrossAmount)}</div>
            <p className="text-xs text-blue-600">{processedSettlements.length} liquidações processadas</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Taxas</CardTitle>
            <Receipt className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-700">{formatCurrency(totalFees)}</div>
            <p className="text-xs text-red-600">Descontadas do volume bruto</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Volume Líquido Total</CardTitle>
            <Calculator className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">{formatCurrency(totalNetAmount)}</div>
            <p className="text-xs text-green-600">Bruto - Taxas</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Volume Financeiro Final</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700">{formatCurrency(financialVolume)}</div>
            <p className="text-xs text-purple-600">{paidSettlements.length} pagamentos realizados</p>
          </CardContent>
        </Card>
      </div>

      {/* Fórmula de Cálculo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Como o Volume Financeiro é Calculado
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Fórmula:</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Volume Financeiro = Soma dos Valores Líquidos das Liquidações com Status "Paga"
            </p>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>1. Volume Bruto Total:</span>
                <span className="font-mono">{formatCurrency(totalGrossAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span>2. (-) Total de Taxas:</span>
                <span className="font-mono text-red-600">- {formatCurrency(totalFees)}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span>3. (=) Volume Líquido Total:</span>
                <span className="font-mono">{formatCurrency(totalNetAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span>4. Apenas liquidações "Pagas":</span>
                <span className="font-mono">{paidSettlements.length} de {processedSettlements.length}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold text-lg">
                <span>Volume Financeiro Final:</span>
                <span className="font-mono text-green-600">{formatCurrency(financialVolume)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resumo das Taxas */}
      <Card>
        <CardHeader>
          <CardTitle>Resumo das Taxas Aplicadas</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tipo de Taxa</TableHead>
                <TableHead className="text-center">Qtd. Aplicações</TableHead>
                <TableHead className="text-center">Valor Médio</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(feesSummary).map(([feeName, data]) => (
                <TableRow key={feeName}>
                  <TableCell className="font-medium">{feeName}</TableCell>
                  <TableCell className="text-center">{data.count}</TableCell>
                  <TableCell className="text-center">{formatCurrency(data.total / data.count)}</TableCell>
                  <TableCell className="text-right font-mono">{formatCurrency(data.total)}</TableCell>
                </TableRow>
              ))}
              <TableRow className="bg-muted/50">
                <TableCell className="font-bold">Total Geral</TableCell>
                <TableCell className="text-center font-bold">
                  {Object.values(feesSummary).reduce((sum, data) => sum + data.count, 0)}
                </TableCell>
                <TableCell className="text-center">-</TableCell>
                <TableCell className="text-right font-mono font-bold">{formatCurrency(totalFees)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Detalhamento por Liquidação */}
      <Card>
        <CardHeader>
          <CardTitle>Detalhamento por Liquidação</CardTitle>
          <p className="text-sm text-muted-foreground">
            Todas as liquidações processadas e seus respectivos cálculos
          </p>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Ticker</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Valor Bruto</TableHead>
                <TableHead className="text-right">Taxas</TableHead>
                <TableHead className="text-right">Valor Líquido</TableHead>
                <TableHead className="text-center">Contribui p/ Volume</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {processedSettlements.map((settlement) => {
                const totalSettlementFees = settlement.fees.reduce((sum, fee) => sum + fee.amount, 0)
                const contributesToVolume = settlement.status === 'Paid'
                
                return (
                  <TableRow key={settlement.id} className={contributesToVolume ? 'bg-green-50 dark:bg-green-950/20' : ''}>
                    <TableCell className="font-mono text-sm">{settlement.id}</TableCell>
                    <TableCell className="font-semibold">{settlement.ticker}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(settlement.status)}>
                        {getStatusLabel(settlement.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono">{formatCurrency(settlement.grossAmount)}</TableCell>
                    <TableCell className="text-right font-mono text-red-600">
                      {formatCurrency(totalSettlementFees)}
                    </TableCell>
                    <TableCell className="text-right font-mono font-semibold">
                      {formatCurrency(settlement.netAmount)}
                    </TableCell>
                    <TableCell className="text-center">
                      {contributesToVolume ? (
                        <Badge className="bg-green-100 text-green-800">✓ Sim</Badge>
                      ) : (
                        <Badge variant="outline">✗ Não</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}