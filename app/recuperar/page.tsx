"use client"

import { useState } from "react"
import Link from "next/link"
import { AuthLayout } from "@/components/auth-layout"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Send, Mail, AlertCircle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export default function RecuperarPage() {
  const [email, setEmail] = useState("")
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setErrorMessage(null)
    setLoading(true)
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/nueva-contrasena`,
      })
      if (error) {
        setErrorMessage("No se pudo enviar el correo. Intenta de nuevo.")
        return
      }
      setSent(true)
    } catch {
      setErrorMessage("Ocurrio un error. Intenta de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <AuthLayout
        title="Revisa tu correo"
        subtitle="Te enviamos un enlace para restablecer tu contrasena"
      >
        <div className="flex flex-col items-center text-center py-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/10 mb-5">
            <Mail className="h-6 w-6 text-accent" />
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
            Si existe una cuenta con{" "}
            <span className="font-medium text-foreground">{email}</span>, recibiras
            un enlace para crear una nueva contrasena.
          </p>
        </div>

        <Link href="/login">
          <Button
            variant="outline"
            className="w-full h-10 mt-4 border-border hover:bg-muted"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al login
          </Button>
        </Link>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      title="Recuperar contrasena"
      subtitle="Ingresa tu email y te enviaremos un enlace"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <Label htmlFor="email" className="text-sm font-medium text-foreground">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="tu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1.5 h-10 border-border focus-visible:ring-accent/40"
            autoComplete="email"
          />
        </div>

        <Button
          type="submit"
          disabled={loading || !email}
          className="w-full h-10 bg-foreground text-background hover:bg-foreground/90 font-medium"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-background/30 border-t-background" />
              Enviando...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              Enviar enlace
              <Send className="h-4 w-4" />
            </span>
          )}
        </Button>

        {errorMessage && (
          <div className="flex items-start gap-2 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2.5 text-sm text-destructive">
            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
      </form>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        <Link
          href="/login"
          className="text-foreground font-medium hover:text-accent transition-colors inline-flex items-center gap-1.5"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Volver al login
        </Link>
      </p>
    </AuthLayout>
  )
}

