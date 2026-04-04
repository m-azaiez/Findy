import { Notice } from "@/components/ui/notice";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { requireUser } from "@/services/auth.service";
import { readFirstSearchParam, type SearchParamsRecord } from "@findy/shared/utils/url";

const dashboardStats = [
  { label: "Saved places", value: "12" },
  { label: "Published reviews", value: "4" },
  { label: "Cities explored", value: "3" }
];

type DashboardPageProps = {
  searchParams?: Promise<SearchParamsRecord>;
};

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  await requireUser("/dashboard");
  const resolvedSearchParams = (searchParams ? await searchParams : undefined) ?? {};
  const error = readFirstSearchParam(resolvedSearchParams.error);

  return (
    <div className="space-y-5">
      {error ? <Notice tone="error">{error}</Notice> : null}
      <div className="grid gap-5 lg:grid-cols-3">
        {dashboardStats.map((stat) => (
          <Card key={stat.label} className="rounded-[1.5rem] border-foreground/10 bg-white/75">
            <CardContent className="space-y-2 p-6">
              <p className="text-sm text-foreground/60">{stat.label}</p>
              <CardTitle className="text-3xl">{stat.value}</CardTitle>
              <CardDescription>Mocked for now, ready to become user-specific data.</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
