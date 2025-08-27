import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Plus, Trash2, Edit, Settings, DollarSign, Shield, Calculator } from "lucide-react"
import { mockAdminSettings, AdminSettings } from "@/data/mockData"
import { useToast } from "@/hooks/use-toast"

const Admin = () => {
  const [settings, setSettings] = useState<AdminSettings>(mockAdminSettings)
  const [newTicker, setNewTicker] = useState("")
  const [newFeeName, setNewFeeName] = useState("")
  const [newFeeAmount, setNewFeeAmount] = useState("")
  const [maxAmount, setMaxAmount] = useState(settings.maxSettlementAmount.toString())
  const { toast } = useToast()

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount)
  }

  const handleAddTicker = () => {
    if (newTicker.trim() && !settings.prohibitedTickers.includes(newTicker.toUpperCase())) {
      setSettings(prev => ({
        ...prev,
        prohibitedTickers: [...prev.prohibitedTickers, newTicker.toUpperCase()]
      }))
      setNewTicker("")
      toast({
        title: "Ticker adicionado",
        description: `${newTicker.toUpperCase()} foi adicionado à lista de proibidos`,
      })
    }
  }

  const handleRemoveTicker = (ticker: string) => {
    setSettings(prev => ({
      ...prev,
      prohibitedTickers: prev.prohibitedTickers.filter(t => t !== ticker)
    }))
    toast({
      title: "Ticker removido",
      description: `${ticker} foi removido da lista de proibidos`,
    })
  }

  const handleAddFee = () => {
    if (newFeeName.trim() && newFeeAmount.trim()) {
      const amount = parseFloat(newFeeAmount)
      if (!isNaN(amount) && amount > 0) {
        const newFee = {
          id: Date.now().toString(),
          name: newFeeName.trim(),
          amount: amount
        }
        setSettings(prev => ({
          ...prev,
          customFees: [...prev.customFees, newFee]
        }))
        setNewFeeName("")
        setNewFeeAmount("")
        toast({
          title: "Taxa adicionada",
          description: `${newFee.name} foi adicionada com sucesso`,
        })
      }
    }
  }

  const handleRemoveFee = (feeId: string) => {
    const fee = settings.customFees.find(f => f.id === feeId)
    setSettings(prev => ({
      ...prev,
      customFees: prev.customFees.filter(f => f.id !== feeId)
    }))
    toast({
      title: "Taxa removida",
      description: `${fee?.name} foi removida`,
    })
  }

  const handleUpdateMaxAmount = () => {
    const amount = parseFloat(maxAmount)
    if (!isNaN(amount) && amount > 0) {
      setSettings(prev => ({
        ...prev,
        maxSettlementAmount: amount
      }))
      toast({
        title: "Limite atualizado",
        description: `Novo limite: ${formatCurrency(amount)}`,
      })
    }
  }

  const totalFees = settings.customFees.reduce((sum, fee) => sum + fee.amount, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Administração</h1>
        <p className="text-muted-foreground">
          Configure limites, tickers proibidos e taxas personalizadas
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Maximum Settlement Amount */}
        <Card className="card-financial">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              Valor Máximo por Liquidação
            </CardTitle>
            <CardDescription>
              Defina o limite máximo permitido para liquidações
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="maxAmount">Valor Máximo (R$)</Label>
              <Input
                id="maxAmount"
                type="number"
                placeholder="500000.00"
                value={maxAmount}
                onChange={(e) => setMaxAmount(e.target.value)}
              />
            </div>
            <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
              <span className="text-sm font-medium">Limite Atual:</span>
              <span className="font-bold text-lg">{formatCurrency(settings.maxSettlementAmount)}</span>
            </div>
            <Button onClick={handleUpdateMaxAmount} className="w-full">
              Atualizar Limite
            </Button>
          </CardContent>
        </Card>

        {/* Fee Preview */}
        <Card className="card-financial">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-primary" />
              Pré-visualização de Taxas
            </CardTitle>
            <CardDescription>
              Visualização dinâmica do total de taxas configuradas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {settings.customFees.map((fee) => (
                <div key={fee.id} className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">{fee.name}</span>
                  <span className="font-medium">{formatCurrency(fee.amount)}</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-2">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Total de Taxas:</span>
                <span className="font-bold text-xl text-primary">{formatCurrency(totalFees)}</span>
              </div>
            </div>
            <div className="p-3 bg-accent/10 rounded-lg">
              <p className="text-sm text-muted-foreground">
                Este total será aplicado automaticamente em novas liquidações
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Prohibited Tickers */}
      <Card className="card-financial">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Tickers Proibidos
          </CardTitle>
          <CardDescription>
            Gerencie a lista de tickers que não podem ser liquidados
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Digite o ticker (ex: OIBR3)"
              value={newTicker}
              onChange={(e) => setNewTicker(e.target.value.toUpperCase())}
              onKeyPress={(e) => e.key === 'Enter' && handleAddTicker()}
            />
            <Button onClick={handleAddTicker}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {settings.prohibitedTickers.map((ticker) => (
              <Badge key={ticker} variant="destructive" className="flex items-center gap-1">
                {ticker}
                <button
                  onClick={() => handleRemoveTicker(ticker)}
                  className="hover:bg-destructive-foreground/20 rounded-full p-0.5"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
          
          {settings.prohibitedTickers.length === 0 && (
            <p className="text-muted-foreground text-sm">
              Nenhum ticker proibido configurado
            </p>
          )}
        </CardContent>
      </Card>

      {/* Custom Fees */}
      <Card className="card-financial">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            Taxas Personalizadas
          </CardTitle>
          <CardDescription>
            Configure taxas que serão aplicadas nas liquidações
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <Input
              placeholder="Nome da taxa"
              value={newFeeName}
              onChange={(e) => setNewFeeName(e.target.value)}
            />
            <Input
              type="number"
              placeholder="Valor (R$)"
              value={newFeeAmount}
              onChange={(e) => setNewFeeAmount(e.target.value)}
            />
            <Button onClick={handleAddFee}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Taxa
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome da Taxa</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {settings.customFees.map((fee) => (
                <TableRow key={fee.id}>
                  <TableCell className="font-medium">{fee.name}</TableCell>
                  <TableCell className="font-mono">{formatCurrency(fee.amount)}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveFee(fee.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {settings.customFees.length === 0 && (
            <p className="text-muted-foreground text-sm text-center py-4">
              Nenhuma taxa personalizada configurada
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default Admin