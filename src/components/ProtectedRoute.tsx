import { ReactNode, useEffect } from "react"
import { useNavigate } from "react-router-dom"

interface ProtectedRouteProps {
  children: ReactNode
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const navigate = useNavigate()

  useEffect(() => {
    const authToken = localStorage.getItem('authToken')
    if (!authToken) {
      navigate('/login')
    }
  }, [navigate])

  const authToken = localStorage.getItem('authToken')
  
  if (!authToken) {
    return null
  }

  return <>{children}</>
}

export default ProtectedRoute