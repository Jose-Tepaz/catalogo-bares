"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { AuthLayout } from "@/components/auth-layout"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff, ArrowRight, ShieldAlert, AlertCircle } from "lucide-react"
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
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState<"terminos" | "privacidad" | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

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
        toast.success("Cuenta creada. Revisa tu correo para confirmar.")
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
          <Input
            id="confirm"
            type="password"
            placeholder="Repite tu contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mt-1.5 h-10 border-border focus-visible:ring-accent/40"
            autoComplete="new-password"
          />
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

