"use client"

import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { SidebarContent } from "@/components/user-sidebar"

interface MobileSidebarProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MobileSidebar({ open, onOpenChange }: MobileSidebarProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-64 p-0 bg-sidebar border-r border-sidebar-border">
        <SheetTitle className="sr-only">Perfil de usuario</SheetTitle>
        <SheetDescription className="sr-only">
          Tu progreso y estadisticas del pasaporte coctelero
        </SheetDescription>
        <SidebarContent />
      </SheetContent>
    </Sheet>
  )
}
