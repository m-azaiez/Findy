import type { Metadata } from "next";
import Script from "next/script";

import { QueryProvider } from "@/components/providers/query-provider";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

import "./globals.css";

export const metadata: Metadata = {
  title: "Findy",
  description: "Mobile-first discovery for places worth saving."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <body>
        <Script id="theme-sync" strategy="beforeInteractive">
          {`
            (() => {
              const root = document.documentElement;
              const media = window.matchMedia("(prefers-color-scheme: dark)");

              const applyTheme = () => {
                const theme = media.matches ? "dark" : "light";
                root.dataset.theme = theme;
                root.style.colorScheme = theme;
              };

              applyTheme();

              if (typeof media.addEventListener === "function") {
                media.addEventListener("change", applyTheme);
              } else if (typeof media.addListener === "function") {
                media.addListener(applyTheme);
              }
            })();
          `}
        </Script>
        <QueryProvider>
          <div className="relative flex min-h-screen flex-col">
            <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[32rem] bg-hero-grid" />
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </div>
        </QueryProvider>
      </body>
    </html>
  );
}
