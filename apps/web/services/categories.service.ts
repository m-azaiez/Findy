import { hasSupabaseCredentials } from "@/lib/supabase/env";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { featuredCategories } from "@findy/shared/constants/mock-data";
import { mapCategoryRow } from "@findy/shared/mappers/database";
import { type Category } from "@findy/shared/domain";

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
