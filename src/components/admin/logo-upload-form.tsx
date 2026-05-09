"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUpload from "@/components/admin/image-upload";
import { SubmitButton } from "@/components/admin/submit-button";
import { Button } from "@/components/ui/button";
import { Trash2, ImageIcon, CheckCircle2 } from "lucide-react";

interface LogoUploadFormProps {
  aboutId: string;
  currentLogoUrl: string | null;
  updateLogoAction: (id: string, formData: FormData) => Promise<void>;
  removeLogoAction: (id: string) => Promise<void>;
}

export function LogoUploadForm({
  aboutId,
  currentLogoUrl,
  updateLogoAction,
  removeLogoAction,
}: LogoUploadFormProps) {
  const [removing, setRemoving] = useState(false);
  const router = useRouter();

  const boundUpdate = updateLogoAction.bind(null, aboutId);

  async function handleRemove() {
    if (!confirm("Hapus logo? Navbar akan kembali menampilkan badge default.")) return;
    setRemoving(true);
    try {
      await removeLogoAction(aboutId);
      router.refresh();
    } finally {
      setRemoving(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Current Logo Preview */}
      {currentLogoUrl && (
        <div className="flex items-start gap-4 p-4 bg-green-50 border border-green-200 rounded-xl">
          <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-green-800 mb-2">Logo aktif</p>
            <div className="bg-white border border-green-200 rounded-lg p-3 inline-block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={currentLogoUrl}
                alt="Logo saat ini"
                className="h-10 w-auto object-contain max-w-[160px]"
              />
            </div>
            <p className="text-xs text-green-600 mt-2 break-all">{currentLogoUrl}</p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleRemove}
            disabled={removing}
            className="text-red-500 hover:text-red-700 hover:bg-red-50 shrink-0"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            {removing ? "Menghapus..." : "Hapus"}
          </Button>
        </div>
      )}

      {/* Info when no logo */}
      {!currentLogoUrl && (
        <div className="flex items-start gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl">
          <ImageIcon className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium text-slate-700">Belum ada logo</p>
            <p className="text-xs text-slate-500 mt-0.5">
              Navbar kiri saat ini menampilkan badge <strong>&quot;Available for New Project&quot;</strong>.
              Upload logo untuk menggantikannya.
            </p>
          </div>
        </div>
      )}

      {/* Upload Form */}
      <form action={boundUpdate} className="space-y-4">
        <ImageUpload
          name="logoUrl"
          label={currentLogoUrl ? "Ganti Logo (PNG transparan direkomendasikan)" : "Upload Logo"}
          defaultUrl=""
          required={false}
        />

        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 space-y-1.5">
          <p className="text-xs font-bold text-blue-800 uppercase tracking-wide">
            🖼️ Tips Logo
          </p>
          <ul className="text-xs text-blue-700 space-y-1 list-disc list-inside">
            <li>Gunakan format <strong>PNG dengan background transparan</strong></li>
            <li>Tinggi optimal <strong>40–60px</strong> (horizontal/landscape)</li>
            <li>Logo akan otomatis digunakan sebagai <strong>favicon</strong> browser tab</li>
            <li>Jika tidak upload logo, badge &quot;Available for New Project&quot; tetap tampil</li>
          </ul>
        </div>

        <div className="flex gap-2 pt-2">
          <SubmitButton>
            {currentLogoUrl ? "Perbarui Logo" : "Simpan Logo"}
          </SubmitButton>
        </div>
      </form>
    </div>
  );
}
