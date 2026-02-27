import { createClient } from "@/lib/supabase/server"
import type { Bar, Estado, BarCategory } from "@/lib/types"

export async function getBars(): Promise<Bar[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("bars")
    .select("*")
    .order("name")

  if (error) {
    console.error("Error fetching bars:", error)
    return []
  }

  return (data ?? []).map((bar) => ({
    id: bar.id,
    name: bar.name,
    city: bar.city,
    address: bar.address,
    category: bar.category as BarCategory,
    imageUrl: bar.image_url ?? null,
    state_id: bar.state_id ?? null,
  }))
}

export async function getBarById(id: string): Promise<Bar | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("bars")
    .select("*")
    .eq("id", id)
    .single()

  if (error || !data) return null

  return {
    id: data.id,
    name: data.name,
    city: data.city,
    address: data.address,
    category: data.category as BarCategory,
    imageUrl: data.image_url ?? null,
    state_id: data.state_id ?? null,
  }
}

export async function getEstados(): Promise<Estado[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("estados")
    .select("*")
    .order("name")

  if (error) {
    console.error("Error fetching estados:", error)
    return []
  }

  return data ?? []
}
