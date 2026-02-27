"use client"

import type { Bar } from "@/lib/types"
import { useParticipations } from "@/lib/use-participations"
import { useEffect } from "react"
import { Wine, CheckCircle2, ArrowRight, Pencil } from "lucide-react"
import Link from "next/link"

interface BarCardProps {
  bar: Bar
}

export function BarCard({ bar }: BarCardProps) {
  const { isCompleted, getParticipation, fetchParticipationPhoto } = useParticipations()
  const completed = isCompleted(bar.id)
  const participation = getParticipation(bar.id)
  useEffect(() => {
    if (completed && participation && !participation.photoDataUrl) {
      fetchParticipationPhoto(bar.id)
    }
  // Solo re-ejecutar cuando cambia el barId o cuando la foto pasa de vacía a tener valor
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [completed, participation?.barId])

  return (
    <Link href={`/bar/${bar.id}`} className="group block">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden rounded-sm bg-muted border border-border/60">
        {completed && participation?.photoDataUrl ? (
          <>
            <img
              src={participation.photoDataUrl}
              alt={bar.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute top-2.5 right-2.5 flex items-center gap-1 rounded-full bg-foreground/80 px-2 py-1">
              <CheckCircle2 className="h-3 w-3 text-accent" />
              <span className="text-[10px] font-semibold text-background">Visitado</span>
            </div>
            {/* Hover: Editar */}
            <div className="absolute inset-0 flex items-end justify-center pb-5 opacity-0 transition-all duration-300 group-hover:bg-foreground/25 group-hover:opacity-100">
              <span className="flex items-center gap-1.5 rounded-full bg-background px-3.5 py-1.5 text-xs font-semibold text-foreground shadow-lg translate-y-2 transition-transform duration-300 group-hover:translate-y-0">
                <Pencil className="h-3 w-3" />
                Editar
              </span>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <Wine className="h-8 w-8 text-accent/30" />
            <span className="text-[10px] text-muted-foreground/50 uppercase tracking-widest">
              Pendiente
            </span>
            {/* Hover: Participar */}
            <div className="absolute inset-0 flex items-end justify-center pb-5 opacity-0 transition-all duration-300 group-hover:bg-foreground/10 group-hover:opacity-100">
              <span className="flex items-center gap-1.5 rounded-full bg-foreground px-3.5 py-1.5 text-xs font-semibold text-background shadow-lg translate-y-2 transition-transform duration-300 group-hover:translate-y-0">
                Participar
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Text below */}
      <div className="pt-3">
        <h3 className="text-sm font-semibold text-foreground leading-tight group-hover:underline decoration-accent underline-offset-2">
          {bar.name}
        </h3>
        <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
          <span>{bar.city}</span>
          <span className="inline-block h-3 w-px bg-accent/50" aria-hidden="true" />
          <span>{bar.category}</span>
        </p>
      </div>
    </Link>
  )
}
