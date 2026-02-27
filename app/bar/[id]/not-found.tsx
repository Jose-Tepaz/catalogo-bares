import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Wine } from "lucide-react"

export default function BarNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
        <Wine className="h-10 w-10 text-muted-foreground" />
      </div>
      <h1 className="mb-2 text-2xl font-bold text-foreground">
        Bar no encontrado
      </h1>
      <p className="mb-6 text-sm text-muted-foreground">
        El bar que buscas no existe o fue removido.
      </p>
      <Link href="/">
        <Button variant="default" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Volver al listado
        </Button>
      </Link>
    </div>
  )
}
