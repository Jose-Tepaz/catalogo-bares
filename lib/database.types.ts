export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      bars: {
        Row: {
          id: string
          name: string
          city: string
          address: string
          category: string
          image_url: string | null
          state_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name: string
          city: string
          address: string
          category: string
          image_url?: string | null
          state_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          city?: string
          address?: string
          category?: string
          image_url?: string | null
          state_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      estados: {
        Row: {
          id: string
          name: string
          slug: string
        }
        Insert: {
          id: string
          name: string
          slug: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
        }
      }
      categorias: {
        Row: {
          id: number
          name: string
          slug: string
          description: string | null
          created_at: string
        }
        Insert: {
          name: string
          slug: string
          description?: string | null
          created_at?: string
        }
        Update: {
          name?: string
          slug?: string
          description?: string | null
          created_at?: string
        }
      }
      participations: {
        Row: {
          id: string
          user_id: string
          bar_id: string
          photo_data_url: string | null
          title: string | null
          story: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          bar_id: string
          photo_data_url?: string | null
          title?: string | null
          story?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          bar_id?: string
          photo_data_url?: string | null
          title?: string | null
          story?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
