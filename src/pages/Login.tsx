import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BarChart3 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const Login = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { toast } = useToast()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      if (username === "admin" && password === "admin123") {
        localStorage.setItem('authToken', 'mock-token-123')
        localStorage.setItem('userInfo', JSON.stringify({ name: 'Administrador', role: 'admin' }))
        
        toast({
          title: "Login realizado com sucesso",
          description: "Redirecionando para o dashboard...",
          variant: "default",
        })
        
        navigate("/")
      } else {
        toast({
          title: "Erro no login",
          description: "Usuário ou senha incorretos",
          variant: "destructive",
        })
      }
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary p-6">
      <Card className="w-full max-w-md card-financial">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
            <BarChart3 className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">Stock Settle Central</CardTitle>
            <CardDescription>
              Sistema de acompanhamento de liquidações
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Usuário</Label>
              <Input
                id="username"
                type="text"
                placeholder="Digite seu usuário"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-gradient-primary hover:bg-primary-hover"
              disabled={isLoading}
            >
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm text-muted-foreground">
            <p>Usuário demo: <span className="font-mono text-foreground">admin</span></p>
            <p>Senha demo: <span className="font-mono text-foreground">admin123</span></p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Login