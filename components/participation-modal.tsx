"use client"

import { useState, useRef, type FormEvent, useEffect } from "react"
import type { Bar, Participation } from "@/lib/types"
import { useParticipations } from "@/lib/use-participations"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Upload, X, CheckCircle2, ImageIcon, Pencil } from "lucide-react"
import { toast } from "sonner"

interface ParticipationModalProps {
  bar: Bar
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ParticipationModal({ bar, open, onOpenChange }: ParticipationModalProps) {
  const { getParticipation, saveParticipation, fetchParticipationPhoto } = useParticipations()
  const existing = getParticipation(bar.id)

  const [isEditing, setIsEditing] = useState(false)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [story, setStory] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})

  const fileInputRef = useRef<HTMLInputElement>(null)
  const showForm = !existing || isEditing

  useEffect(() => {
    if (open && existing?.barId && !existing.photoDataUrl) {
      fetchParticipationPhoto(bar.id)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, existing?.barId])

  useEffect(() => {
    if (existing && !isEditing) {
      setPhotoPreview(existing.photoDataUrl || null)
      setStory(existing.story ?? "")
      setErrors({})
    }
    if (!existing && !isEditing) {
      setPhotoPreview(null)
      setStory("")
      setErrors({})
    }
  }, [existing, isEditing])

  useEffect(() => {
    if (!open) setIsEditing(false)
  }, [open])

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith("image/")) {
      toast.error("Solo se permiten archivos de imagen")
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("La imagen debe ser menor a 5MB")
      return
    }
    const reader = new FileReader()
    reader.onload = (ev) => {
      setPhotoPreview(ev.target?.result as string)
      setErrors((prev) => ({ ...prev, photo: "" }))
    }
    reader.readAsDataURL(file)
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const newErrors: Record<string, string> = {}
    if (!photoPreview) newErrors.photo = "La foto es obligatoria"
    if (!story.trim()) newErrors.story = "La descripcion es obligatoria"
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    const participation: Participation = {
      barId: bar.id,
      photoDataUrl: photoPreview!,
      story: story.trim(),
      createdAt: existing?.createdAt ?? new Date().toISOString(),
    }
    saveParticipation(participation)
    setIsEditing(false)
    toast.success(existing ? "Participacion actualizada" : "¡Participacion guardada!")
    onOpenChange(false)
  }

  const inputClass =
    "bg-white/20 border-white/30 text-white placeholder:text-white/60 focus-visible:ring-white/50 focus-visible:border-white/60"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="p-0 border-0 overflow-hidden bg-primary"
        style={{ maxWidth: "400px" }}
      >
        <DialogTitle className="sr-only">
          {existing ? "Editar participacion" : "Registrar participacion"}
        </DialogTitle>

        <div className="relative z-10 px-6 pt-6 pb-2">
          <p className="text-size-small text-white uppercase tracking-widest mb-1">
            {bar.city}
          </p>
          <h2
            className="heading-style-h2 uppercase font-medium text-white leading-tight"
            style={{ fontFamily: "var(--font-heading), sans-serif" }}
          >
            {bar.name}
          </h2>
        </div>

        <div className="relative z-10 px-6 pb-6 overflow-y-auto max-h-[70vh]">
          {/* Vista de participacion ya guardada */}
          {!showForm && existing ? (
            <div className="space-y-4 pt-2">
              {existing.photoDataUrl && (
                <div className="relative aspect-video h-[400px] w-full overflow-hidden rounded-xl">
                  <img
                    src={existing.photoDataUrl}
                    alt="Foto de participacion"
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              <div>
                <p className="text-size-large text-white leading-relaxed whitespace-pre-wrap">
                  {existing.story}
                </p>
                <p className="text-size-small text-white/80 mt-3">
                  Registrado el{" "}
                  {new Date(existing.createdAt).toLocaleDateString("es-MX", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <button
                onClick={() => setIsEditing(true)}

                className="flex items-center gap-2 py-3 rounded-full text-white text-sm font-semibold px-4 py-2 w-full justify-center transition-opacity hover:opacity-90"
                style={{ backgroundColor: '#003D6A' }}
              >
                <Pencil className="h-3.5 w-3.5" />
                Editar participacion
              </button>
            </div>
          ) : (
            /* Formulario */
            <form onSubmit={handleSubmit} className="space-y-4 pt-2">
              {/* Foto */}
              <div>
                <label className="heading-style-h3 uppercase font-medium text-white/90 mb-2">
                  Foto del coctel
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="sr-only"
                  aria-label="Subir foto"
                />
                {photoPreview ? (
                  <div className="relative overflow-hidden rounded-xl">
                    <div className="relative aspect-video w-full bg-black/20">
                      <img
                        src={photoPreview}
                        alt="Vista previa"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setPhotoPreview(null)
                        if (fileInputRef.current) fileInputRef.current.value = ""
                      }}
                      className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-2 right-2 flex items-center gap-1.5 rounded-lg bg-black/50 px-3 py-1.5 text-xs font-medium text-white hover:bg-black/70 transition-colors"
                    >
                      <Upload className="h-3 w-3" />
                      Cambiar
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex w-full flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-white/40 bg-white/10 py-10 hover:bg-white/20 transition-colors"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/20">
                      <ImageIcon className="h-5 w-5 text-white" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-white">Sube una foto de tu coctel</p>
                      <p className="text-xs text-white/60">JPG, PNG o WEBP (max 5MB)</p>
                    </div>
                  </button>
                )}
                {errors.photo && (
                  <p className="mt-1 text-xs text-white font-medium">{errors.photo}</p>
                )}
              </div>

              {/* Descripcion */}
              <div>
                <label htmlFor="modal-story" className="heading-style-h3 uppercase font-medium text-white/90 mb-2">
                  Historia o anecdota
                </label>
                <Textarea
                  id="modal-story"
                  value={story}
                  onChange={(e) => {
                    setStory(e.target.value)
                    setErrors((prev) => ({ ...prev, story: "" }))
                  }}
                  placeholder="Cuenta tu experiencia en este bar..."
                  rows={4}
                  className={`text-size-large text-white placeholder:text-white/80 focus-visible:ring-white/50 focus-visible:border-white/60`}
                />
                {errors.story && (
                  <p className="mt-1 text-size-medium text-white font-medium">{errors.story}</p>
                )}
              </div>

              {/* Botones */}
              <div className="flex gap-3 pt-1">
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-full text-white font-semibold text-sm px-4 py-2.5 transition-opacity hover:opacity-90"
                  style={{ backgroundColor: '#003D6A' }}
                >
                  <CheckCircle2 className="h-4 w-4" />
                  {existing ? "Guardar cambios" : "Guardar participacion"}
                </button>
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false)
                      setPhotoPreview(existing?.photoDataUrl || null)
                      setStory(existing?.story ?? "")
                      setErrors({})
                    }}
                    className="border border-white/40 text-white text-sm font-medium rounded-lg px-4 py-2.5 hover:bg-white/10 transition-colors"
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
