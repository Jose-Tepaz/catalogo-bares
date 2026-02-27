import { notFound } from "next/navigation"
import { getBarById } from "@/lib/queries"
import { BarDetailClient } from "@/components/bar-detail-client"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function BarDetailPage({ params }: PageProps) {
  const { id } = await params
  const bar = await getBarById(id)

  if (!bar) {
    notFound()
  }

  return <BarDetailClient bar={bar} />
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params
  const bar = await getBarById(id)
  return {
    title: bar
      ? `${bar.name} - Pasaporte Coctelero`
      : "Bar no encontrado",
    description: bar
      ? `Visita ${bar.name} en ${bar.city}. ${bar.address}`
      : "Bar no encontrado",
  }
}
