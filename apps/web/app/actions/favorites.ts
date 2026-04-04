"use server";

import { revalidatePath } from "next/cache";

import { hasSupabaseCredentials } from "@/lib/supabase/env";
import { FavoriteAuthError, FavoriteConfigError, toggleFavoritePlace } from "@/services/favorites.service";
import { sanitizeRedirectPath } from "@findy/shared/utils/url";
import { toggleFavoriteSchema } from "@findy/shared/validations/favorites";

export type FavoriteActionState = {
  status: "idle" | "success" | "error";
  message?: string;
  isFavorited?: boolean;
};

function getFormValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

export async function toggleFavoriteAction(
  _previousState: FavoriteActionState,
  formData: FormData
): Promise<FavoriteActionState> {
  if (!hasSupabaseCredentials) {
    return {
      status: "error",
      message: "Favorites are unavailable until Supabase auth is configured."
    };
  }

  const parsed = toggleFavoriteSchema.safeParse({
    placeId: getFormValue(formData, "placeId"),
    returnTo: getFormValue(formData, "returnTo")
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "This place could not be saved."
    };
  }

  try {
    const result = await toggleFavoritePlace(parsed.data.placeId);
    const returnTo = sanitizeRedirectPath(parsed.data.returnTo, "/");

    revalidatePath(returnTo);
    revalidatePath("/dashboard/favorites");

    return {
      status: "success",
      isFavorited: result.isFavorited,
      message: result.isFavorited ? "Place saved to favorites." : "Place removed from favorites."
    };
  } catch (error) {
    if (error instanceof FavoriteConfigError || error instanceof FavoriteAuthError) {
      return {
        status: "error",
        message: error.message
      };
    }

    return {
      status: "error",
      message: error instanceof Error ? error.message : "This place could not be updated right now."
    };
  }
}
