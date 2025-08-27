import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Settlements from "./Settlements"

const Index = () => {
  const navigate = useNavigate()

  useEffect(() => {
    // Check if user is authenticated
    const authToken = localStorage.getItem('authToken')
    if (!authToken) {
      navigate('/login')
    }
  }, [navigate])

  return <Settlements />
};

export default Index;
