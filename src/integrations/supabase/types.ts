export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      backups: {
        Row: {
          backup_type: string
          created_at: string
          created_by: string | null
          file_url: string
          id: string
        }
        Insert: {
          backup_type?: string
          created_at?: string
          created_by?: string | null
          file_url: string
          id?: string
        }
        Update: {
          backup_type?: string
          created_at?: string
          created_by?: string | null
          file_url?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "backups_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      booking_locks: {
        Row: {
          created_at: string
          customer_id: string
          end_date: string
          expires_at: string
          id: string
          start_date: string
          vehicle_id: string
        }
        Insert: {
          created_at?: string
          customer_id: string
          end_date: string
          expires_at?: string
          id?: string
          start_date: string
          vehicle_id: string
        }
        Update: {
          created_at?: string
          customer_id?: string
          end_date?: string
          expires_at?: string
          id?: string
          start_date?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "booking_locks_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "booking_locks_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          booking_notes: string | null
          created_at: string
          customer_id: string
          end_date: string
          id: string
          pickup_location: string
          return_location: string
          start_date: string
          status: Database["public"]["Enums"]["booking_status"]
          total_cost: number
          updated_at: string
          vehicle_id: string
        }
        Insert: {
          booking_notes?: string | null
          created_at?: string
          customer_id: string
          end_date: string
          id?: string
          pickup_location: string
          return_location: string
          start_date: string
          status?: Database["public"]["Enums"]["booking_status"]
          total_cost: number
          updated_at?: string
          vehicle_id: string
        }
        Update: {
          booking_notes?: string | null
          created_at?: string
          customer_id?: string
          end_date?: string
          id?: string
          pickup_location?: string
          return_location?: string
          start_date?: string
          status?: Database["public"]["Enums"]["booking_status"]
          total_cost?: number
          updated_at?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      cost_breakdowns: {
        Row: {
          additional_fees: Json | null
          base_cost: number
          booking_id: string
          created_at: string
          discount_amount: number | null
          id: string
          insurance_cost: number | null
          tax_amount: number | null
          total_cost: number
        }
        Insert: {
          additional_fees?: Json | null
          base_cost: number
          booking_id: string
          created_at?: string
          discount_amount?: number | null
          id?: string
          insurance_cost?: number | null
          tax_amount?: number | null
          total_cost: number
        }
        Update: {
          additional_fees?: Json | null
          base_cost?: number
          booking_id?: string
          created_at?: string
          discount_amount?: number | null
          id?: string
          insurance_cost?: number | null
          tax_amount?: number | null
          total_cost?: number
        }
        Relationships: [
          {
            foreignKeyName: "cost_breakdowns_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      maintenance_logs: {
        Row: {
          completed_date: string | null
          cost: number | null
          created_at: string
          description: string
          id: string
          maintenance_type: string
          notes: string | null
          performed_by: string
          scheduled_date: string | null
          status: string
          updated_at: string
          vehicle_id: string
        }
        Insert: {
          completed_date?: string | null
          cost?: number | null
          created_at?: string
          description: string
          id?: string
          maintenance_type: string
          notes?: string | null
          performed_by: string
          scheduled_date?: string | null
          status?: string
          updated_at?: string
          vehicle_id: string
        }
        Update: {
          completed_date?: string | null
          cost?: number | null
          created_at?: string
          description?: string
          id?: string
          maintenance_type?: string
          notes?: string | null
          performed_by?: string
          scheduled_date?: string | null
          status?: string
          updated_at?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_logs_performed_by_fkey"
            columns: ["performed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maintenance_logs_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          role: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          role?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          role?: string | null
        }
        Relationships: []
      }
      settings: {
        Row: {
          key: string
          updated_at: string
          value: string
        }
        Insert: {
          key: string
          updated_at?: string
          value: string
        }
        Update: {
          key?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      vehicle_conditions: {
        Row: {
          booking_id: string | null
          condition_type: string
          created_at: string
          damage_details: Json | null
          exterior_condition: Database["public"]["Enums"]["condition_status"]
          fuel_level: number | null
          id: string
          images: Json | null
          interior_condition: Database["public"]["Enums"]["condition_status"]
          mechanical_condition: Database["public"]["Enums"]["condition_status"]
          mileage: number | null
          notes: string | null
          overall_condition: Database["public"]["Enums"]["condition_status"]
          reporter_id: string
          vehicle_id: string
        }
        Insert: {
          booking_id?: string | null
          condition_type: string
          created_at?: string
          damage_details?: Json | null
          exterior_condition: Database["public"]["Enums"]["condition_status"]
          fuel_level?: number | null
          id?: string
          images?: Json | null
          interior_condition: Database["public"]["Enums"]["condition_status"]
          mechanical_condition: Database["public"]["Enums"]["condition_status"]
          mileage?: number | null
          notes?: string | null
          overall_condition: Database["public"]["Enums"]["condition_status"]
          reporter_id: string
          vehicle_id: string
        }
        Update: {
          booking_id?: string | null
          condition_type?: string
          created_at?: string
          damage_details?: Json | null
          exterior_condition?: Database["public"]["Enums"]["condition_status"]
          fuel_level?: number | null
          id?: string
          images?: Json | null
          interior_condition?: Database["public"]["Enums"]["condition_status"]
          mechanical_condition?: Database["public"]["Enums"]["condition_status"]
          mileage?: number | null
          notes?: string | null
          overall_condition?: Database["public"]["Enums"]["condition_status"]
          reporter_id?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_conditions_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicle_conditions_reporter_id_fkey"
            columns: ["reporter_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicle_conditions_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicles: {
        Row: {
          agent_id: string | null
          color: string
          created_at: string
          daily_rate: number
          features: Json | null
          fuel_type: string
          id: string
          images: Json | null
          license_plate: string
          location: string | null
          make: string
          mileage: number | null
          model: string
          seats: number
          status: Database["public"]["Enums"]["vehicle_status"]
          transmission: string
          type: Database["public"]["Enums"]["vehicle_type"]
          updated_at: string
          year: number
        }
        Insert: {
          agent_id?: string | null
          color: string
          created_at?: string
          daily_rate: number
          features?: Json | null
          fuel_type?: string
          id?: string
          images?: Json | null
          license_plate: string
          location?: string | null
          make: string
          mileage?: number | null
          model: string
          seats?: number
          status?: Database["public"]["Enums"]["vehicle_status"]
          transmission?: string
          type: Database["public"]["Enums"]["vehicle_type"]
          updated_at?: string
          year: number
        }
        Update: {
          agent_id?: string | null
          color?: string
          created_at?: string
          daily_rate?: number
          features?: Json | null
          fuel_type?: string
          id?: string
          images?: Json | null
          license_plate?: string
          location?: string | null
          make?: string
          mileage?: number | null
          model?: string
          seats?: number
          status?: Database["public"]["Enums"]["vehicle_status"]
          transmission?: string
          type?: Database["public"]["Enums"]["vehicle_type"]
          updated_at?: string
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "vehicles_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      cleanup_expired_booking_locks: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      get_user_role: {
        Args: { user_id?: string }
        Returns: Database["public"]["Enums"]["user_role"]
      }
    }
    Enums: {
      booking_status:
        | "pending"
        | "confirmed"
        | "active"
        | "completed"
        | "cancelled"
        | "awaiting_payment"
        | "scheduled"
      condition_status: "excellent" | "good" | "fair" | "poor" | "damaged"
      user_role: "customer" | "admin" | "agent"
      vehicle_status: "available" | "rented" | "maintenance" | "out_of_service"
      vehicle_type:
        | "economy"
        | "compact"
        | "midsize"
        | "fullsize"
        | "luxury"
        | "suv"
        | "truck"
        | "van"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      booking_status: [
        "pending",
        "confirmed",
        "active",
        "completed",
        "cancelled",
        "awaiting_payment",
        "scheduled",
      ],
      condition_status: ["excellent", "good", "fair", "poor", "damaged"],
      user_role: ["customer", "admin", "agent"],
      vehicle_status: ["available", "rented", "maintenance", "out_of_service"],
      vehicle_type: [
        "economy",
        "compact",
        "midsize",
        "fullsize",
        "luxury",
        "suv",
        "truck",
        "van",
      ],
    },
  },
} as const
