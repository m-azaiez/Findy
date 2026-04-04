import { featuredCategories } from "@/lib/constants/mock-data";
import { mapCategoryRow } from "@/lib/mappers/database";
import { hasSupabaseCredentials } from "@/lib/supabase/env";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { type Category } from "@/types/domain";

export async function listCategories(): Promise<Category[]> {
  if (!hasSupabaseCredentials) {
    return featuredCategories;
  }

  const client = await createServerSupabaseClient();
  const { data, error } = await client.from("categories").select("*").order("name");

  if (error) {
    throw error;
  }

  return (data ?? []).map(mapCategoryRow);
}
