"use server";

import { revalidatePath } from "next/cache";

import { hasSupabaseCredentials } from "@/lib/supabase/env";
import { getAuthContext } from "@/services/auth.service";
import { PlaceCategoryError, PlaceConfigError, PlaceConflictError, createPlace } from "@/services/places.service";
import { sanitizeRedirectPath } from "@findy/shared/utils/url";
import { createPlaceSchema } from "@findy/shared/validations/place";

export type CreatePlaceActionState = {
  fieldErrors?: {
    address?: string;
    categoryIds?: string;
    city?: string;
    country?: string;
    coverImageUrl?: string;
    description?: string;
    name?: string;
    priceTier?: string;
    shortDescription?: string;
    slug?: string;
    tags?: string;
  };
  message?: string;
  placeId?: string;
  slug?: string;
  status: "idle" | "success" | "error";
};

const initialErrorMessage = "This place could not be created right now.";

function getFormValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function getFormValues(formData: FormData, key: string) {
  return formData
    .getAll(key)
    .flatMap((value) => (typeof value === "string" ? [value] : []))
    .map((value) => value.trim())
    .filter(Boolean);
}

function parseTagInput(rawTags: string) {
  return rawTags
    .split(",")
    .map((tag) => tag.trim().toLowerCase())
    .filter(Boolean);
}

function toErrorState(message: string): CreatePlaceActionState {
  return {
    message,
    status: "error"
  };
}

function getPlaceFieldErrors(fieldErrors: Record<string, string[] | undefined>): CreatePlaceActionState["fieldErrors"] {
  return Object.fromEntries(
    Object.entries(fieldErrors)
      .filter(([, value]) => Boolean(value?.[0]))
      .map(([key, value]) => [key, value?.[0]])
  );
}

function revalidatePlacePaths(slug: string, returnTo: string) {
  revalidatePath(returnTo);
  revalidatePath("/");
  revalidatePath("/search");
  revalidatePath("/admin/places");
  revalidatePath(`/places/${slug}`);
}

export async function createPlaceAction(
  _previousState: CreatePlaceActionState,
  formData: FormData
): Promise<CreatePlaceActionState> {
  if (!hasSupabaseCredentials) {
    return toErrorState("Place management is unavailable until Supabase is configured.");
  }

  const authContext = await getAuthContext();

  if (!authContext.user || authContext.profile?.role !== "admin") {
    return toErrorState("Only admins can create places.");
  }

  const parsed = createPlaceSchema.safeParse({
    address: getFormValue(formData, "address"),
    categoryIds: getFormValues(formData, "categoryIds"),
    city: getFormValue(formData, "city"),
    country: getFormValue(formData, "country") || "Canada",
    coverImageUrl: getFormValue(formData, "coverImageUrl"),
    description: getFormValue(formData, "description"),
    isOpenNow: getFormValue(formData, "isOpenNow") === "on",
    name: getFormValue(formData, "name"),
    priceTier: getFormValue(formData, "priceTier"),
    returnTo: getFormValue(formData, "returnTo"),
    shortDescription: getFormValue(formData, "shortDescription"),
    slug: getFormValue(formData, "slug"),
    tags: parseTagInput(getFormValue(formData, "tags"))
  });

  if (!parsed.success) {
    return {
      fieldErrors: getPlaceFieldErrors(parsed.error.flatten().fieldErrors),
      message: parsed.error.issues[0]?.message ?? initialErrorMessage,
      status: "error"
    };
  }

  try {
    const place = await createPlace(parsed.data, authContext.user.id);
    const returnTo = sanitizeRedirectPath(parsed.data.returnTo, "/admin/places");

    revalidatePlacePaths(place.slug, returnTo);

    return {
      message: "Place created.",
      placeId: place.id,
      slug: place.slug,
      status: "success"
    };
  } catch (error) {
    if (error instanceof PlaceConfigError || error instanceof PlaceConflictError || error instanceof PlaceCategoryError) {
      return toErrorState(error.message);
    }

    return toErrorState(error instanceof Error ? error.message : initialErrorMessage);
  }
}
