"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { useParticipations } from "@/lib/use-participations"
import { createClient } from "@/lib/supabase/client"
import {
  Wine,
  Trophy,
  User,
  Settings,
  Compass,
  LogOut,
} from "lucide-react"

import { toast } from "sonner"
import { useEffect, useMemo, useState } from "react"

function SidebarContent() {
  const pathname = usePathname()
  const router = useRouter()
  const { completedCount } = useParticipations()
  const supabase = useMemo(() => createClient(), [])
  const [userLabel, setUserLabel] = useState<string>("")
  const [userEmail, setUserEmail] = useState<string>("")

  useEffect(() => {
    let mounted = true

    async function loadUser() {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      const user = session?.user ?? null

      if (!mounted) return

      setUserEmail(user?.email ?? "")
      const name = (user?.user_metadata?.name as string | undefined) ?? ""
      setUserLabel(name || (user?.email ? user.email.split("@")[0] : "Invitado"))
    }

    loadUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      loadUser()
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [supabase])

  function handleSignOut() {
    // Redirigir al instante sin esperar a Supabase.
    router.push("/login")
    router.refresh()
    // signOut en segundo plano: invalida el token en el servidor.
    supabase.auth.signOut().catch((err) => {
      console.error("Error signing out:", err)
    })
  }

  return (
    <div
      className="flex flex-col h-full text-sidebar-foreground relative bg-primary "
      
    >
      {/* SVG background con opacidad reducida */}
      <div 
        className="absolute inset-0 pointer-events-none bg-primary 
          top-0 left-0 z-0 opacity-20"
        style={{
          backgroundImage: "url('/textura.svg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
      {/* Brand */} 
      <div className="px-5 pt-6 pb-2 z-10">
        <div className="flex items-center mb-6">
          <Image
            src="/logo.png"
            alt="La Ruta Coctelera"
            width={260}
            height={48}
            className="w-auto h-20 object-contain"
            priority
          />
        </div>
      </div>

      {/* User profile */}
      <div className="px-5 pb-5 z-10">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-sidebar-border" style={{ backgroundColor: '#003D6A' }}>
            <User className="h-4 w-4 text-sidebar-foreground" />
          </div>
          <div className="min-w-0">
            <h2 className="heading-style-h3 uppercase font-medium text-white">
              {userLabel}
            </h2>
            <span className="text-size-small text-white" style={{ fontFamily: 'Work Sans, sans-serif' }}>
              {userEmail || "—"}
            </span>
          </div>
        </div>
      </div>

      <div className="mx-5 h-px bg-sidebar-border z-10" />

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 z-10">
        <ul className="space-y-0.5">
          <li>
            <Link
              href="/"
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                pathname === "/"
                  ? "heading-style-h3 uppercase font-medium text-white bg-primary"
                  : "heading-style-h3 uppercase font-medium text-white hover:bg-primary hover:text-white"
              }`}
            >
              <Compass className={`h-4 w-4 ${pathname === "/" ? "text-white  " : ""}`} />
              Explorar
            </Link>
          </li>
          <li>
            <Link
              href="/participaciones"
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                pathname === "/participaciones"
                  ? "heading-style-h3 uppercase font-medium text-white bg-primary"
                  : "heading-style-h3 uppercase font-medium text-white hover:bg-primary hover:text-white"
              }`}
            >
              <Trophy className={`h-4 w-4 ${pathname === "/participaciones" ? "text-white" : ""}`} />
              Participaciones
              <span className="ml-auto font-mono text-[10px] rounded-full px-1.5 py-0.5 font-bold text-white" style={{ backgroundColor: '#003D6A' }}>
                {completedCount}
              </span>
            </Link>
          </li>
          <li>
            <Link
              href="/settings"
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                pathname === "/settings"
                  ? "heading-style-h3 uppercase font-medium text-white bg-primary"
                  : "heading-style-h3 uppercase font-medium text-white hover:bg-primary hover:text-white"
              }`}
            >
              <Settings className={`h-4 w-4 ${pathname === "/settings" ? "text-sidebar-primary" : ""}`} />
              Ajustes
            </Link>
          </li>
        </ul>
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-sidebar-border z-10 flex items-center justify-center">
        <button
          type="button"
          onClick={handleSignOut}
          className="flex w-full items-center gap-2 text-white hover:text-white transition-colors heading-style-h3 uppercase font-medium text-white"
        >
          <LogOut className="size-7 text-white hover:text-white/80 hover:bg-white/10 rounded-full mb-2" />
          Cerrar sesión
        </button>
      </div>
    </div>
  )
}

export function UserSidebar() {
  return (
    <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:border-r lg:border-sidebar-border lg:bg-sidebar">
      <SidebarContent />
    </aside>
  )
}

export { SidebarContent }
