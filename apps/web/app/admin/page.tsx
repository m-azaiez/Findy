import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";

const adminCards = [
  {
    title: "Places",
    description: "Create, edit, and retire listings from a single moderated surface."
  },
  {
    title: "Categories",
    description: "Keep taxonomy clean while search and discovery logic grows."
  },
  {
    title: "Reviews",
    description: "Moderation routes are defined before user-generated content goes live."
  }
];

export default function AdminPage() {
  return (
    <div className="grid gap-5 lg:grid-cols-3">
      {adminCards.map((card) => (
        <Card key={card.title} className="rounded-[1.5rem] border-foreground/10 bg-white/75">
          <CardContent className="space-y-3 p-6">
            <CardTitle>{card.title}</CardTitle>
            <CardDescription>{card.description}</CardDescription>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
