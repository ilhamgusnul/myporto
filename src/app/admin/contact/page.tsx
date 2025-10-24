import { supabaseAdmin } from "@/lib/supabase";
import { updateContact } from "./actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/admin/submit-button";

export default async function ContactPage() {
  const { data: contact } = await supabaseAdmin
    .from("ContactInfo")
    .select("*")
    .limit(1)
    .single();

  if (!contact) {
    return (
      <div className="max-w-2xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Contact Info</h1>
          <p className="text-muted-foreground mt-1">Edit contact information</p>
        </div>
        <div className="bg-white p-6 rounded-lg border">
          <p className="text-muted-foreground">
            No contact info found. Please create one from the database.
          </p>
        </div>
      </div>
    );
  }

  const updateWithId = updateContact.bind(null, contact.id);

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Contact Info</h1>
        <p className="text-muted-foreground mt-1">Edit contact information</p>
      </div>

      <form action={updateWithId} className="bg-white p-6 rounded-lg border space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            defaultValue={contact.email || ""}
            placeholder="your@email.com"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            defaultValue={contact.phone || ""}
            placeholder="+62812345678"
          />
          <p className="text-xs text-muted-foreground">
            Include country code (e.g., +62)
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            name="location"
            defaultValue={contact.location || ""}
            placeholder="Jakarta, Indonesia"
          />
        </div>

        <div className="flex gap-2 pt-4">
          <SubmitButton>Save Changes</SubmitButton>
        </div>
      </form>
    </div>
  );
}
