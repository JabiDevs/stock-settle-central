import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { mockSettlements, Settlement } from "@/data/mockData"
import SettlementModal from "@/components/SettlementModal"
import SettlementsTable from "@/components/SettlementsTable"
import { useNavigate } from "react-router-dom"


const Settlements = () => {
  const [selectedSettlement, setSelectedSettlement] = useState<Settlement | null>(null)
  const navigate = useNavigate()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleViewDetails = (settlement: Settlement) => {
    setSelectedSettlement(settlement)
    setIsModalOpen(true)
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
      <SettlementsTable
        settlements={mockSettlements}
        onViewDetails={handleViewDetails}
      />

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