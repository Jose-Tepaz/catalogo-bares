"use client"

import { useParticipations } from "@/lib/use-participations"
import { UserSidebar } from "@/components/user-sidebar"
import { MobileSidebar } from "@/components/mobile-sidebar"
import { Button } from "@/components/ui/button"
import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import {
  Menu,
  ArrowLeft,
  MapPin,
  Pencil,
  Calendar,
  Wine,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import type { Bar, BarCategory } from "@/lib/types"

export default function ParticipacionesPage() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { participations, loading, fetchParticipationPhoto } = useParticipations()
  const [allBars, setAllBars] = useState<Bar[]>([])
  const supabase = useMemo(() => createClient(), [])

  useEffect(() => {
    supabase
      .from("bars")
      .select("*")
      .then(({ data }) => {
        if (data) {
          setAllBars(
            data.map((bar) => ({
              id: bar.id,
              name: bar.name,
              city: bar.city,
              address: bar.address,
              category: bar.category as BarCategory,
              imageUrl: bar.image_url ?? null,
              state_id: bar.state_id ?? null,
            }))
          )
        }
      })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Cargar fotos de todas las participaciones que aún no las tienen
  useEffect(() => {
    if (loading) return
    const sinFoto = Object.keys(participations).filter(
      (barId) => !participations[barId].photoDataUrl
    )
    sinFoto.forEach((barId) => fetchParticipationPhoto(barId))
  // Solo re-ejecutar cuando termina el loading o cambia el conjunto de barIds
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, Object.keys(participations).sort().join(",")])

  const participatedBars = allBars
    .filter((bar) => bar.id in participations)
    .map((bar) => ({
      ...bar,
      participation: participations[bar.id],
    }))
    .sort(
      (a, b) =>
        new Date(b.participation.createdAt).getTime() -
        new Date(a.participation.createdAt).getTime()
    )

  const pendingCount = allBars.length - participatedBars.length

  return (
    <div className="min-h-screen bg-background">
      <UserSidebar />
      <MobileSidebar open={mobileOpen} onOpenChange={setMobileOpen} />

      <div className="lg:pl-64">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-background border-b border-border">
          <div className="px-6 py-5">
            <div className="flex items-center gap-3">
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
                <Button
                  variant="ghost"
                  size="icon"
                  className="-ml-2 hidden lg:inline-flex"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div>
                <h1 className="text-lg font-bold text-foreground tracking-tight">
                  Mis <span className="text-accent">Participaciones</span>
                </h1>
                <p className="text-[11px] text-muted-foreground tracking-wide">
                  {participatedBars.length} completadas &middot; {pendingCount}{" "}
                  pendientes
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="px-6 py-8">
          {loading ? (
            <div className="space-y-4 max-w-2xl">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex gap-4 rounded-lg border border-border bg-card p-4"
                >
                  <div className="h-24 w-24 rounded-md bg-muted animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-40 rounded bg-muted animate-pulse" />
                    <div className="h-3 w-32 rounded bg-muted animate-pulse" />
                    <div className="h-3 w-full rounded bg-muted animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : participatedBars.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <Wine className="h-10 w-10 text-accent/30 mb-4" />
              <h3 className="text-sm font-semibold text-foreground">
                Aun no tienes participaciones
              </h3>
              <p className="mt-1 text-xs text-muted-foreground max-w-xs">
                Explora los bares y registra tu primera visita para verla aqui
              </p>
              <Link href="/" className="mt-5">
                <Button
                  size="sm"
                  className="bg-foreground text-background hover:bg-foreground/90"
                >
                  Explorar bares
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4 max-w-2xl">
              {participatedBars.map(({ participation, ...bar }) => {
                const date = new Date(participation.createdAt)
                const formatted = date.toLocaleDateString("es-MX", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })

                return (
                  <div
                    key={bar.id}
                    className="group flex gap-4 rounded-lg border border-border bg-card p-4 transition-colors hover:border-accent/30"
                  >
                    {/* Photo */}
                    <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-md bg-muted">
                      {participation.photoDataUrl ? (
                        <img
                          src={participation.photoDataUrl}
                          alt={participation.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <Wine className="h-6 w-6 text-accent/30" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h3 className="text-sm font-semibold text-foreground truncate">
                            {participation.title}
                          </h3>
                          <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1.5">
                            <span>{bar.name}</span>
                            <span
                              className="inline-block h-2.5 w-px bg-accent/50"
                              aria-hidden="true"
                            />
                            <span>{bar.city}</span>
                          </p>
                        </div>
                        <Link href={`/bar/${bar.id}`}>
                          <button
                            className="shrink-0 flex items-center justify-center h-8 w-8 transition-all duration-200 hover:text-white"
                            style={{ backgroundColor: '#003D6A', borderRadius: '5px', color: 'white' }}
                            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#002a4a')}
                            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#003D6A')}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                        </Link>
                      </div>

                      <p className="text-xs text-muted-foreground/80 mt-2 line-clamp-2 leading-relaxed">
                        {participation.story}
                      </p>

                      <div className="flex items-center gap-1.5 mt-2.5">
                        <Calendar className="h-3 w-3 text-accent/60" />
                        <span className="text-[10px] text-muted-foreground">
                          {formatted}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
