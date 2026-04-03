import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";

export default function NotFound() {
  return (
    <div className="shell flex min-h-[70vh] items-center justify-center py-12">
      <Card className="w-full max-w-xl rounded-[2rem] border-foreground/10 bg-white/75">
        <CardContent className="space-y-5 p-8">
          <p className="text-sm uppercase tracking-[0.22em] text-foreground/50">404</p>
          <CardTitle>That place is not in the current build set.</CardTitle>
          <CardDescription>
            The route exists, but the requested content was not found in the current mock or seeded dataset.
          </CardDescription>
          <Link href="/search" className={buttonVariants({ variant: "primary" })}>
            Return to search
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
