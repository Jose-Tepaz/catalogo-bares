import Image from "next/image"
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
      <div className="hidden lg:flex lg:w-[420px] lg:flex-col lg:justify-between bg-sidebar p-10 relative overflow-hidden">
        {/* SVG background con opacidad reducida */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "url('/sidebar-bg.svg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            opacity: 0.15,
          }}
        />
        <Link href="/" className="relative z-10">
          <Image src="/logo.svg" alt="Cointreau" width={140} height={40} className="h-10 w-auto object-contain" />
        </Link>

        <div className="relative z-10">
          <p className="text-4xl font-bold leading-tight text-balance" style={{ fontFamily: 'var(--font-heading), sans-serif' }}>
            <span className="text-white">Descubre </span>
            <span style={{ color: '#003D6A' }}>los mejores bares de </span>
            <span className="text-white">Mexico</span>
          </p>
          <p className="mt-4 text-sm text-sidebar-foreground/70 leading-relaxed">
            Registra tus visitas, comparte tus experiencias y completa tu ruta por los bares mas emblematicos del pais.
          </p>
        </div>

        <p className="relative z-10 text-[11px] font-bold tracking-widest uppercase text-white/40" style={{ fontFamily: 'var(--font-heading), sans-serif' }}>
          Cointreau 2026
        </p>
      </div>

      {/* Right panel - form */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 bg-background">
        <div className="lg:hidden mb-10">
          <Link href="/">
            <Image src="/logo.svg" alt="Cointreau" width={120} height={36} className="h-9 w-auto object-contain" />
          </Link>
        </div>

        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground tracking-tight" style={{ fontFamily: 'var(--font-heading), sans-serif' }}>{title}</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}

