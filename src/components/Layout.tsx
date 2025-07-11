import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
export function Layout() {
  return <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6">
            <SidebarTrigger className="-ml-1" />
            <div className="flex items-center gap-3">
              <img src="/lovable-uploads/95734ff5-df07-42ce-8f98-3d94400761c8.png" alt="JLVIANA Logo" className="h-8 w-8 object-contain" />
              <div className="flex items-center gap-2">
                <div className="text-xs font-display font-light tracking-tight text-primary">
                  JLVIANA
                </div>
                <div className="text-sm text-muted-foreground font-medium">
                  Consultoria Contábil
                </div>
              </div>
            </div>
          </header>
          <main className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>;
}