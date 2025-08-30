import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, Plus, ArrowLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useNavigate } from "react-router-dom"
import { Settlement } from "@/data/mockData"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface SettlementForm {
  ticker: string
  shares: number
  grossAmount: number
  brokerName: string
  paymentDate: Date | undefined
  notes: string
}

const CreateSettlement = () => {
  const [form, setForm] = useState<SettlementForm>({
    ticker: "",
    shares: 0,
    grossAmount: 0,
    brokerName: "",
    paymentDate: undefined,
    notes: ""
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const navigate = useNavigate()

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount)
  }

  const calculateFees = (grossAmount: number) => {
    const baseFees = [
      { name: "Taxa de Corretagem", amount: grossAmount * 0.0025 },
      { name: "Taxa de Liquidação", amount: grossAmount * 0.001 },
      { name: "Emolumentos", amount: grossAmount * 0.0012 }
    ]
    return baseFees
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validações básicas
      if (!form.ticker || !form.shares || !form.grossAmount || !form.brokerName || !form.paymentDate) {
        toast({
          title: "Erro na validação",
          description: "Todos os campos obrigatórios devem ser preenchidos",
          variant: "destructive"
        })
        return
      }

      // Simular criação da liquidação
      const fees = calculateFees(form.grossAmount)
      const totalFees = fees.reduce((sum, fee) => sum + fee.amount, 0)
      
      const newSettlement: Settlement = {
        id: `LIQ-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`,
        date: new Date().toISOString().split('T')[0],
        amount: form.grossAmount,
        status: 'initiated',
        ticker: form.ticker.toUpperCase(),
        shares: form.shares,
        grossAmount: form.grossAmount,
        netAmount: form.grossAmount - totalFees,
        fees: fees,
        paymentDate: form.paymentDate.toISOString().split('T')[0],
        brokerName: form.brokerName,
        history: [{
          status: 'initiated',
          timestamp: new Date().toISOString(),
          description: 'Liquidação criada manualmente'
        }]
      }

      // Simular delay de processamento
      await new Promise(resolve => setTimeout(resolve, 1000))

      toast({
        title: "Liquidação criada com sucesso",
        description: `ID: ${newSettlement.id} - ${formatCurrency(newSettlement.grossAmount)}`,
      })

      // Limpar formulário
      setForm({
        ticker: "",
        shares: 0,
        grossAmount: 0,
        brokerName: "",
        paymentDate: undefined,
        notes: ""
      })

      // Redirecionar para liquidações após 2 segundos
      setTimeout(() => {
        navigate('/settlements')
      }, 2000)

    } catch (error) {
      toast({
        title: "Erro ao criar liquidação",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const fees = form.grossAmount > 0 ? calculateFees(form.grossAmount) : []
  const totalFees = fees.reduce((sum, fee) => sum + fee.amount, 0)
  const netAmount = form.grossAmount - totalFees

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate('/settlements')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Nova Liquidação</h1>
          <p className="text-muted-foreground">
            Cadastre uma nova liquidação manualmente
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Dados da Operação */}
          <Card>
            <CardHeader>
              <CardTitle>Dados da Operação</CardTitle>
              <CardDescription>
                Informações básicas da liquidação
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ticker">Ticker *</Label>
                  <Input
                    id="ticker"
                    placeholder="PETR4"
                    value={form.ticker}
                    onChange={(e) => setForm(prev => ({ ...prev, ticker: e.target.value.toUpperCase() }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shares">Quantidade *</Label>
                  <Input
                    id="shares"
                    type="number"
                    placeholder="1000"
                    value={form.shares || ""}
                    onChange={(e) => setForm(prev => ({ ...prev, shares: parseInt(e.target.value) || 0 }))}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="grossAmount">Valor Bruto (R$) *</Label>
                <Input
                  id="grossAmount"
                  type="number"
                  step="0.01"
                  placeholder="125000.00"
                  value={form.grossAmount || ""}
                  onChange={(e) => setForm(prev => ({ ...prev, grossAmount: parseFloat(e.target.value) || 0 }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="brokerName">Corretora *</Label>
                <Select value={form.brokerName} onValueChange={(value) => setForm(prev => ({ ...prev, brokerName: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a corretora" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="XP Investimentos">XP Investimentos</SelectItem>
                    <SelectItem value="BTG Pactual">BTG Pactual</SelectItem>
                    <SelectItem value="Rico Investimentos">Rico Investimentos</SelectItem>
                    <SelectItem value="Nubank">Nubank</SelectItem>
                    <SelectItem value="Inter">Inter</SelectItem>
                    <SelectItem value="Clear">Clear</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Data de Pagamento *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !form.paymentDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {form.paymentDate ? format(form.paymentDate, "PPP") : "Selecione a data"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={form.paymentDate}
                      onSelect={(date) => setForm(prev => ({ ...prev, paymentDate: date }))}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Observações</Label>
                <Textarea
                  id="notes"
                  placeholder="Observações adicionais sobre a liquidação..."
                  value={form.notes}
                  onChange={(e) => setForm(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Resumo Financeiro */}
          <Card>
            <CardHeader>
              <CardTitle>Resumo Financeiro</CardTitle>
              <CardDescription>
                Cálculo automático de taxas e valor líquido
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm font-medium">Valor Bruto:</span>
                  <span className="font-bold text-lg">{formatCurrency(form.grossAmount)}</span>
                </div>

                {fees.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Taxas:</Label>
                    {fees.map((fee, index) => (
                      <div key={index} className="flex justify-between items-center text-sm px-3 py-2 bg-background rounded border">
                        <span className="text-muted-foreground">{fee.name}</span>
                        <span className="font-medium">{formatCurrency(fee.amount)}</span>
                      </div>
                    ))}
                    <div className="flex justify-between items-center px-3 py-2 bg-muted/30 rounded font-medium">
                      <span>Total de Taxas:</span>
                      <span>{formatCurrency(totalFees)}</span>
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center p-3 bg-primary/10 rounded-lg border border-primary/20">
                  <span className="text-sm font-semibold">Valor Líquido:</span>
                  <span className="font-bold text-xl text-primary">{formatCurrency(netAmount)}</span>
                </div>

                {form.grossAmount > 500000 && (
                  <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <p className="text-sm text-destructive font-medium">
                      ⚠️ Atenção: Valor acima do limite de R$ 500.000
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Botões de Ação */}
        <div className="flex gap-4 justify-end">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate('/settlements')}
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="flex items-center gap-2"
          >
            {isSubmitting ? (
              "Criando..."
            ) : (
              <>
                <Plus className="h-4 w-4" />
                Criar Liquidação
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default CreateSettlement