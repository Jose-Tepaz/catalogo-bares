"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AuthLayout } from "@/components/auth-layout"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff, Lock, AlertCircle } from "lucide-react"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"

export default function NuevaContrasenaPage() {
  const router = useRouter()
  const supabase = createClient()

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrorMessage(null)

    if (!password || !confirmPassword) {
      setErrorMessage("Completa todos los campos")
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
      setErrorMessage("La contraseña debe tener al menos una mayuscula")
      return
    }
    if (!/[0-9]/.test(password)) {
      setErrorMessage("La contraseña debe tener al menos un numero")
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({ password })
      if (error) {
        setErrorMessage("No se pudo actualizar la contraseña. El enlace puede haber expirado.")
        return
      }
      toast.success("Contraseña actualizada correctamente")
      router.push("/")
    } catch {
      setErrorMessage("Ocurrio un error. Intenta de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Nueva contraseña"
      subtitle="Crea una contraseña segura para tu cuenta"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <Label htmlFor="password" className="text-sm font-medium text-foreground">
            Nueva contraseña
          </Label>
          <div className="relative mt-1.5">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Minimo 8 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-10 pr-10 border-border focus-visible:ring-accent/40"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <p className="mt-1.5 text-xs text-muted-foreground">
            Minimo 8 caracteres, una mayuscula y un numero
          </p>
        </div>

        <div>
          <Label htmlFor="confirm" className="text-sm font-medium text-foreground">
            Confirmar contraseña
          </Label>
          <Input
            id="confirm"
            type="password"
            placeholder="Repite tu contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mt-1.5 h-10 border-border focus-visible:ring-accent/40"
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full h-10 bg-foreground text-background hover:bg-foreground/90 font-medium"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-background/30 border-t-background" />
              Guardando...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Guardar nueva contraseña
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
    </AuthLayout>
  )
}
