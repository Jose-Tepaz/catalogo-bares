"use client"

import { useState, useMemo, useEffect } from "react"
import { CATEGORIES } from "@/lib/bars-data"
import type { Bar, BarCategory, Estado } from "@/lib/types"
import { useParticipations } from "@/lib/use-participations"
import { createClient } from "@/lib/supabase/client"
import { BarCard } from "@/components/bar-card"
import { UserSidebar } from "@/components/user-sidebar"
import { MobileSidebar } from "@/components/mobile-sidebar"
import { WelcomeModal } from "@/components/welcome-modal"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, X, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"

type StatusFilter = "todos" | "pendiente" | "completado"

interface BarListingProps {
  initialBars: Bar[]
  estados: Estado[]
}

export function BarListing({ initialBars, estados }: BarListingProps) {
  const [stateId, setStateId] = useState<string>("todos")
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<BarCategory | "todas">(
    "todas"
  )
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("todos")
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userName, setUserName] = useState("")

  const { isCompleted, loading } = useParticipations()
  const supabase = useMemo(() => createClient(), [])

  useEffect(() => {
    let mounted = true
    async function loadUser() {
      const { data: { session } } = await supabase.auth.getSession()
      const u = session?.user ?? null
      if (!mounted) return
      const name = (u?.user_metadata?.name as string | undefined) ?? ""
      setUserName(name || (u?.email ? u.email.split("@")[0] : ""))
    }
    loadUser()
    return () => { mounted = false }
  }, [supabase])

  const barCountByState = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const bar of initialBars) {
      if (bar.state_id === null) continue
      counts[bar.state_id] = (counts[bar.state_id] ?? 0) + 1
    }
    return counts
  }, [initialBars])

  const filteredBars = useMemo(() => {
    return initialBars.filter((bar) => {
      if (stateId !== "todos" && bar.state_id !== stateId) return false
      if (search) {
        const q = search.toLowerCase()
        if (
          !bar.name.toLowerCase().includes(q) &&
          !bar.address.toLowerCase().includes(q)
        )
          return false
      }
      if (categoryFilter !== "todas" && bar.category !== categoryFilter)
        return false
      if (statusFilter === "completado" && !isCompleted(bar.id)) return false
      if (statusFilter === "pendiente" && isCompleted(bar.id)) return false
      return true
    })
  }, [stateId, search, categoryFilter, statusFilter, isCompleted, initialBars])

  return (
    <div className="min-h-screen bg-background">
      <WelcomeModal userName={userName} />
      <UserSidebar />
      <MobileSidebar open={mobileOpen} onOpenChange={setMobileOpen} />

      <div className="lg:pl-64">
        {/* Header */}
        <header className=" top-0 z-30 bg-background border-b border-border bg-foreground">
          <div className="px-6 py-5">
            {/* Top row: hamburger + title */}
            <div className="flex items-start gap-3 mb-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileOpen(true)}
                className="shrink-0 lg:hidden -ml-2 text-white"
                aria-label="Abrir menu"
              >
                <Menu className="size-7 text-white" />
              </Button>
              <div>
                <h1 className="heading-style-h2 uppercase font-medium text-foreground tracking-tight text-white">
                  Hola{userName ? `, ${userName}` : ""} | Comienz tu recorrido
                </h1>
                
              </div>
            </div>

            {/* Estado pills */}
            <div className="flex items-center gap-2 mb-4 overflow-x-auto no-scrollbar whitespace-nowrap">
              <button
                onClick={() => setStateId("todos")}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all ${
                  stateId === "todos"
                    ? "text-white border-transparent shadow-sm bg-primary"
                    : "bg-background text-foreground border-border hover:border-foreground/40 hover:shadow-sm"
                }`}
              
              >
                Todos
                <span className={`font-mono text-[10px] rounded-full px-1.5 py-0.5 ${stateId === "todos" ? "bg-background/20 text-background" : "bg-muted text-muted-foreground"}`}>
                  {initialBars.length}
                </span>
              </button>
              {estados.map((estado) => (
                <button
                  key={estado.id}
                  onClick={() => setStateId(estado.id)}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all ${
                    stateId === estado.id
                      ? "text-white shadow-sm bg-primary"
                      : "bg-background text-foreground  hover:shadow-sm"
                  }`}
                  style={stateId === estado.id ? { backgroundColor: 'var(--primary)' } : {}}
                >
                  {estado.name}
                  {barCountByState[estado.id] !== undefined && (
                    <span className={`font-mono text-[10px] rounded-full px-1.5 py-0.5 ${stateId === estado.id ? "bg-background/20 text-background" : "bg-muted text-muted-foreground"}`}>
                      {barCountByState[estado.id]}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Filters row */}
            <div className="flex flex-nowrap items-center gap-3">
              <div className="relative flex-1 min-w-[200px] max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-accent/60" />
                <Input
                  placeholder="Buscar bar..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 h-9 text-sm border-border bg-background focus-visible:ring-accent/40"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label="Limpiar busqueda"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

             
              <Select
                value={statusFilter}
                onValueChange={(v) => setStatusFilter(v as StatusFilter)}
              >
                <SelectTrigger className="w-[150px] h-9 text-sm border-border bg-background focus:ring-accent/40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="pendiente">Pendiente</SelectItem>
                  <SelectItem value="completado">Completado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="px-6 py-8">
          <div className="mb-6 flex items-center gap-2">
            <span
              className="inline-block h-3 w-0.5 rounded-full bg-accent"
              aria-hidden="true"
            />
            <p className="text-xs text-muted-foreground">
              {loading ? "Cargando tus participaciones..." : (
                <>
                  {filteredBars.length}{" "}
                  {filteredBars.length === 1 ? "resultado" : "resultados"}
                </>
              )}
            </p>
          </div>

          {loading ? (
            <div className="grid gap-x-6 gap-y-10 grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <div className="aspect-square rounded-sm bg-muted animate-pulse" />
                  <div className="h-3 w-32 rounded bg-muted animate-pulse" />
                  <div className="h-3 w-24 rounded bg-muted animate-pulse" />
                </div>
              ))}
            </div>
          ) : filteredBars.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <Search className="h-8 w-8 text-border mb-4" />
              <h3 className="text-sm font-medium text-foreground">
                No se encontraron bares
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Intenta con otros filtros
              </p>
            </div>
          ) : (
            <div className="grid gap-x-6 gap-y-10 grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
              {filteredBars.map((bar) => (
                <BarCard key={bar.id} bar={bar} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
