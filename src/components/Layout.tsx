import { ReactNode } from "react"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { PanelLeftOpen, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"

interface LayoutProps {
  children: ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center border-b border-border bg-card px-4">
            <SidebarTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-foreground hover:bg-sidebar-accent p-2 md:hidden"
                aria-label="Abrir menu lateral"
              >
                <PanelLeftOpen className="h-5 w-5" />
              </Button>
            </SidebarTrigger>
            <SidebarTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-foreground hover:bg-sidebar-accent p-2 hidden md:flex"
                aria-label="Alternar menu lateral"
              >
                <Menu className="h-4 w-4" />
              </Button>
            </SidebarTrigger>
            <div className="ml-4">
              <h1 className="font-semibold text-foreground">Central de Liquidações</h1>
            </div>
          </header>
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}

export default Layout