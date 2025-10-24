import { supabaseAdmin } from "@/lib/supabase";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DeleteSocialButton } from "./delete-button";
import { ExternalLink } from "lucide-react";

export default async function SocialsPage() {
  const { data: socials } = await supabaseAdmin
    .from("SocialMedia")
    .select("*")
    .order("order");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Social Media</h1>
          <p className="text-gray-600 mt-1">Manage your social media links</p>
        </div>
        <Link href="/admin/socials/new">
          <Button>Add Social Media</Button>
        </Link>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Icon</TableHead>
              <TableHead>URL</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!socials || socials.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-gray-500">
                  No social media links yet
                </TableCell>
              </TableRow>
            ) : (
              socials.map((social) => (
                <TableRow key={social.id}>
                  <TableCell className="font-medium">{social.order}</TableCell>
                  <TableCell>{social.name}</TableCell>
                  <TableCell>
                    <code className="px-2 py-1 bg-gray-100 rounded text-sm">
                      {social.icon}
                    </code>
                  </TableCell>
                  <TableCell>
                    <a
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center gap-1"
                    >
                      {social.url.substring(0, 40)}
                      {social.url.length > 40 && "..."}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Link href={`/admin/socials/${social.id}/edit`}>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </Link>
                    <DeleteSocialButton id={social.id} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
