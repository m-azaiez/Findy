import "server-only";

import { headers } from "next/headers";

import { siteUrl } from "@/lib/supabase/env";

export async function getSiteUrl() {
  if (siteUrl) {
    return siteUrl.replace(/\/$/, "");
  }

  const headerList = await headers();
  const origin = headerList.get("origin");

  if (origin) {
    return origin.replace(/\/$/, "");
  }

  const host = headerList.get("x-forwarded-host") ?? headerList.get("host");
  const protocol = headerList.get("x-forwarded-proto") ?? (host?.includes("localhost") ? "http" : "https");

  if (host) {
    return `${protocol}://${host}`.replace(/\/$/, "");
  }

  return "http://localhost:3000";
}
