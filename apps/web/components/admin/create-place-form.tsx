"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { startTransition, useActionState, useEffect, useState } from "react";

import { createPlaceAction, type CreatePlaceActionState } from "@/app/actions/places";
import { Button, buttonVariants } from "@/components/ui/button";
import { Notice } from "@/components/ui/notice";
import { cn } from "@/lib/utils/cn";
import { type Category, type PriceTier } from "@/types/domain";

type CreatePlaceFormProps = {
  categories: Category[];
};

const initialState: CreatePlaceActionState = {
  status: "idle"
};

const priceTierOptions: PriceTier[] = ["budget", "mid-range", "premium", "luxury"];

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="text-sm text-red-700">{message}</p>;
}

function hasFieldErrors(fieldErrors?: Record<string, string | undefined>) {
  return Object.values(fieldErrors ?? {}).some(Boolean);
}

type CreatePlaceFormValues = {
  address: string;
  categoryIds: string[];
  city: string;
  country: string;
  coverImageUrl: string;
  description: string;
  isOpenNow: boolean;
  name: string;
  priceTier: PriceTier;
  shortDescription: string;
  slug: string;
  tags: string;
};

const initialFormValues: CreatePlaceFormValues = {
  address: "",
  categoryIds: [],
  city: "",
  country: "Canada",
  coverImageUrl: "",
  description: "",
  isOpenNow: false,
  name: "",
  priceTier: "mid-range",
  shortDescription: "",
  slug: "",
  tags: ""
};

function slugifyName(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function CreatePlaceForm({ categories }: CreatePlaceFormProps) {
  const router = useRouter();
  const [state, formAction] = useActionState(createPlaceAction, initialState);
  const [formValues, setFormValues] = useState<CreatePlaceFormValues>(initialFormValues);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  useEffect(() => {
    if (state.status !== "success") {
      return;
    }

    setFormValues(initialFormValues);
    setSlugManuallyEdited(false);

    startTransition(() => {
      router.refresh();
    });
  }, [router, state.placeId, state.slug, state.status]);

  function updateField<Key extends keyof CreatePlaceFormValues>(key: Key, value: CreatePlaceFormValues[Key]) {
    setFormValues((currentValues) => ({
      ...currentValues,
      [key]: value
    }));
  }

  function handleNameChange(value: string) {
    setFormValues((currentValues) => ({
      ...currentValues,
      name: value,
      slug: slugManuallyEdited ? currentValues.slug : slugifyName(value)
    }));
  }

  function handleSlugChange(value: string) {
    setSlugManuallyEdited(true);
    updateField("slug", value.toLowerCase());
  }

  function handleCategoryToggle(categoryId: string, checked: boolean) {
    setFormValues((currentValues) => ({
      ...currentValues,
      categoryIds: checked
        ? [...currentValues.categoryIds, categoryId]
        : currentValues.categoryIds.filter((value) => value !== categoryId)
    }));
  }

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <h2 className="text-2xl">Create place</h2>
        <p className="text-sm text-foreground/65">
          This first admin flow creates a place record and attaches one or more existing categories.
        </p>
      </div>

      {state.status === "success" && state.slug ? (
        <Notice tone="success">
          <span className="mr-2">{state.message}</span>
          <Link href={`/places/${state.slug}`} className={buttonVariants({ variant: "ghost" })}>
            Open place
          </Link>
        </Notice>
      ) : null}

      {state.status === "error" && state.message && !hasFieldErrors(state.fieldErrors) ? (
        <Notice tone="error">{state.message}</Notice>
      ) : null}

      <form action={formAction} className="grid gap-5 rounded-[1.75rem] border border-foreground/10 bg-white/80 p-6 lg:grid-cols-2">
        <input type="hidden" name="returnTo" value="/admin/places" />

        <label className="space-y-2">
          <span className="text-sm font-medium text-foreground/75">Name</span>
          <input
            name="name"
            value={formValues.name}
            onChange={(event) => handleNameChange(event.target.value)}
            className="h-11 w-full rounded-xl border border-foreground/10 bg-white px-3 text-sm outline-none transition focus:border-brand"
            placeholder="Canal House"
          />
          <FieldError message={state.fieldErrors?.name} />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-foreground/75">Slug</span>
          <input
            name="slug"
            value={formValues.slug}
            onChange={(event) => handleSlugChange(event.target.value)}
            className="h-11 w-full rounded-xl border border-foreground/10 bg-white px-3 text-sm outline-none transition focus:border-brand"
            placeholder="canal-house"
          />
          <p className="text-xs leading-5 text-foreground/55">
            Example: <span className="font-medium">canal-house-mile-end</span> — auto-generated from name, editable manually.
          </p>
          <FieldError message={state.fieldErrors?.slug} />
        </label>

        <label className="space-y-2 lg:col-span-2">
          <span className="text-sm font-medium text-foreground/75">Short description</span>
          <input
            name="shortDescription"
            value={formValues.shortDescription}
            onChange={(event) => updateField("shortDescription", event.target.value)}
            className="h-11 w-full rounded-xl border border-foreground/10 bg-white px-3 text-sm outline-none transition focus:border-brand"
            placeholder="A concise summary for cards and search results."
          />
          <FieldError message={state.fieldErrors?.shortDescription} />
        </label>

        <label className="space-y-2 lg:col-span-2">
          <span className="text-sm font-medium text-foreground/75">Description</span>
          <textarea
            name="description"
            rows={6}
            value={formValues.description}
            onChange={(event) => updateField("description", event.target.value)}
            className="w-full rounded-2xl border border-foreground/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand"
            placeholder="Longer editorial description for the place detail page."
          />
          <FieldError message={state.fieldErrors?.description} />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-foreground/75">City</span>
          <input
            name="city"
            value={formValues.city}
            onChange={(event) => updateField("city", event.target.value)}
            className="h-11 w-full rounded-xl border border-foreground/10 bg-white px-3 text-sm outline-none transition focus:border-brand"
            placeholder="Montreal"
          />
          <FieldError message={state.fieldErrors?.city} />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-foreground/75">Country</span>
          <input
            name="country"
            value={formValues.country}
            onChange={(event) => updateField("country", event.target.value)}
            className="h-11 w-full rounded-xl border border-foreground/10 bg-white px-3 text-sm outline-none transition focus:border-brand"
          />
          <FieldError message={state.fieldErrors?.country} />
        </label>

        <label className="space-y-2 lg:col-span-2">
          <span className="text-sm font-medium text-foreground/75">Address</span>
          <input
            name="address"
            value={formValues.address}
            onChange={(event) => updateField("address", event.target.value)}
            className="h-11 w-full rounded-xl border border-foreground/10 bg-white px-3 text-sm outline-none transition focus:border-brand"
            placeholder="127 Saint-Ambroise Street"
          />
          <FieldError message={state.fieldErrors?.address} />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-foreground/75">Price tier</span>
          <select
            name="priceTier"
            value={formValues.priceTier}
            onChange={(event) => updateField("priceTier", event.target.value as PriceTier)}
            className="h-11 w-full rounded-xl border border-foreground/10 bg-white px-3 text-sm outline-none transition focus:border-brand"
          >
            {priceTierOptions.map((priceTier) => (
              <option key={priceTier} value={priceTier}>
                {priceTier}
              </option>
            ))}
          </select>
          <FieldError message={state.fieldErrors?.priceTier} />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-foreground/75">Cover image URL</span>
          <input
            name="coverImageUrl"
            value={formValues.coverImageUrl}
            onChange={(event) => updateField("coverImageUrl", event.target.value)}
            className="h-11 w-full rounded-xl border border-foreground/10 bg-white px-3 text-sm outline-none transition focus:border-brand"
            placeholder="https://images.unsplash.com/..."
          />
          <FieldError message={state.fieldErrors?.coverImageUrl} />
        </label>

        <label className="space-y-2 lg:col-span-2">
          <span className="text-sm font-medium text-foreground/75">Tags</span>
          <input
            name="tags"
            value={formValues.tags}
            onChange={(event) => updateField("tags", event.target.value)}
            className="h-11 w-full rounded-xl border border-foreground/10 bg-white px-3 text-sm outline-none transition focus:border-brand"
            placeholder="coffee, design-led, all-day"
          />
          <FieldError message={state.fieldErrors?.tags} />
        </label>

        <label className="flex items-center gap-3 rounded-2xl border border-foreground/10 bg-brand-soft/35 px-4 py-3 lg:col-span-2">
          <input
            type="checkbox"
            name="isOpenNow"
            checked={formValues.isOpenNow}
            onChange={(event) => updateField("isOpenNow", event.target.checked)}
            className="h-4 w-4 accent-[var(--brand)]"
          />
          <span className="text-sm text-foreground/75">Mark as currently open</span>
        </label>

        <fieldset className="space-y-3 lg:col-span-2">
          <legend className="text-sm font-medium text-foreground/75">Categories</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            {categories.map((category) => (
              <label
                key={category.id}
                className="flex items-start gap-3 rounded-2xl border border-foreground/10 bg-white px-4 py-3"
              >
                <input
                  type="checkbox"
                  name="categoryIds"
                  value={category.id}
                  checked={formValues.categoryIds.includes(category.id)}
                  onChange={(event) => handleCategoryToggle(category.id, event.target.checked)}
                  className="mt-1 h-4 w-4 accent-[var(--brand)]"
                />
                <span className="space-y-1">
                  <span className="block text-sm font-medium">{category.name}</span>
                  {category.description ? (
                    <span className="block text-xs leading-5 text-foreground/55">{category.description}</span>
                  ) : null}
                </span>
              </label>
            ))}
          </div>
          <FieldError message={state.fieldErrors?.categoryIds} />
        </fieldset>

        <div className="flex flex-wrap items-center gap-3 lg:col-span-2">
          <Button type="submit">Create place</Button>
          {state.slug ? (
            <Link
              href={`/places/${state.slug}`}
              className={cn(buttonVariants({ variant: "ghost" }), "border border-foreground/10 bg-white")}
            >
              View created place
            </Link>
          ) : null}
        </div>
      </form>
    </div>
  );
}
