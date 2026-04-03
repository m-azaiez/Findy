export type SearchParamsRecord = Record<string, string | string[] | undefined>;

export function readFirstSearchParam(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

export function sanitizeRedirectPath(value?: string | null, fallback = "/dashboard") {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return fallback;
  }

  return value;
}

export function withQuery(pathname: string, params: Record<string, string | undefined>) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      searchParams.set(key, value);
    }
  });

  const query = searchParams.toString();

  return query ? `${pathname}?${query}` : pathname;
}
