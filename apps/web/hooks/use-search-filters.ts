"use client";

import { useState } from "react";

import { type SearchFiltersState } from "@/types/domain";

export function useSearchFilters(initialFilters: SearchFiltersState) {
  const [filters, setFilters] = useState<SearchFiltersState>(initialFilters);

  function setField<Key extends keyof SearchFiltersState>(field: Key, value: SearchFiltersState[Key]) {
    setFilters((current) => ({
      ...current,
      [field]: value
    }));
  }

  function toggleOpenNow() {
    setFilters((current) => ({
      ...current,
      openNow: !current.openNow
    }));
  }

  return {
    filters,
    setField,
    toggleOpenNow
  };
}
