import { BarListing } from "@/components/bar-listing"
import { getBars, getEstados } from "@/lib/queries"

export default async function Home() {
  const [bars, estados] = await Promise.all([getBars(), getEstados()])
  return <BarListing initialBars={bars} estados={estados} />
}
