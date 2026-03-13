export type BarCategory =
  | "Rooftop"
  | "Speakeasy"
  | "Bar de cocteles"
  | "Cantina"
  | "Mezcaleria"
  | "Tequileria"
  | "Wine Bar"
  | "Cerveceria artesanal"

export type ParticipationStatus = "pendiente" | "completado"

export interface Bar {
  id: string
  name: string
  city: string
  address: string
  category: BarCategory
  imageUrl: string | null
  state_id: string | null
  city_id: string | null
  google_maps_url: string | null
}

export interface Estado {
  id: string
  name: string
  slug: string
}

export interface Ciudad {
  id: string
  name: string
  slug: string
  state_id: string | null
}

export interface Participation {
  barId: string
  photoDataUrl: string
  title?: string
  story: string
  createdAt: string
}
