import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Search, Eye, Calendar, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"
import { Settlement } from "@/data/mockData"

interface SettlementsTableProps {
  settlements: Settlement[]
  onViewDetails: (settlement: Settlement) => void
}

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'Paid':
      return 'default'
    case 'Created':
    case 'SentToPay':
      return 'secondary'
    case 'NotAccepted':
      return 'destructive'
    case 'Initiated':
    case 'SentToCreate':
      return 'outline'
    default:
      return 'outline'
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Paid':
      return 'hsl(var(--status-paid))'
    case 'Created':
      return 'hsl(var(--status-created))'
    case 'SentToPay':
      return 'hsl(var(--status-senttopay))'
    case 'SentToCreate':
      return 'hsl(var(--status-senttocreate))'
    case 'NotAccepted':
      return 'hsl(var(--status-notaccepted))'
    case 'Initiated':
      return 'hsl(var(--status-initiated))'
    default:
      return 'hsl(var(--muted))'
  }
}

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'Paid':
      return 'Paga'
    case 'SentToPay':
      return 'Enviado p/ Pagamento'
    case 'Created':
      return 'Criada'
    case 'SentToCreate':
      return 'Enviado p/ Criação'
    case 'NotAccepted':
      return 'Não Aceita'
    case 'Initiated':
      return 'Iniciada'
    default:
      return status
  }
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(amount)
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('pt-BR')
}

const SettlementsTable = ({ settlements, onViewDetails }: SettlementsTableProps) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [sortField, setSortField] = useState<keyof Settlement | 'fees' | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const filteredSettlements = useMemo(() => {
    let filtered = settlements.filter(settlement => {
      // Search filter
      const searchMatch = settlement.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        settlement.ticker.toLowerCase().includes(searchTerm.toLowerCase())

      // Status filter
      const statusMatch = statusFilter === "all" || settlement.status === statusFilter

      // Date range filter
      const settlementDate = new Date(settlement.date)
      const startMatch = !startDate || settlementDate >= new Date(startDate)
      const endMatch = !endDate || settlementDate <= new Date(endDate)

      return searchMatch && statusMatch && startMatch && endMatch
    })

    // Sorting
    if (sortField) {
      filtered.sort((a, b) => {
        let aValue: any
        let bValue: any

        // Special handling for fees
        if (sortField === 'fees') {
          aValue = a.fees.reduce((sum, fee) => sum + fee.amount, 0)
          bValue = b.fees.reduce((sum, fee) => sum + fee.amount, 0)
        } else {
          aValue = a[sortField]
          bValue = b[sortField]

          if (typeof aValue === 'string') {
            aValue = aValue.toLowerCase()
            bValue = (bValue as string).toLowerCase()
          }
        }

        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
        return 0
      })
    }

    return filtered
  }, [settlements, searchTerm, statusFilter, startDate, endDate, sortField, sortDirection])

  const totalPages = Math.ceil(filteredSettlements.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentSettlements = filteredSettlements.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleSort = (field: keyof Settlement | 'fees') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const getSortIcon = (field: keyof Settlement) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4" />
    return sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
  }

  return (
    <Card className="card-financial">
      <CardHeader>
        <div className="flex flex-col gap-4">
          <div>
            <CardTitle>Lista de Liquidações</CardTitle>
            <CardDescription>
              {filteredSettlements.length} liquidação(ões) encontrada(s)
            </CardDescription>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center space-x-2 flex-1">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por ID ou Ticker..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>

            <div className="flex gap-4">
              <div className="flex flex-col gap-1.5">
                <p className="text-sm text-muted-foreground">Status</p>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Filtrar por status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os status</SelectItem>
                    <SelectItem value="Paid">Paga</SelectItem>
                    <SelectItem value="SentToPay">Enviado p/ Pagamento</SelectItem>
                    <SelectItem value="Created">Criada</SelectItem>
                    <SelectItem value="SentToCreate">Enviado p/ Criação</SelectItem>
                    <SelectItem value="Initiated">Iniciada</SelectItem>
                    <SelectItem value="NotAccepted">Não Aceita</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex flex-col gap-1.5">
                <p className="text-sm text-muted-foreground">Data Início</p>
                <Input
                  type="date"
                  placeholder="Data inicial"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-40"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <p className="text-sm text-muted-foreground">Data Fim</p>
                <Input
                  type="date"
                  placeholder="Data final"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-40"
                />
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleSort('id')}
              >
                <div className="flex items-center gap-2">
                  ID
                  {getSortIcon('id')}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleSort('date')}
              >
                <div className="flex items-center gap-2">
                  Data
                  {getSortIcon('date')}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-muted/50"
              >
                <div className="flex items-center gap-2">
                  Ticker
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleSort('netAmount')}
              >
                <div className="flex items-center gap-2">
                  Valor Pago
                  {getSortIcon('netAmount')}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleSort('fees')}>
                <div className="flex items-center gap-2">
                  Taxas
                  {getSortIcon('fees')}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-muted/50"
              >
                <div className="flex items-center gap-2">
                  Status
                </div>
              </TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentSettlements.map((settlement) => {
              const totalFees = settlement.fees.reduce((sum, fee) => sum + fee.amount, 0)

              return (
                <TableRow key={settlement.id} className="hover:bg-muted/50">
                  <TableCell className="font-mono font-medium">
                    {settlement.id}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {formatDate(settlement.date)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-mono font-bold text-primary">
                      {settlement.ticker}
                    </span>
                  </TableCell>
                  <TableCell className="font-mono">
                    {formatCurrency(settlement.netAmount)}
                  </TableCell>
                  <TableCell className="font-mono text-green-600 dark:text-green-400">
                    {formatCurrency(totalFees)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={getStatusVariant(settlement.status)}
                      style={{ backgroundColor: getStatusColor(settlement.status), color: 'white' }}
                    >
                      {getStatusLabel(settlement.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewDetails(settlement)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Detalhes
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>

        {totalPages > 1 && (
          <div className="mt-4 flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1
                  return (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => handlePageChange(page)}
                        isActive={currentPage === page}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  )
                })}

                {totalPages > 5 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default SettlementsTable