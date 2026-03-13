import { BarListing } from "@/components/bar-listing"
import { getBars, getEstados, getCiudades } from "@/lib/queries"

export default async function Home() {
  const [bars, estados, ciudades] = await Promise.all([getBars(), getEstados(), getCiudades()])
  return <BarListing initialBars={bars} estados={estados} ciudades={ciudades} />
}
