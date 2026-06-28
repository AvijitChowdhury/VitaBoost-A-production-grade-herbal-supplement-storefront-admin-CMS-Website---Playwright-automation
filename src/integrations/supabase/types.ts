export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      benefits: {
        Row: {
          created_at: string
          description: string | null
          display_order: number
          icon: string
          id: string
          title: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number
          icon?: string
          id?: string
          title: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number
          icon?: string
          id?: string
          title?: string
        }
        Relationships: []
      }
      faq: {
        Row: {
          answer: string
          created_at: string
          display_order: number
          id: string
          question: string
        }
        Insert: {
          answer: string
          created_at?: string
          display_order?: number
          id?: string
          question: string
        }
        Update: {
          answer?: string
          created_at?: string
          display_order?: number
          id?: string
          question?: string
        }
        Relationships: []
      }
      ingredients: {
        Row: {
          created_at: string
          description: string | null
          display_order: number
          id: string
          image: string | null
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          image?: string | null
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          image?: string | null
          name?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          address: string
          created_at: string
          customer_name: string
          id: string
          payment_method: string
          phone: string
          quantity: number
          status: string
          total_price: number
          updated_at: string
        }
        Insert: {
          address: string
          created_at?: string
          customer_name: string
          id?: string
          payment_method: string
          phone: string
          quantity?: number
          status?: string
          total_price?: number
          updated_at?: string
        }
        Update: {
          address?: string
          created_at?: string
          customer_name?: string
          id?: string
          payment_method?: string
          phone?: string
          quantity?: number
          status?: string
          total_price?: number
          updated_at?: string
        }
        Relationships: []
      }
      product: {
        Row: {
          description: string | null
          discount_price: number | null
          headline: string | null
          id: string
          image: string | null
          ingredients: string | null
          name: string
          price: number
          short_description: string | null
          stock: number
          updated_at: string
          usage: string | null
        }
        Insert: {
          description?: string | null
          discount_price?: number | null
          headline?: string | null
          id?: string
          image?: string | null
          ingredients?: string | null
          name: string
          price?: number
          short_description?: string | null
          stock?: number
          updated_at?: string
          usage?: string | null
        }
        Update: {
          description?: string | null
          discount_price?: number | null
          headline?: string | null
          id?: string
          image?: string | null
          ingredients?: string | null
          name?: string
          price?: number
          short_description?: string | null
          stock?: number
          updated_at?: string
          usage?: string | null
        }
        Relationships: []
      }
      settings: {
        Row: {
          email: string | null
          facebook: string | null
          id: string
          instagram: string | null
          logo: string | null
          phone: string | null
          store_name: string
          updated_at: string
          whatsapp: string | null
        }
        Insert: {
          email?: string | null
          facebook?: string | null
          id?: string
          instagram?: string | null
          logo?: string | null
          phone?: string | null
          store_name?: string
          updated_at?: string
          whatsapp?: string | null
        }
        Update: {
          email?: string | null
          facebook?: string | null
          id?: string
          instagram?: string | null
          logo?: string | null
          phone?: string | null
          store_name?: string
          updated_at?: string
          whatsapp?: string | null
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          approved: boolean
          created_at: string
          customer_name: string
          display_order: number
          id: string
          photo: string | null
          rating: number
          review: string
        }
        Insert: {
          approved?: boolean
          created_at?: string
          customer_name: string
          display_order?: number
          id?: string
          photo?: string | null
          rating?: number
          review: string
        }
        Update: {
          approved?: boolean
          created_at?: string
          customer_name?: string
          display_order?: number
          id?: string
          photo?: string | null
          rating?: number
          review?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      claim_first_admin: { Args: never; Returns: boolean }
      debug_role: { Args: never; Returns: Json }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin"],
    },
  },
} as const
