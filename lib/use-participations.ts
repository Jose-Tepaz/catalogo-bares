"use client"

import type { Participation } from "./types"
import { useCallback, useEffect, useMemo, useState } from "react"
import { createClient } from "./supabase/client"
import type { Database } from "./database.types"

type ParticipationRow = Database["public"]["Tables"]["participations"]["Row"]
type PartialParticipationRow = Pick<
  ParticipationRow,
  "bar_id" | "title" | "story" | "created_at"
> & { photo_data_url?: string | null }

// Cache simple en memoria para que, al navegar entre páginas,
// las participaciones aparezcan al instante sin esperar otra
// llamada a Supabase.
let cachedParticipations: Record<string, Participation> = {}
let cachedUserId: string | null = null
let hasLoadedOnce = false

// Listeners para que todas las instancias del hook se sincronicen
// cuando el cache cambia (por ejemplo, después de guardar o editar).
const listeners = new Set<() => void>()
function emitChange() {
  listeners.forEach((l) => l())
}

// Helper para convertir de ParticipationRow a Participation
function rowToParticipation(row: PartialParticipationRow): Participation {
  return {
    barId: row.bar_id,
    photoDataUrl: row.photo_data_url || "",
    title: row.title || "",
    story: row.story || "",
    createdAt: row.created_at,
  }
}

export function useParticipations() {
  const [participations, setParticipations] = useState<
    Record<string, Participation>
  >(hasLoadedOnce ? cachedParticipations : {})
  const [loading, setLoading] = useState(!hasLoadedOnce)
  const [userId, setUserId] = useState<string | null>(cachedUserId)
  const supabase = useMemo(() => createClient(), [])

  // Cargar usuario y participaciones
  useEffect(() => {
    let mounted = true

    async function loadData() {
      try {
        // Si ya cargamos los datos antes, usar el caché y evitar llamadas
        // redundantes al servidor (puede haber muchas instancias del hook en
        // pantalla al mismo tiempo, por ejemplo una por cada BarCard).
        if (hasLoadedOnce && cachedUserId !== null) {
          if (!mounted) return
          setUserId(cachedUserId)
          setParticipations(cachedParticipations)
          setLoading(false)
          return
        }

        // Importante: `getSession()` es más confiable al navegar entre páginas
        // (no depende de una llamada remota para validar el JWT).
        const {
          data: { session },
        } = await supabase.auth.getSession()
        const user = session?.user ?? null

        if (!mounted) return

        if (!user) {
          setUserId(null)
          setLoading(false)
          return
        }

        setUserId(user.id)

        // Cargar participaciones del usuario (sin photo_data_url para evitar timeouts;
        // la foto se carga bajo demanda desde ParticipationSection)
        const { data, error } = await supabase
          .from("participations")
          .select("id, bar_id, title, story, created_at, updated_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })

        if (error) {
          console.error("Error loading participations:", error)
          if (mounted) {
            setParticipations({})
            setLoading(false)
          }
          return
        }

        if (mounted && data) {
          const participationsMap: Record<string, Participation> = {}
          data.forEach((row) => {
            // Preservar fotos ya cargadas para no perderlas si loadData() corre dos veces
            const fotoExistente = cachedParticipations[row.bar_id]?.photoDataUrl || ""
            participationsMap[row.bar_id] = {
              ...rowToParticipation(row),
              photoDataUrl: fotoExistente,
            }
          })
          setParticipations(participationsMap)
          cachedParticipations = participationsMap
          cachedUserId = user.id
          hasLoadedOnce = true
          emitChange()
          setLoading(false)
        }
      } catch (error) {
        console.error("Error in loadData:", error)
        if (mounted) {
          setParticipations({})
          setLoading(false)
        }
      }
    }

    loadData()

    // Suscribirse a cambios en auth
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        const nextUserId = session?.user?.id ?? null
        setUserId(nextUserId)

        if (!nextUserId) {
          // Cierre de sesión explícito: limpiar cache y estado.
          cachedParticipations = {}
          cachedUserId = null
          hasLoadedOnce = false
          setParticipations({})
          setLoading(false)
          emitChange()
        } else {
          // Nuevo login: recargar datos.
          setLoading(true)
          loadData()
        }
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [supabase])

  // Sincronizar esta instancia con el cache global cuando cambie.
  useEffect(() => {
    const listener = () => {
      setParticipations(cachedParticipations)
      setUserId(cachedUserId)
    }
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  }, [])

  // Suscribirse a cambios en participations (real-time opcional)
  useEffect(() => {
    if (!userId) return

    const channel = supabase
      .channel("participations-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "participations",
          filter: `user_id=eq.${userId}`,
        },
        async () => {
          // Recargar participaciones cuando hay cambios (sin photo_data_url)
          const { data } = await supabase
            .from("participations")
            .select("id, bar_id, title, story, created_at, updated_at")
            .eq("user_id", userId)
            .order("created_at", { ascending: false })

          if (data) {
            const participationsMap: Record<string, Participation> = {}
            data.forEach((row) => {
              const fotoExistente = cachedParticipations[row.bar_id]?.photoDataUrl || ""
              participationsMap[row.bar_id] = {
                ...rowToParticipation(row),
                photoDataUrl: fotoExistente,
              }
            })
            cachedParticipations = participationsMap
            setParticipations(participationsMap)
            emitChange()
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId, supabase])

  const fetchParticipationPhoto = useCallback(
    async (barId: string): Promise<string> => {
      if (!userId) return ""

      const { data } = await supabase
        .from("participations")
        .select("photo_data_url")
        .eq("user_id", userId)
        .eq("bar_id", barId)
        .single()

      const photoUrl = data?.photo_data_url || ""

      if (photoUrl && cachedParticipations[barId]) {
        const updated = {
          ...cachedParticipations,
          [barId]: { ...cachedParticipations[barId], photoDataUrl: photoUrl },
        }
        cachedParticipations = updated
        setParticipations(updated)
        emitChange()
      }

      return photoUrl
    },
    [userId, supabase]
  )

  const getParticipation = useCallback(
    (barId: string): Participation | null => {
      return participations[barId] ?? null
    },
    [participations]
  )

  const saveParticipation = useCallback(
    async (participation: Participation) => {
      const ensuredUserId = userId ?? (await supabase.auth.getSession()).data
        .session?.user?.id ?? null
      if (!ensuredUserId) {
        console.error("User not authenticated")
        throw new Error("User not authenticated")
      }

      try {
        // Buscar si ya existe una participación para este bar
        const { data: existing } = await supabase
          .from("participations")
          .select("id")
          .eq("user_id", ensuredUserId)
          .eq("bar_id", participation.barId)
          .single()

        const participationData = {
          user_id: ensuredUserId,
          bar_id: participation.barId,
          photo_data_url: participation.photoDataUrl,
          title: participation.title,
          story: participation.story,
        }

        let error
        if (existing) {
          // Actualizar existente
          const { error: updateError } = await supabase
            .from("participations")
            .update(participationData)
            .eq("id", existing.id)
          error = updateError
        } else {
          // Insertar nuevo
          const { error: insertError } = await supabase
            .from("participations")
            .insert(participationData)
          error = insertError
        }

        if (error) {
          console.error("Error saving participation:", error)
          throw error
        }

        // Actualizar estado local
        const updated = {
          ...participations,
          [participation.barId]: participation,
        }
        setParticipations(updated)
        cachedParticipations = updated
        cachedUserId = ensuredUserId
        hasLoadedOnce = true
        emitChange()
      } catch (error) {
        console.error("Error in saveParticipation:", error)
        throw error
      }
    },
    [userId, participations, supabase]
  )

  const completedCount = Object.keys(participations).length

  const isCompleted = useCallback(
    (barId: string): boolean => {
      return barId in participations
    },
    [participations]
  )

  return {
    participations,
    getParticipation,
    saveParticipation,
    fetchParticipationPhoto,
    completedCount,
    isCompleted,
    loading,
    userId,
  }
}
