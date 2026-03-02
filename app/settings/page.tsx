"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { UserSidebar } from "@/components/user-sidebar"
import { MobileSidebar } from "@/components/mobile-sidebar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"
import {
  Menu,
  User,
  Camera,
  Bell,
  LogOut,
  Save,
  Lock,
} from "lucide-react"
import { useEffect } from "react"

export default function SettingsPage() {
  const router = useRouter()
  const supabase = createClient()

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [birthdate, setBirthdate] = useState("")
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [notifications, setNotifications] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isPasswordRecovery, setIsPasswordRecovery] = useState(false)
  const [newPassword, setNewPassword] = useState("")
  const [confirmNewPassword, setConfirmNewPassword] = useState("")
  const [savingPassword, setSavingPassword] = useState(false)

  useEffect(() => {
    let mounted = true

    async function loadUser() {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      const user = session?.user ?? null
      if (!mounted) return

      setEmail(user?.email ?? "")
      const metaName = (user?.user_metadata?.name as string | undefined) ?? ""
      setName(metaName || (user?.email ? user.email.split("@")[0] : ""))
      setBirthdate((user?.user_metadata?.birthdate as string | undefined) ?? "")
    }

    loadUser()
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setIsPasswordRecovery(true)
      }
      loadUser()
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [supabase])

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => setAvatarPreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  async function handleSave() {
    setSaving(true)
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      const user = session?.user
      if (!user) {
        toast.error("No hay usuario autenticado")
        return
      }

      const { error } = await supabase.auth.updateUser({
        data: {
          name,
          birthdate,
        },
      })

      if (error) {
        console.error("Error al guardar ajustes:", error)
        toast.error(error.message)
        return
      }

      toast.success("Cambios guardados")
    } finally {
      setSaving(false)
    }
  }

  async function handleSavePassword() {
    if (!newPassword || !confirmNewPassword) {
      toast.error("Completa ambos campos de contraseña")
      return
    }
    if (newPassword !== confirmNewPassword) {
      toast.error("Las contraseñas no coinciden")
      return
    }
    if (newPassword.length < 8) {
      toast.error("La contraseña debe tener al menos 8 caracteres")
      return
    }
    if (!/[A-Z]/.test(newPassword)) {
      toast.error("La contraseña debe tener al menos una mayuscula")
      return
    }
    if (!/[0-9]/.test(newPassword)) {
      toast.error("La contraseña debe tener al menos un numero")
      return
    }
    setSavingPassword(true)
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword })
      if (error) {
        toast.error(error.message)
        return
      }
      toast.success("Contraseña actualizada correctamente")
      setNewPassword("")
      setConfirmNewPassword("")
      setIsPasswordRecovery(false)
      router.push("/")
    } finally {
      setSavingPassword(false)
    }
  }

  function handleLogout() {
    router.push("/login")
    router.refresh()
    supabase.auth.signOut().catch((err) => {
      console.error("Error signing out:", err)
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <UserSidebar />
      <MobileSidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />

      <div className="lg:pl-64">
        {/* Mobile header */}
        <header className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur-sm lg:hidden">
          <div className="flex items-center gap-3 px-4 py-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(true)}
              className="text-foreground"
              aria-label="Abrir menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-base font-semibold text-foreground">Ajustes</h1>
          </div>
        </header>

        <main className="mx-auto max-w-xl px-6 py-10">
          <h1 className="hidden lg:block text-xl font-bold text-foreground mb-1">
            Ajustes
          </h1>
          <p className="hidden lg:block text-sm text-muted-foreground mb-8">
            Administra tu perfil y preferencias
          </p>

          {/* Profile section */}
          <div className="space-y-6">
            <div>
              <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <User className="h-4 w-4 text-accent" />
                Perfil
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Tu informacion personal
              </p>
            </div>

            {/* Avatar */}
            <div className="flex items-center gap-5">
              <div className="relative group">
                <div className="h-16 w-16 rounded-full bg-muted border border-border flex items-center justify-center overflow-hidden">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Avatar"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <User className="h-7 w-7 text-muted-foreground" />
                  )}
                </div>
                <label
                  htmlFor="avatar-upload"
                  className="absolute inset-0 flex items-center justify-center rounded-full bg-foreground/0 opacity-0 group-hover:bg-foreground/40 group-hover:opacity-100 transition-all cursor-pointer"
                >
                  <Camera className="h-5 w-5 text-background" />
                </label>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  {name || "Tu nombre"}
                </p>
                <p className="text-xs text-muted-foreground">
                  Haz click en la foto para cambiarla
                </p>
              </div>
            </div>

            {/* Name */}
            <div>
              <Label htmlFor="name" className="text-sm font-medium text-foreground">
                Nombre
              </Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1.5 h-10 border-border focus-visible:ring-accent/40"
              />
            </div>

            {/* Email (readonly) */}
            <div>
              <Label htmlFor="email" className="text-sm font-medium text-foreground">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                readOnly
                className="mt-1.5 h-10 border-border bg-muted text-muted-foreground cursor-not-allowed"
              />
              <p className="mt-1 text-[11px] text-muted-foreground">
                El email no se puede cambiar
              </p>
            </div>

            {/* Birthdate */}
            <div>
              <Label htmlFor="birthdate" className="text-sm font-medium text-foreground">
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
              <p className="mt-1 text-[11px] text-muted-foreground">
                Debes ser mayor de 18 años
              </p>
            </div>
          </div>

          <Separator className="my-8" />

          {/* Password section */}
          <div className="space-y-5">
            <div>
              <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Lock className="h-4 w-4 text-accent" />
                {isPasswordRecovery ? "Crea tu nueva contraseña" : "Cambiar contraseña"}
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                {isPasswordRecovery
                  ? "Ingresa tu nueva contraseña para recuperar tu cuenta"
                  : "Minimo 8 caracteres, una mayuscula y un numero"}
              </p>
            </div>
            <div>
              <Label htmlFor="new-password" className="text-sm font-medium text-foreground">
                Nueva contraseña
              </Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Nueva contraseña"
                className="mt-1.5 h-10 border-border focus-visible:ring-accent/40"
              />
            </div>
            <div>
              <Label htmlFor="confirm-new-password" className="text-sm font-medium text-foreground">
                Confirmar nueva contraseña
              </Label>
              <Input
                id="confirm-new-password"
                type="password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                placeholder="Repite tu nueva contraseña"
                className="mt-1.5 h-10 border-border focus-visible:ring-accent/40"
              />
            </div>
            <Button
              onClick={handleSavePassword}
              disabled={savingPassword || !newPassword || !confirmNewPassword}
              className="w-full h-10 bg-accent text-white hover:bg-accent/90 font-medium"
            >
              {savingPassword ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Guardando...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Guardar nueva contraseña
                </span>
              )}
            </Button>
          </div>

          <Separator className="my-8" />

          {/* Notifications */}
          <div className="space-y-5">
            <div>
              <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Bell className="h-4 w-4 text-accent" />
                Notificaciones
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Controla tus alertas y avisos
              </p>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
              <div>
                <p className="text-sm font-medium text-foreground">
                  Nuevos bares y eventos
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Recibe avisos cuando se agreguen bares a la ruta
                </p>
              </div>
              <Switch
                checked={notifications}
                onCheckedChange={setNotifications}
                className="data-[state=checked]:bg-accent"
              />
            </div>
          </div>

          <Separator className="my-8" />

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <Button
              onClick={handleSave}
              disabled={saving}
              className="h-10 bg-foreground text-background hover:bg-foreground/90 font-medium"
            >
              {saving ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-background/30 border-t-background" />
                  Guardando...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  Guardar cambios
                </span>
              )}
            </Button>

            <Button
              variant="ghost"
              onClick={handleLogout}
              className="h-10 text-destructive hover:text-destructive hover:bg-destructive/10 font-medium"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Cerrar sesion
            </Button>
          </div>
        </main>
      </div>
    </div>
  )
}

