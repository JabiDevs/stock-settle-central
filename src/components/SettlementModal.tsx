import { Settlement } from "@/data/mockData"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Calendar, DollarSign, TrendingUp, Building } from "lucide-react"

interface SettlementModalProps {
  settlement: Settlement | null
  open: boolean
  onClose: () => void
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

const SettlementModal = ({ settlement, open, onClose }: SettlementModalProps) => {
  if (!settlement) return null

  const totalFees = settlement.fees.reduce((sum, fee) => sum + fee.amount, 0)

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Detalhes da Liquidação {settlement.id}
          </DialogTitle>
          <DialogDescription>
            Informações detalhadas sobre a liquidação de ações
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status and Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Status</label>
              <Badge variant={getStatusVariant(settlement.status)} className="w-fit">
                {getStatusLabel(settlement.status)}
              </Badge>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Data</label>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{formatDate(settlement.date)}</span>
              </div>
            </div>
          </div>

          {/* Asset Information */}
          <div className="card-financial p-4 space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <Building className="h-4 w-4" />
              Informações do Ativo
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Ticker</label>
                <p className="font-mono text-lg font-bold text-primary">{settlement.ticker}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Quantidade</label>
                <p className="text-lg font-semibold">{settlement.shares.toLocaleString('pt-BR')}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Corretora</label>
                <p className="font-medium">{settlement.brokerName}</p>
              </div>
            </div>
          </div>

          {/* Financial Details */}
          <div className="card-financial p-4 space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Detalhes Financeiros
            </h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Valor Bruto</span>
                <span className="font-semibold text-lg">{formatCurrency(settlement.grossAmount)}</span>
              </div>

              <Separator />

              <div className="space-y-2">
                <span className="font-medium text-muted-foreground">Taxas e Emolumentos</span>
                {settlement.fees.map((fee, index) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">{fee.name}</span>
                    <span className="text-destructive">-{formatCurrency(fee.amount)}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center text-sm font-medium pt-1 border-t">
                  <span>Total de Taxas</span>
                  <span className="text-destructive">-{formatCurrency(totalFees)}</span>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between items-center">
                <span className="font-semibold">Valor Líquido</span>
                <span className="font-bold text-xl text-success">{formatCurrency(settlement.netAmount)}</span>
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Data de Pagamento</span>
                <span className="font-medium">{formatDate(settlement.paymentDate)}</span>
              </div>
            </div>
          </div>

          {/* History Timeline */}
          <div className="space-y-3">
            <h3 className="font-semibold">Histórico da Liquidação</h3>
            <div className="space-y-3">
              {settlement.history.map((event, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                    event.status === 'Paid' ? 'bg-success' :
                    event.status === 'Created' || event.status === 'SentToPay' ? 'bg-accent' :
                    event.status === 'NotAccepted' ? 'bg-destructive' :
                    'bg-muted-foreground'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{getStatusLabel(event.status)}</p>
                        <p className="text-sm text-muted-foreground">{event.description}</p>
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                        {new Date(event.timestamp).toLocaleString('pt-BR')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default SettlementModal