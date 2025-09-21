import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { Search, Eye, Calendar } from "lucide-react"
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
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const filteredSettlements = settlements.filter(settlement =>
    settlement.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    settlement.ticker.toLowerCase().includes(searchTerm.toLowerCase()) ||
    settlement.brokerName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalPages = Math.ceil(filteredSettlements.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentSettlements = filteredSettlements.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <Card className="card-financial">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle>Lista de Liquidações</CardTitle>
            <CardDescription>
              {filteredSettlements.length} liquidação(ões) encontrada(s)
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar liquidações..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Ticker</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentSettlements.map((settlement) => (
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
                <TableCell>
                  <Badge variant={getStatusVariant(settlement.status)}>
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
            ))}
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