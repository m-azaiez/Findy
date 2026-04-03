export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          created_at: string;
          description: string | null;
          id: string;
          name: string;
          slug: string;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          id?: string;
          name: string;
          slug: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          id?: string;
          name?: string;
          slug?: string;
        };
      };
      favorites: {
        Row: {
          created_at: string;
          place_id: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          place_id: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          place_id?: string;
          user_id?: string;
        };
      };
      place_categories: {
        Row: {
          category_id: string;
          place_id: string;
        };
        Insert: {
          category_id: string;
          place_id: string;
        };
        Update: {
          category_id?: string;
          place_id?: string;
        };
      };
      places: {
        Row: {
          address: string;
          average_rating: number;
          city: string;
          country: string;
          cover_image_url: string | null;
          created_at: string;
          created_by: string | null;
          description: string;
          gallery: string[];
          id: string;
          is_open_now: boolean;
          name: string;
          opening_hours: Json;
          price_tier: Database["public"]["Enums"]["price_tier"];
          review_count: number;
          short_description: string;
          slug: string;
          tags: string[];
          updated_at: string;
        };
        Insert: {
          address: string;
          average_rating?: number;
          city: string;
          country?: string;
          cover_image_url?: string | null;
          created_at?: string;
          created_by?: string | null;
          description: string;
          gallery?: string[];
          id?: string;
          is_open_now?: boolean;
          name: string;
          opening_hours?: Json;
          price_tier?: Database["public"]["Enums"]["price_tier"];
          review_count?: number;
          short_description: string;
          slug: string;
          tags?: string[];
          updated_at?: string;
        };
        Update: {
          address?: string;
          average_rating?: number;
          city?: string;
          country?: string;
          cover_image_url?: string | null;
          created_at?: string;
          created_by?: string | null;
          description?: string;
          gallery?: string[];
          id?: string;
          is_open_now?: boolean;
          name?: string;
          opening_hours?: Json;
          price_tier?: Database["public"]["Enums"]["price_tier"];
          review_count?: number;
          short_description?: string;
          slug?: string;
          tags?: string[];
          updated_at?: string;
        };
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          city: string | null;
          created_at: string;
          full_name: string | null;
          id: string;
          role: Database["public"]["Enums"]["user_role"];
          updated_at: string;
          username: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          city?: string | null;
          created_at?: string;
          full_name?: string | null;
          id: string;
          role?: Database["public"]["Enums"]["user_role"];
          updated_at?: string;
          username?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          city?: string | null;
          created_at?: string;
          full_name?: string | null;
          id?: string;
          role?: Database["public"]["Enums"]["user_role"];
          updated_at?: string;
          username?: string | null;
        };
      };
      reviews: {
        Row: {
          comment: string;
          created_at: string;
          id: string;
          place_id: string;
          rating: number;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          comment: string;
          created_at?: string;
          id?: string;
          place_id: string;
          rating: number;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          comment?: string;
          created_at?: string;
          id?: string;
          place_id?: string;
          rating?: number;
          updated_at?: string;
          user_id?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: {
        Args: {
          uid?: string | null;
        };
        Returns: boolean;
      };
    };
    Enums: {
      price_tier: "budget" | "mid-range" | "premium" | "luxury";
      user_role: "user" | "admin";
    };
    CompositeTypes: Record<string, never>;
  };
};
