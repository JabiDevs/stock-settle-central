import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { mockSettlements, mockAdminSettings } from "@/data/mockData"
import { Calculator, TrendingUp, Receipt, Filter } from "lucide-react"

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
  const [selectedStatus, setSelectedStatus] = useState('Paid')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Filtrar apenas liquidações processadas (excluir NotAccepted)
  const processedSettlements = mockSettlements.filter(s => s.status !== 'NotAccepted')
  
  // Cálculos de totais
  const totalGrossAmount = processedSettlements.reduce((sum, s) => sum + s.grossAmount, 0)
  const totalFeesReceived = processedSettlements.reduce((sum, s) => 
    sum + s.fees.reduce((feeSum, fee) => feeSum + fee.amount, 0), 0
  )

  // Volume financeiro pago = total líquido dos pagamentos realizados
  const paidSettlements = processedSettlements.filter(s => s.status === 'Paid')
  const financialVolumePaid = paidSettlements.reduce((sum, s) => sum + s.netAmount, 0)

  // Resumo das taxas por tipo (sem contagem)
  const feesSummary = processedSettlements.reduce((acc, settlement) => {
    settlement.fees.forEach(fee => {
      if (!acc[fee.name]) {
        acc[fee.name] = 0
      }
      acc[fee.name] += fee.amount
    })
    return acc
  }, {} as Record<string, number>)

  // Filtrar e paginar liquidações para a tabela
  const filteredSettlements = processedSettlements
    .filter(s => selectedStatus === 'all' || s.status === selectedStatus)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const totalPages = Math.ceil(filteredSettlements.length / itemsPerPage)
  const paginatedSettlements = filteredSettlements.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const statusOptions = [
    { value: 'all', label: 'Todos' },
    { value: 'Paid', label: 'Pago' },
    { value: 'Created', label: 'Criada' },
    { value: 'SentToPay', label: 'Enviado para Pagar' },
    { value: 'SentToCreate', label: 'Enviado para Criar' },
    { value: 'Initiated', label: 'Iniciada' }
  ]

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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Taxas Recebidas</CardTitle>
            <Receipt className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">{formatCurrency(totalFeesReceived)}</div>
            <p className="text-xs text-green-600">Receita com taxas aplicadas</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Volume Financeiro Pago</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">{formatCurrency(financialVolumePaid)}</div>
            <p className="text-xs text-blue-600">{paidSettlements.length} pagamentos realizados</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bruto de Liquidações</CardTitle>
            <Calculator className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700">{formatCurrency(totalGrossAmount)}</div>
            <p className="text-xs text-purple-600">{processedSettlements.length} liquidações processadas</p>
          </CardContent>
        </Card>
      </div>

      {/* Somatória destacada */}
      <Card>
        <CardContent className="pt-6">
          <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Total Bruto de Liquidações:</span>
                <span className="font-mono">{formatCurrency(totalGrossAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span>Total de Taxas Recebidas:</span>
                <span className="font-mono text-green-600">+ {formatCurrency(totalFeesReceived)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total de Volume Financeiro Pago:</span>
                <span className="font-mono text-blue-600">{formatCurrency(financialVolumePaid)}</span>
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
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(feesSummary).map(([feeName, amount]) => (
                <TableRow key={feeName}>
                  <TableCell className="font-medium">{feeName}</TableCell>
                  <TableCell className="text-right font-mono">{formatCurrency(amount)}</TableCell>
                </TableRow>
              ))}
              <TableRow className="bg-muted/50">
                <TableCell className="font-bold">Total Geral</TableCell>
                <TableCell className="text-right font-mono font-bold">{formatCurrency(totalFeesReceived)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Detalhamento por Liquidação */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Detalhamento por Liquidação</CardTitle>
            <p className="text-sm text-muted-foreground">
              Liquidações filtradas por status com paginação
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Ticker</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Valor Liquidação</TableHead>
                <TableHead className="text-right">Taxas</TableHead>
                <TableHead className="text-right">Valor Pago</TableHead>
                <TableHead className="text-center">Contribui p/ Volume</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedSettlements.map((settlement) => {
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
                    <TableCell className="text-right font-mono text-green-600">
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
          
          {/* Paginação */}
          {totalPages > 1 && (
            <div className="mt-4 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => setCurrentPage(page)}
                        isActive={currentPage === page}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
          
          <div className="mt-4 text-sm text-muted-foreground text-center">
            Mostrando {paginatedSettlements.length} de {filteredSettlements.length} liquidações
          </div>
        </CardContent>
      </Card>
    </div>
  )
}