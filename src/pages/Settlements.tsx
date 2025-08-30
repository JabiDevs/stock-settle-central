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
import { Search, Eye, TrendingUp, DollarSign, Calendar, AlertCircle, Plus } from "lucide-react"
import { mockSettlements, Settlement } from "@/data/mockData"
import SettlementModal from "@/components/SettlementModal"
import { useNavigate } from "react-router-dom"

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'completed':
      return 'default'
    case 'processing':
      return 'secondary'
    case 'failed':
      return 'destructive'
    case 'initiated':
      return 'outline'
    default:
      return 'outline'
  }
}

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'completed':
      return 'Concluída'
    case 'processing':
      return 'Em Processamento'
    case 'failed':
      return 'Falha'
    case 'initiated':
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

const Settlements = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSettlement, setSelectedSettlement] = useState<Settlement | null>(null)
  const navigate = useNavigate()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const filteredSettlements = mockSettlements.filter(settlement =>
    settlement.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    settlement.ticker.toLowerCase().includes(searchTerm.toLowerCase()) ||
    settlement.brokerName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleViewDetails = (settlement: Settlement) => {
    setSelectedSettlement(settlement)
    setIsModalOpen(true)
  }

  const stats = {
    total: mockSettlements.length,
    completed: mockSettlements.filter(s => s.status === 'completed').length,
    processing: mockSettlements.filter(s => s.status === 'processing').length,
    failed: mockSettlements.filter(s => s.status === 'failed').length,
    totalAmount: mockSettlements.reduce((sum, s) => sum + s.netAmount, 0)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Liquidações de Ações</h1>
          <p className="text-muted-foreground">
            Acompanhe o status e detalhes de todas as liquidações
          </p>
        </div>
        <Button 
          onClick={() => navigate('/settlements/create')}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Nova Liquidação
        </Button>
      </div>


      {/* Settlements Table */}
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
                <TableHead>Corretora</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSettlements.map((settlement) => (
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
                  <TableCell className="font-medium">
                    {settlement.brokerName}
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
                      onClick={() => handleViewDetails(settlement)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Detalhes
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Settlement Modal */}
      <SettlementModal
        settlement={selectedSettlement}
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  )
}

export default Settlements