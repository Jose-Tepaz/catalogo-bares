import { Wine } from "lucide-react"
import Link from "next/link"

interface AuthLayoutProps {
  children: React.ReactNode
  title: string
  subtitle: string
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen">
      {/* Left panel - black with gold branding */}
      <div className="hidden lg:flex lg:w-[420px] lg:flex-col lg:justify-between bg-sidebar p-10">
        <Link href="/" className="flex items-center gap-2.5">
          <Wine className="h-5 w-5 text-sidebar-primary" />
          <span className="text-sm font-bold tracking-wide uppercase text-sidebar-primary">
            La Ruta Coctelera
          </span>
        </Link>

        <div>
          <p className="text-2xl font-bold text-sidebar-foreground leading-snug text-balance">
            Descubre los mejores bares de Mexico
          </p>
          <p className="mt-3 text-sm text-sidebar-foreground/50 leading-relaxed">
            Visita, participa y registra tu experiencia en una ruta unica de cocteles.
          </p>
        </div>

        <p className="text-[11px] text-sidebar-foreground/30">
          La Ruta Coctelera 2026
        </p>
      </div>

      {/* Right panel - form */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 bg-background">
        <div className="lg:hidden mb-10">
          <Link href="/" className="flex items-center gap-2">
            <Wine className="h-5 w-5 text-accent" />
            <span className="text-sm font-bold tracking-wide uppercase text-foreground">
              La Ruta Coctelera
            </span>
          </Link>
        </div>

        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground tracking-tight">{title}</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}

