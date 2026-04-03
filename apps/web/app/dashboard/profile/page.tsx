import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { requireUser } from "@/services/auth.service";

export default async function ProfilePage() {
  await requireUser("/dashboard/profile");

  return (
    <Card className="max-w-3xl rounded-[1.75rem] border-foreground/10 bg-white/75">
      <CardContent className="space-y-6 p-6">
        <div className="space-y-2">
          <CardTitle>Profile basics</CardTitle>
          <CardDescription>
            This form is the natural target for the future `profiles` table updates.
          </CardDescription>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input placeholder="Full name" defaultValue="Nora Tremblay" />
          <Input placeholder="City" defaultValue="Montreal" />
          <Input type="email" placeholder="Email" defaultValue="nora@example.com" className="sm:col-span-2" />
        </div>
      </CardContent>
    </Card>
  );
}
