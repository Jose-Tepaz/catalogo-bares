"use client"

import type { Bar } from "@/lib/types"
import { useParticipations } from "@/lib/use-participations"
import { Wine, ArrowRight, Pencil } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { ParticipationModal } from "@/components/participation-modal"

interface BarCardProps {
  bar: Bar
}

export function BarCard({ bar }: BarCardProps) {
  const { isCompleted } = useParticipations()
  const completed = isCompleted(bar.id)
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <>
      <div className="group block cursor-pointer">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden rounded-sm bg-muted border border-border/60 rounded-xl">
          {completed ? (
            <>
              <button
                type="button"
                className="absolute inset-0 w-full h-full"
                onClick={() => setModalOpen(true)}
                aria-label={`Editar participacion en ${bar.name}`}
              >
                <Image
                  src="/completado.png"
                  alt="Completado"
                  fill
                  className=" object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Hover: Editar */}
                <div className="absolute inset-0 flex items-end justify-center pb-5 opacity-0 transition-all duration-300 group-hover:bg-foreground/25 group-hover:opacity-100">
                  <span className="flex items-center gap-1.5 bg-background px-3.5 py-1.5 text-xs font-semibold text-foreground shadow-lg translate-y-2 transition-transform duration-300 group-hover:translate-y-0" style={{ borderRadius: '5px' }}>
                    <Pencil className="h-3 w-3" />
                    Editar
                  </span>
                </div>
              </button>
            </>
          ) : bar.imageUrl ? (
            <>
              <button
                type="button"
                className="absolute inset-0 w-full h-full"
                onClick={() => setModalOpen(true)}
                aria-label={`Participar en ${bar.name}`}
              >
                <Image
                  src={bar.imageUrl}
                  alt={bar.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Hover: Participar */}
                <div className="absolute inset-0 flex items-end justify-center pb-5 opacity-0 transition-all duration-300 group-hover:bg-foreground/30 group-hover:opacity-100">
                  <span className="flex items-center gap-1.5 bg-foreground px-3.5 py-1.5 text-xs font-semibold text-background shadow-lg translate-y-2 transition-transform duration-300 group-hover:translate-y-0" style={{ borderRadius: '5px' }}>
                    Participar
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </button>
            </>
          ) : (
            <button
              type="button"
              className="absolute inset-0 w-full h-full flex flex-col items-center justify-center gap-2"
              onClick={() => setModalOpen(true)}
              aria-label={`Participar en ${bar.name}`}
            >
              <Wine className="h-8 w-8 text-accent/30" />
              <span className="text-[10px] text-muted-foreground/50 uppercase tracking-widest">
                Pendiente
              </span>
              {/* Hover: Participar */}
              <div className="absolute inset-0 flex items-end justify-center pb-5 opacity-0 transition-all duration-300 group-hover:bg-foreground/10 group-hover:opacity-100">
                <span className="flex items-center gap-1.5 bg-foreground px-3.5 py-1.5 text-xs font-semibold text-background shadow-lg translate-y-2 transition-transform duration-300 group-hover:translate-y-0" style={{ borderRadius: '5px' }}>
                  Participar
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </button>
          )}
        </div>

        {/* Text below */}
        <div onClick={() => setModalOpen(true)}>
          <div className="pt-3">
            <h3 className="heading-style-h3 uppercase font-medium text-foreground leading-tight group-hover:underline decoration-accent underline-offset-2" style={{ fontFamily: 'var(--font-heading), sans-serif' }}>
              {bar.name}
            </h3>
            <p className="mt-1 flex items-center gap-1.5 text-size-small text-muted-foreground">
              <span>{bar.city}</span>
              <span className="inline-block h-3 w-px bg-accent/50" aria-hidden="true" />
              <span>{bar.category}</span>
            </p>
          </div>
        </div>
      </div>

      <ParticipationModal
        bar={bar}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </>
  )
}
