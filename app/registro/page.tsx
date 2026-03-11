"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { AuthLayout } from "@/components/auth-layout"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff, ArrowRight, ShieldAlert, AlertCircle } from "lucide-react"

function GoogleIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="#1877F2" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  )
}

function AppleIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
    </svg>
  )
}
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"

// ─────────────────────────────────────────────────────────────
// Aquí puedes cambiar el contenido cuando el cliente lo mande
// ─────────────────────────────────────────────────────────────
const TERMINOS_TITULO = "Términos y Condiciones"
const TERMINOS_CONTENIDO = `
Próximamente se publicarán los términos y condiciones completos de La Ruta Coctelera.

Por el momento, al crear una cuenta aceptas que:
• Eres mayor de 18 años.
• Usarás la plataforma de forma responsable.
• La información que registres es verídica.

Si tienes preguntas, escríbenos a soporte@larutacoctelera.com.
`

const PRIVACIDAD_TITULO = "Política de Privacidad"
const PRIVACIDAD_CONTENIDO = `
Próximamente se publicará la política de privacidad completa de La Ruta Coctelera.

Por el momento, al crear una cuenta aceptas que:
• Tus datos serán utilizados únicamente para el funcionamiento de la plataforma.
• No compartiremos tu información con terceros sin tu consentimiento.
• Puedes solicitar la eliminación de tu cuenta en cualquier momento.

Si tienes preguntas, escríbenos a soporte@larutacoctelera.com.
`
// ─────────────────────────────────────────────────────────────

function calcularEdad(fechaNacimiento: string): number {
  const hoy = new Date()
  const nacimiento = new Date(fechaNacimiento)
  let edad = hoy.getFullYear() - nacimiento.getFullYear()
  const mes = hoy.getMonth() - nacimiento.getMonth()
  if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--
  }
  return edad
}

export default function RegistroPage() {
  const router = useRouter()
  const supabase = createClient()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [birthdate, setBirthdate] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [loading, setLoading] = useState(false)
  const [socialLoading, setSocialLoading] = useState<"google" | "facebook" | "apple" | null>(null)
  const [modalOpen, setModalOpen] = useState<"terminos" | "privacidad" | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  async function handleSocialLogin(provider: "google" | "facebook" | "apple") {
    setSocialLoading(provider)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) {
        toast.error("No se pudo continuar con " + provider)
      }
    } catch {
      toast.error("Ocurrió un error. Intenta de nuevo.")
    } finally {
      setSocialLoading(null)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrorMessage(null)

    if (!name || !email || !birthdate || !password || !confirmPassword) {
      setErrorMessage("Completa todos los campos")
      return
    }
    if (calcularEdad(birthdate) < 18) {
      setErrorMessage("Debes ser mayor de 18 años para registrarte")
      return
    }
    if (password !== confirmPassword) {
      setErrorMessage("Las contraseñas no coinciden")
      return
    }
    if (password.length < 8) {
      setErrorMessage("La contraseña debe tener al menos 8 caracteres")
      return
    }
    if (!/[A-Z]/.test(password)) {
      setErrorMessage("La contraseña debe tener al menos una letra mayúscula")
      return
    }
    if (!/[0-9]/.test(password)) {
      setErrorMessage("La contraseña debe tener al menos un número")
      return
    }
    if (!acceptTerms) {
      setErrorMessage("Debes aceptar los términos y condiciones")
      return
    }

    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/`,
          data: {
            name,
            birthdate,
          },
        },
      })

      if (error) {
        console.error("Error al crear cuenta:", error)
        setErrorMessage(error.message)
        return
      }

      if (data.session) {
        toast.success("Cuenta creada, bienvenido")
        router.push("/")
      } else {
        toast.success("¡Revisa tu correo para confirmar tu cuenta!", {
          description: "Si no ves el email, consulta tu bandeja de spam.",
          duration: Infinity,
          style: {
            background: "#16a34a",
            color: "#ffffff",
            border: "none",
            fontSize: "0.95rem",
            
          },
          descriptionClassName: "!text-white/90",
        })
        router.push("/login")
      }
    } catch (err) {
      console.error("Error inesperado al registrar usuario:", err)
      setErrorMessage("Ocurrió un error al crear la cuenta. Intenta de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Crear cuenta"
      subtitle="Únete a Cointreau y comienza tu recorrido"
    >
      {/* Aviso 18+ */}
      <div className="mb-5 flex items-start gap-2.5 rounded-lg px-3.5 py-3" style={{ backgroundColor: '#E84922', borderRadius: '6px' }}>
        <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-white" />
        <p className="text-xs text-white leading-relaxed">
          Esta plataforma es exclusivamente para personas <span className="font-semibold">mayores de 18 años</span>.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name" className="text-sm font-medium" style={{ color: '#003D6A' }}>
            Nombre
          </Label>
          <Input
            id="name"
            type="text"
            placeholder="Tu nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1.5 h-10 border-border focus-visible:ring-accent/40"
            autoComplete="name"
          />
        </div>

        <div>
          <Label htmlFor="email" className="text-sm font-medium" style={{ color: '#003D6A' }}>
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

        <div>
          <Label htmlFor="birthdate" className="text-sm font-medium" style={{ color: '#003D6A' }}>
            Fecha de nacimiento
          </Label>
          <Input
            id="birthdate"
            type="date"
            value={birthdate}
            onChange={(e) => setBirthdate(e.target.value)}
            max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split("T")[0]}
            className="mt-1.5 h-10 border-border focus-visible:ring-accent/40"
          />
        </div>

        <div>
          <Label htmlFor="password" className="text-sm font-medium" style={{ color: '#003D6A' }}>
            Contraseña
          </Label>
          <div className="relative mt-1.5">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Mínimo 8 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-10 pr-10 border-border focus-visible:ring-accent/40"
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label={showPassword ? "Ocultar" : "Mostrar"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <p className="mt-1.5 text-xs text-muted-foreground">
            Minimo 8 caracteres, una mayuscula y un numero
          </p>
        </div>

        <div>
          <Label htmlFor="confirm" className="text-sm font-medium" style={{ color: '#003D6A' }}>
            Confirmar contraseña
          </Label>
          <div className="relative mt-1.5">
            <Input
              id="confirm"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Repite tu contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="h-10 pr-10 border-border focus-visible:ring-accent/40"
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label={showConfirmPassword ? "Ocultar" : "Mostrar"}
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Términos y condiciones */}
        <div className="flex items-start gap-2.5 pt-1">
          <input
            id="terms"
            type="checkbox"
            checked={acceptTerms}
            onChange={(e) => setAcceptTerms(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-foreground"
          />
          <label htmlFor="terms" className="text-xs text-foreground leading-relaxed cursor-pointer">
            He leído y acepto los{" "}
            <button
              type="button"
              onClick={() => setModalOpen("terminos")}
              className="underline underline-offset-2 hover:text-accent transition-colors"
            >
              términos y condiciones
            </button>
            {" "}y la{" "}
            <button
              type="button"
              onClick={() => setModalOpen("privacidad")}
              className="border-b border-foreground underline underline-offset-2 hover:text-accent transition-colors"
            >
              política de privacidad
            </button>
          </label>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full h-10 font-medium text-white hover:opacity-90"
          style={{ backgroundColor: '#003D6A' }}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-background/30 border-t-background" />
              Creando cuenta...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              Crear cuenta
              <ArrowRight className="h-4 w-4" />
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

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-background px-3 text-xs text-muted-foreground">
            o continuar con
          </span>
        </div>
      </div>

      {/* Social login buttons */}
      <div className="flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => handleSocialLogin("google")}
          disabled={socialLoading !== null}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background hover:bg-muted transition-colors disabled:opacity-50"
          aria-label="Registrarse con Google"
        >
          {socialLoading === "google" ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-muted-foreground" />
          ) : (
            <GoogleIcon />
          )}
        </button>
        
        {/*
        <button
          type="button"
          onClick={() => handleSocialLogin("facebook")}
          disabled={socialLoading !== null}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background hover:bg-muted transition-colors disabled:opacity-50"
          aria-label="Registrarse con Facebook"
        >
          {socialLoading === "facebook" ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-muted-foreground" />
          ) : (
            <FacebookIcon />
          )}
        </button>
        <button
          type="button"
          onClick={() => handleSocialLogin("apple")}
          disabled={socialLoading !== null}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background hover:bg-muted transition-colors disabled:opacity-50"
          aria-label="Registrarse con Apple"
        >
          {socialLoading === "apple" ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-muted-foreground" />
          ) : (
            <AppleIcon />
          )}
        </button>
        */}
      </div>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        {"¿Ya tienes cuenta? "}
        <Link
          href="/login"
          className="text-foreground font-medium hover:text-accent transition-colors"
        >
          Iniciar sesión
        </Link>
      </p>

      {/* Modal términos / privacidad */}
      <Dialog open={modalOpen !== null} onOpenChange={(open) => !open && setModalOpen(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {modalOpen === "terminos" ? TERMINOS_TITULO : PRIVACIDAD_TITULO}
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] pr-4">
            <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
              {modalOpen === "terminos" ? TERMINOS_CONTENIDO : PRIVACIDAD_CONTENIDO}
            </p>
          </ScrollArea>
          <Button
            onClick={() => setModalOpen(null)}
            className="w-full mt-2 bg-foreground text-background hover:bg-foreground/90"
          >
            Entendido
          </Button>
        </DialogContent>
      </Dialog>
    </AuthLayout>
  )
}

