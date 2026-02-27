"use client"

import { useState, useRef, type FormEvent, useEffect } from "react"
import type { Bar, Participation } from "@/lib/types"
import { useParticipations } from "@/lib/use-participations"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Camera,
  Upload,
  X,
  Pencil,
  CheckCircle2,
  ImageIcon,
} from "lucide-react"
import { toast } from "sonner"

interface ParticipationSectionProps {
  bar: Bar
}

export function ParticipationSection({ bar }: ParticipationSectionProps) {
  const { getParticipation, saveParticipation, fetchParticipationPhoto, loading } = useParticipations()
  const existing = getParticipation(bar.id)

  const [isEditing, setIsEditing] = useState(false)
  const [photoPreview, setPhotoPreview] = useState<string | null>(
    existing?.photoDataUrl || null
  )
  const [title, setTitle] = useState(existing?.title ?? "")
  const [story, setStory] = useState(existing?.story ?? "")
  const [errors, setErrors] = useState<Record<string, string>>({})

  const fileInputRef = useRef<HTMLInputElement>(null)

  const showForm = !existing || isEditing

  // Cargar la foto bajo demanda cuando la participación existe pero la foto
  // aún no se ha cargado (se omite en la consulta de lista para evitar timeouts).
  useEffect(() => {
    if (existing?.barId && !existing.photoDataUrl) {
      fetchParticipationPhoto(bar.id)
    }
  // Solo re-ejecutar cuando cambia el barId (no cuando cambian otros deps)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existing?.barId])

  // Mantener el formulario sincronizado con la participación existente cuando
  // se carga desde Supabase o se actualiza.
  useEffect(() => {
    if (existing && !isEditing) {
      setPhotoPreview(existing.photoDataUrl || null)
      setTitle(existing.title ?? "")
      setStory(existing.story ?? "")
      setErrors({})
    }

    if (!existing && !isEditing) {
      setPhotoPreview(null)
      setTitle("")
      setStory("")
      setErrors({})
    }
  }, [existing, isEditing])

  // Mientras estamos cargando desde Supabase y aún no hay participación,
  // mostramos un estado de carga en lugar de un formulario vacío.
  if (loading && !existing) {
    return (
      <div className="space-y-3">
        <div className="h-4 w-40 rounded bg-muted animate-pulse" />
        <div className="h-32 w-full rounded-xl bg-muted animate-pulse" />
      </div>
    )
  }

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
    if (!title.trim()) newErrors.title = "El titulo es obligatorio"
    if (!story.trim()) newErrors.story = "La historia es obligatoria"

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    const participation: Participation = {
      barId: bar.id,
      photoDataUrl: photoPreview!,
      title: title.trim(),
      story: story.trim(),
      createdAt: existing?.createdAt ?? new Date().toISOString(),
    }

    saveParticipation(participation)
    setIsEditing(false)
    toast.success(
      existing ? "Participacion actualizada" : "Participacion guardada"
    )
  }

  if (!showForm && existing) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-success" />
            <h3 className="text-lg font-bold text-foreground">
              Mi Participacion
            </h3>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => setIsEditing(true)}
          >
            <Pencil className="h-3.5 w-3.5" />
            Editar
          </Button>
        </div>

        <div className="overflow-hidden rounded-xl border border-border">
          {existing.photoDataUrl && (
            <div className="relative aspect-video w-full overflow-hidden bg-muted">
              <img
                src={existing.photoDataUrl}
                alt={existing.title}
                className="h-full w-full object-cover"
              />
            </div>
          )}
          <div className="p-5">
            <h4 className="text-xl font-bold text-foreground mb-2">
              {existing.title}
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {existing.story}
            </p>
            <p className="mt-4 text-xs text-muted-foreground">
              Registrado el{" "}
              {new Date(existing.createdAt).toLocaleDateString("es-MX", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Camera className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-bold text-foreground">
          {existing ? "Editar Participacion" : "Registra tu Participacion"}
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <Label className="mb-2 block text-sm font-medium">
            Foto del coctel
          </Label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="sr-only"
            aria-label="Subir foto del coctel"
          />

          {photoPreview ? (
            <div className="relative overflow-hidden rounded-xl border border-border">
              <div className="relative aspect-video w-full bg-muted">
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
                className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 text-foreground hover:bg-background transition-colors"
                aria-label="Eliminar foto"
              >
                <X className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-2 right-2 flex items-center gap-1.5 rounded-lg bg-background/80 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-background transition-colors"
              >
                <Upload className="h-3 w-3" />
                Cambiar
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex w-full flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border bg-muted/50 py-12 transition-colors hover:border-primary/40 hover:bg-muted"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
                <ImageIcon className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-foreground">
                  Sube una foto de tu coctel
                </p>
                <p className="text-xs text-muted-foreground">
                  JPG, PNG o WEBP (max 5MB)
                </p>
              </div>
            </button>
          )}
          {errors.photo && (
            <p className="mt-1 text-xs text-destructive">{errors.photo}</p>
          )}
        </div>

        <div>
          <Label htmlFor="title" className="mb-2 block text-sm font-medium">
            Titulo de tu participacion
          </Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value)
              setErrors((prev) => ({ ...prev, title: "" }))
            }}
            placeholder="Ej: El mejor Negroni de mi vida"
            className="border-border placeholder:text-muted-foreground"
          />
          {errors.title && (
            <p className="mt-1 text-xs text-destructive">{errors.title}</p>
          )}
        </div>

        <div>
          <Label htmlFor="story" className="mb-2 block text-sm font-medium">
            Historia o anecdota
          </Label>
          <Textarea
            id="story"
            value={story}
            onChange={(e) => {
              setStory(e.target.value)
              setErrors((prev) => ({ ...prev, story: "" }))
            }}
            placeholder="Cuenta tu experiencia en este bar..."
            rows={5}
            className="border-border placeholder:text-muted-foreground resize-none"
          />
          {errors.story && (
            <p className="mt-1 text-xs text-destructive">{errors.story}</p>
          )}
        </div>

        <div className="flex gap-3">
          <Button type="submit" className="flex-1 gap-2">
            <CheckCircle2 className="h-4 w-4" />
            {existing ? "Guardar cambios" : "Guardar participacion"}
          </Button>
          {isEditing && (
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsEditing(false)
                setPhotoPreview(existing?.photoDataUrl || null)
                setTitle(existing?.title ?? "")
                setStory(existing?.story ?? "")
                setErrors({})
              }}
            >
              Cancelar
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}
