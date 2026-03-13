"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { X } from "lucide-react"

interface WelcomeModalProps {
  userName: string
}

const STORAGE_KEY = "welcome_modal_count"
const MAX_SHOWS = 4

export function WelcomeModal({ userName }: WelcomeModalProps) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const count = parseInt(localStorage.getItem(STORAGE_KEY) ?? "0", 10)
    if (count < MAX_SHOWS) {
      localStorage.setItem(STORAGE_KEY, String(count + 1))
      setOpen(true)
    }
  }, [])

  function handleClose() {
    setOpen(false)
  }

  const steps = [
    {
      number: "1",
      text: "Pide un cóctel y captúralo en una foto",
    },
    {
      number: "2",
      text: (
        <>
          Ingresa a la página oficial{" "}
          <span className="font-semibold">www.sepronunciacuan-tro.com.mx</span>{" "}
          o escanea el QR Code
        </>
      ),
    },
    {
      number: "3",
      text: (
        <>
          Sube tu foto y agrega una descripción de un momento o experiencia
          donde la <span className="font-semibold">&ldquo;Naranja&rdquo;</span>{" "}
          haya sido parte de tu vida
        </>
      ),
    },
    {
      number: "4",
      text: (
        <>
          Comparte en tus redes sociales{" "}
          <span className="font-semibold">#YOSISECOMOSEPRONUNCIACUANTRO</span>
        </>
      ),
    },
  ]

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className="p-0 border-0 overflow-hidden bg-foreground"
        style={{ maxWidth: "560px", width: "90%" }}
      >
        <DialogTitle className="sr-only">Bienvenido</DialogTitle>

      

        {/* Botón cerrar */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
          aria-label="Cerrar"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Contenido */}
        <div className="relative z-10 px-8 pt-10 pb-10">
          {/* Título */}
          <div className="mb-8 text-center">
            <h1
              className="text-4xl font-black uppercase text-white leading-tight tracking-wide"
              style={{ fontFamily: "var(--font-heading), sans-serif" }}
            >
              Hola {userName || ""}
            </h1>
            <p
              className="mt-2 text-lg font-bold uppercase tracking-widest"
              style={{ color: "#F26322" }}
            >
              Comienza tu recorrido
            </p>
          </div>

          {/* Pasos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {steps.map((step) => (
              <div key={step.number} className="flex items-start gap-3">
                <span
                  className="shrink-0 heading-style-h1 uppercase  font-black leading-none"
                  style={{
                    color: "#F26322",
                    fontFamily: "var(--font-heading), sans-serif",
                  }}
                >
                  {step.number}
                </span>
                <p className="text-size-medium text-white/90 leading-snug pt-1">
                  {step.text}
                </p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <button
            onClick={handleClose}
            className="mt-8 w-full bg-primary rounded-full py-3 text-size-medium font-bold uppercase tracking-wider text-white transition-opacity hover:opacity-90"
            
          >
            ¡Empezar!
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
