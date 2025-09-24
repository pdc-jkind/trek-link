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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      containers: {
        Row: {
          container_code: string
          created_at: string | null
          id: string
          last_used_at: string | null
          location_office_id: string | null
          status: string | null
        }
        Insert: {
          container_code: string
          created_at?: string | null
          id?: string
          last_used_at?: string | null
          location_office_id?: string | null
          status?: string | null
        }
        Update: {
          container_code?: string
          created_at?: string | null
          id?: string
          last_used_at?: string | null
          location_office_id?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "containers_location_office_id_fkey"
            columns: ["location_office_id"]
            isOneToOne: false
            referencedRelation: "offices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "containers_location_office_id_fkey"
            columns: ["location_office_id"]
            isOneToOne: false
            referencedRelation: "view_items_full"
            referencedColumns: ["office_id"]
          },
        ]
      }
      fcm_tokens: {
        Row: {
          device_type: string | null
          fcm_token: string
          id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          device_type?: string | null
          fcm_token: string
          id?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          device_type?: string | null
          fcm_token?: string
          id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fcm_tokens_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users_with_office_assignment"
            referencedColumns: ["id"]
          },
        ]
      }
      item_masters: {
        Row: {
          created_at: string | null
          id: string
          img_url: string | null
          name: string
          office_id: string | null
          type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          img_url?: string | null
          name: string
          office_id?: string | null
          type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          img_url?: string | null
          name?: string
          office_id?: string | null
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "item_masters_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "offices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "item_masters_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "view_items_full"
            referencedColumns: ["office_id"]
          },
        ]
      }
      item_variants: {
        Row: {
          created_at: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      items: {
        Row: {
          alt_unit: string | null
          conversion_to_base: number | null
          created_at: string | null
          id: string
          item_code: string
          item_master_id: string | null
          item_name: string
          unit: string | null
          updated_at: string | null
          variant_id: string | null
        }
        Insert: {
          alt_unit?: string | null
          conversion_to_base?: number | null
          created_at?: string | null
          id?: string
          item_code: string
          item_master_id?: string | null
          item_name: string
          unit?: string | null
          updated_at?: string | null
          variant_id?: string | null
        }
        Update: {
          alt_unit?: string | null
          conversion_to_base?: number | null
          created_at?: string | null
          id?: string
          item_code?: string
          item_master_id?: string | null
          item_name?: string
          unit?: string | null
          updated_at?: string | null
          variant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "items_item_master_id_fkey"
            columns: ["item_master_id"]
            isOneToOne: false
            referencedRelation: "item_masters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "items_item_master_id_fkey"
            columns: ["item_master_id"]
            isOneToOne: false
            referencedRelation: "view_items_full"
            referencedColumns: ["item_master_id"]
          },
          {
            foreignKeyName: "items_variant_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "item_variants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "items_variant_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "view_items_full"
            referencedColumns: ["variant_id"]
          },
        ]
      }
      office_users: {
        Row: {
          assigned_at: string | null
          id: string
          office_id: string | null
          role_id: string | null
          user_id: string | null
        }
        Insert: {
          assigned_at?: string | null
          id?: string
          office_id?: string | null
          role_id?: string | null
          user_id?: string | null
        }
        Update: {
          assigned_at?: string | null
          id?: string
          office_id?: string | null
          role_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "office_users_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "offices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "office_users_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "view_items_full"
            referencedColumns: ["office_id"]
          },
          {
            foreignKeyName: "office_users_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "office_users_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users_with_office_assignment"
            referencedColumns: ["id"]
          },
        ]
      }
      offices: {
        Row: {
          created_at: string | null
          id: string
          location: string | null
          name: string
          type: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          location?: string | null
          name: string
          type: string
        }
        Update: {
          created_at?: string | null
          id?: string
          location?: string | null
          name?: string
          type?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string | null
          id: string
          item_id: string | null
          order_id: string | null
          quantity: number | null
          unit: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          item_id?: string | null
          order_id?: string | null
          quantity?: number | null
          unit?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          item_id?: string | null
          order_id?: string | null
          quantity?: number | null
          unit?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_items_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "view_items_full"
            referencedColumns: ["item_id"]
          },
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          id: string
          note: string | null
          office_id: string | null
          order_code: string
          ordered_at: string | null
          ordered_by: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          note?: string | null
          office_id?: string | null
          order_code: string
          ordered_at?: string | null
          ordered_by?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          note?: string | null
          office_id?: string | null
          order_code?: string
          ordered_at?: string | null
          ordered_by?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "offices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "view_items_full"
            referencedColumns: ["office_id"]
          },
          {
            foreignKeyName: "orders_ordered_by_fkey"
            columns: ["ordered_by"]
            isOneToOne: false
            referencedRelation: "users_with_office_assignment"
            referencedColumns: ["id"]
          },
        ]
      }
      receipt_items: {
        Row: {
          id: string
          item_id: string | null
          quantity: number
          receipt_id: string | null
          shipment_item_id: string | null
          unit: string | null
        }
        Insert: {
          id?: string
          item_id?: string | null
          quantity: number
          receipt_id?: string | null
          shipment_item_id?: string | null
          unit?: string | null
        }
        Update: {
          id?: string
          item_id?: string | null
          quantity?: number
          receipt_id?: string | null
          shipment_item_id?: string | null
          unit?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "receipt_items_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "receipt_items_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "view_items_full"
            referencedColumns: ["item_id"]
          },
          {
            foreignKeyName: "receipt_items_receipt_id_fkey"
            columns: ["receipt_id"]
            isOneToOne: false
            referencedRelation: "receipts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "receipt_items_shipment_item_id_fkey"
            columns: ["shipment_item_id"]
            isOneToOne: false
            referencedRelation: "shipment_items"
            referencedColumns: ["id"]
          },
        ]
      }
      receipts: {
        Row: {
          condition: string | null
          id: string
          notes: string | null
          received_at: string | null
          received_by: string | null
          shipment_id: string | null
        }
        Insert: {
          condition?: string | null
          id?: string
          notes?: string | null
          received_at?: string | null
          received_by?: string | null
          shipment_id?: string | null
        }
        Update: {
          condition?: string | null
          id?: string
          notes?: string | null
          received_at?: string | null
          received_by?: string | null
          shipment_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "receipts_received_by_fkey"
            columns: ["received_by"]
            isOneToOne: false
            referencedRelation: "users_with_office_assignment"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "receipts_shipment_id_fkey"
            columns: ["shipment_id"]
            isOneToOne: false
            referencedRelation: "shipments"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          permissions: Json | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          permissions?: Json | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          permissions?: Json | null
        }
        Relationships: []
      }
      shipment_containers: {
        Row: {
          container_id: string
          id: string
          order_id: string | null
          role: string
          shipment_id: string | null
        }
        Insert: {
          container_id: string
          id?: string
          order_id?: string | null
          role: string
          shipment_id?: string | null
        }
        Update: {
          container_id?: string
          id?: string
          order_id?: string | null
          role?: string
          shipment_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shipment_containers_container_id_fkey"
            columns: ["container_id"]
            isOneToOne: false
            referencedRelation: "containers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shipment_containers_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shipment_containers_shipment_id_fkey"
            columns: ["shipment_id"]
            isOneToOne: false
            referencedRelation: "shipments"
            referencedColumns: ["id"]
          },
        ]
      }
      shipment_items: {
        Row: {
          id: string
          item_id: string | null
          order_item_id: string | null
          quantity: number
          shipment_id: string | null
          unit: string | null
        }
        Insert: {
          id?: string
          item_id?: string | null
          order_item_id?: string | null
          quantity?: number
          shipment_id?: string | null
          unit?: string | null
        }
        Update: {
          id?: string
          item_id?: string | null
          order_item_id?: string | null
          quantity?: number
          shipment_id?: string | null
          unit?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shipment_items_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shipment_items_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "view_items_full"
            referencedColumns: ["item_id"]
          },
          {
            foreignKeyName: "shipment_items_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shipment_items_shipment_id_fkey"
            columns: ["shipment_id"]
            isOneToOne: false
            referencedRelation: "shipments"
            referencedColumns: ["id"]
          },
        ]
      }
      shipments: {
        Row: {
          created_by: string | null
          from_office_id: string | null
          id: string
          note: string | null
          order_id: string | null
          shipment_code: string
          shipped_at: string | null
          status: string | null
          to_office_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_by?: string | null
          from_office_id?: string | null
          id?: string
          note?: string | null
          order_id?: string | null
          shipment_code: string
          shipped_at?: string | null
          status?: string | null
          to_office_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_by?: string | null
          from_office_id?: string | null
          id?: string
          note?: string | null
          order_id?: string | null
          shipment_code?: string
          shipped_at?: string | null
          status?: string | null
          to_office_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shipments_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users_with_office_assignment"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shipments_from_office_id_fkey"
            columns: ["from_office_id"]
            isOneToOne: false
            referencedRelation: "offices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shipments_from_office_id_fkey"
            columns: ["from_office_id"]
            isOneToOne: false
            referencedRelation: "view_items_full"
            referencedColumns: ["office_id"]
          },
          {
            foreignKeyName: "shipments_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shipments_to_office_id_fkey"
            columns: ["to_office_id"]
            isOneToOne: false
            referencedRelation: "offices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shipments_to_office_id_fkey"
            columns: ["to_office_id"]
            isOneToOne: false
            referencedRelation: "view_items_full"
            referencedColumns: ["office_id"]
          },
        ]
      }
    }
    Views: {
      users_with_office_assignment: {
        Row: {
          assigned_at: string | null
          created_at: string | null
          email: string | null
          email_confirmed_at: string | null
          id: string | null
          last_sign_in_at: string | null
          office_id: string | null
          office_location: string | null
          office_name: string | null
          office_type: string | null
          office_user_id: string | null
          phone: string | null
          phone_confirmed_at: string | null
          role_description: string | null
          role_id: string | null
          role_name: string | null
          role_permissions: Json | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "office_users_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "offices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "office_users_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "view_items_full"
            referencedColumns: ["office_id"]
          },
          {
            foreignKeyName: "office_users_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      view_items_full: {
        Row: {
          alt_unit: string | null
          conversion_to_base: number | null
          item_code: string | null
          item_id: string | null
          item_master_id: string | null
          item_master_img_url: string | null
          item_master_name: string | null
          item_master_type: string | null
          item_name: string | null
          office_id: string | null
          office_name: string | null
          unit: string | null
          variant_id: string | null
          variant_name: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_default_role_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
