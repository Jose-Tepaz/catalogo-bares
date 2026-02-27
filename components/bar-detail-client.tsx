"use client"

import { useState, useRef } from "react"
import type { Bar } from "@/lib/types"
import { useParticipations } from "@/lib/use-participations"
import { ParticipationSection } from "@/components/participation-section"
import { UserSidebar } from "@/components/user-sidebar"
import { MobileSidebar } from "@/components/mobile-sidebar"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import {
  ArrowLeft,
  MapPin,
  CheckCircle2,
  Clock,
  Menu,
  Camera,
} from "lucide-react"
import Link from "next/link"

interface BarDetailClientProps {
  bar: Bar
}

export function BarDetailClient({ bar }: BarDetailClientProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { isCompleted } = useParticipations()
  const completed = isCompleted(bar.id)
  const participationRef = useRef<HTMLDivElement>(null)

  function scrollToParticipation() {
    participationRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="min-h-screen bg-background">
      <UserSidebar />
      <MobileSidebar open={mobileOpen} onOpenChange={setMobileOpen} />

      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-background border-b border-border">
          <div className="flex items-center gap-3 px-6 py-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileOpen(true)}
              className="shrink-0 lg:hidden -ml-2"
              aria-label="Abrir menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2 -ml-2 text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-4 w-4" />
                Volver
              </Button>
            </Link>
          </div>
        </header>

        <main className="mx-auto max-w-2xl px-6 py-10">
          {/* Bar info */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground tracking-tight text-balance mb-3">
              {bar.name}
            </h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground mb-4">
              <div className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                <span>{bar.address}, {bar.city}</span>
              </div>
              <span>&middot;</span>
              <span>{bar.category}</span>
            </div>
            {completed ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-success bg-success/10 rounded-full px-2.5 py-1">
                <CheckCircle2 className="h-3 w-3" />
                Completado
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-muted rounded-full px-2.5 py-1">
                <Clock className="h-3 w-3" />
                Pendiente
              </span>
            )}
          </div>

          <Separator className="my-8" />

          {/* Participation */}
          <div ref={participationRef}>
            <ParticipationSection bar={bar} />
          </div>
        </main>

        {/* Floating button when not completed */}
        {!completed && (
          <div className="fixed bottom-6 right-6 lg:right-6 z-40">
            <Button
              size="lg"
              onClick={scrollToParticipation}
              className="gap-2 rounded-full shadow-lg bg-foreground text-background hover:bg-foreground/90 px-6"
            >
              <Camera className="h-4 w-4" />
              Subir foto
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
