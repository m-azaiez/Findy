import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { featuredCategories } from "@/lib/constants/mock-data";

export default function AdminCategoriesPage() {
  return (
    <Card className="rounded-[1.75rem] border-foreground/10 bg-white/75">
      <CardContent className="space-y-4 p-6">
        <div className="space-y-2">
          <CardTitle>Category taxonomy</CardTitle>
          <CardDescription>
            The schema already supports many-to-many place categorisation.
          </CardDescription>
        </div>
        <div className="flex flex-wrap gap-2">
          {featuredCategories.map((category) => (
            <Badge key={category.id}>{category.name}</Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
