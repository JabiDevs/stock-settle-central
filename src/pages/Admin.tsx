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
  const [settlementAccount, setSettlementAccount] = useState(settings.settlementAccount)
  const [advancedVolume, setAdvancedVolume] = useState(settings.advancedVolume.toString())
  const [editingFeeId, setEditingFeeId] = useState<string | null>(null)
  const [editFeeName, setEditFeeName] = useState("")
  const [editFeeAmount, setEditFeeAmount] = useState("")
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

  const handleEditFee = (feeId: string) => {
    const fee = settings.customFees.find(f => f.id === feeId)
    if (fee) {
      setEditingFeeId(feeId)
      setEditFeeName(fee.name)
      setEditFeeAmount(fee.amount.toString())
    }
  }

  const handleSaveEditFee = () => {
    if (editFeeName.trim() && editFeeAmount.trim() && editingFeeId) {
      const amount = parseFloat(editFeeAmount)
      if (!isNaN(amount) && amount > 0) {
        setSettings(prev => ({
          ...prev,
          customFees: prev.customFees.map(fee => 
            fee.id === editingFeeId 
              ? { ...fee, name: editFeeName.trim(), amount: amount }
              : fee
          )
        }))
        setEditingFeeId(null)
        setEditFeeName("")
        setEditFeeAmount("")
        toast({
          title: "Taxa atualizada",
          description: `${editFeeName} foi atualizada com sucesso`,
        })
      }
    }
  }

  const handleCancelEdit = () => {
    setEditingFeeId(null)
    setEditFeeName("")
    setEditFeeAmount("")
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

  const handleUpdateAccount = () => {
    if (settlementAccount.trim()) {
      setSettings(prev => ({
        ...prev,
        settlementAccount: settlementAccount.trim()
      }))
      toast({
        title: "Conta atualizada",
        description: `Nova conta: ${settlementAccount}`,
      })
    }
  }

  const handleUpdateAdvancedVolume = () => {
    const amount = parseFloat(advancedVolume)
    if (!isNaN(amount) && amount >= 0) {
      setSettings(prev => ({
        ...prev,
        advancedVolume: amount
      }))
      toast({
        title: "Volume adiantado atualizado",
        description: `Novo volume: ${formatCurrency(amount)}`,
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
          Configure limites, tickers não aceitos e taxas personalizadas
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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

        {/* Settlement Account */}
        <Card className="card-financial">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              Conta de Liquidação
            </CardTitle>
            <CardDescription>
              Configure a conta utilizada para liquidações
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="settlementAccount">Número da Conta</Label>
              <Input
                id="settlementAccount"
                placeholder="001-12345-6"
                value={settlementAccount}
                onChange={(e) => setSettlementAccount(e.target.value)}
              />
            </div>
            <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
              <span className="text-sm font-medium">Conta Atual:</span>
              <span className="font-bold text-lg">{settings.settlementAccount}</span>
            </div>
            <Button onClick={handleUpdateAccount} className="w-full">
              Atualizar Conta
            </Button>
          </CardContent>
        </Card>

        {/* Fee Preview */}
        <Card className="card-financial">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-primary" />
              Volume Adiantado
            </CardTitle>
            <CardDescription>
              Configure o volume financeiro já adiantado
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="advancedVolume">Volume Adiantado (R$)</Label>
              <Input
                id="advancedVolume"
                type="number"
                step="0.01"
                placeholder="600000.00"
                value={advancedVolume}
                onChange={(e) => setAdvancedVolume(e.target.value)}
              />
            </div>
            <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
              <span className="text-sm font-medium">Volume Atual:</span>
              <span className="font-bold text-lg">{formatCurrency(settings.advancedVolume)}</span>
            </div>
            <Button onClick={handleUpdateAdvancedVolume} className="w-full">
              Atualizar Volume
            </Button>
            <div className="p-3 bg-accent/10 rounded-lg">
              <p className="text-sm text-muted-foreground">
                Volume total de recursos já adiantados para liquidações
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Non-Accepted Tickers */}
      <Card className="card-financial">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Tickers Não Aceitos
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
              Nenhum ticker não aceito configurado
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
                  <TableCell className="font-medium">
                    {editingFeeId === fee.id ? (
                      <Input
                        value={editFeeName}
                        onChange={(e) => setEditFeeName(e.target.value)}
                        placeholder="Nome da taxa"
                      />
                    ) : (
                      fee.name
                    )}
                  </TableCell>
                  <TableCell className="font-mono">
                    {editingFeeId === fee.id ? (
                      <Input
                        type="number"
                        value={editFeeAmount}
                        onChange={(e) => setEditFeeAmount(e.target.value)}
                        placeholder="Valor"
                      />
                    ) : (
                      formatCurrency(fee.amount)
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      {editingFeeId === fee.id ? (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleSaveEditFee}
                          >
                            Salvar
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleCancelEdit}
                          >
                            Cancelar
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditFee(fee.id)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemoveFee(fee.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
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