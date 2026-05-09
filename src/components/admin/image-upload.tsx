"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X, Loader2 } from "lucide-react";

interface ImageUploadProps {
  defaultUrl?: string;
  name?: string;
  label?: string;
  required?: boolean;
}

export default function ImageUpload({
  defaultUrl = "",
  name = "imageUrl",
  label = "Image",
  required = false,
}: ImageUploadProps) {
  const [url, setUrl] = useState(defaultUrl);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");

    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
    if (!validTypes.includes(file.type)) {
      setError("Invalid file type. Only JPEG, PNG, WebP, GIF, and SVG are allowed.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("File too large. Maximum size is 5MB.");
      return;
    }

    setUploading(true);

    // SVG: baca sebagai base64 data URL di sisi client
    // (Supabase Storage menolak image/svg+xml, jadi kita simpan langsung sebagai data URL)
    if (file.type === "image/svg+xml") {
      try {
        const dataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = () => reject(new Error("Gagal membaca file SVG"));
          reader.readAsDataURL(file);
        });
        setUrl(dataUrl);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Gagal membaca SVG");
      } finally {
        setUploading(false);
      }
      return;
    }

    // Non-SVG: upload ke Supabase Storage seperti biasa
    try {
      const formData = new FormData();
      formData.set("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Upload failed");
      }

      const data = await response.json();
      setUrl(data.url);
    } catch (err) {
      console.error("Upload error:", err);
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  function handleRemove() {
    setUrl("");
    setError("");
  }

  return (
    <div className="grid gap-3">
      <Label htmlFor={`${name}-upload`}>
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>

      {/* Hidden input to store URL */}
      <input type="hidden" name={name} value={url} required={required && !url} />

      {/* Preview */}
      {url && (
        <div className="space-y-2">
          <div className="relative w-full max-w-md">
            <div className="relative w-full aspect-video rounded-lg overflow-hidden border-2 border-gray-200 bg-gray-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt="Preview"
                className="w-full h-full object-contain"
                onError={(e) => {
                  console.error("Image load error:", url);
                  e.currentTarget.style.display = 'none';
                  const parent = e.currentTarget.parentElement;
                  if (parent && !parent.querySelector('.error-placeholder')) {
                    const placeholder = document.createElement('div');
                    placeholder.className = 'error-placeholder w-full h-full flex items-center justify-center text-gray-400';
                    placeholder.innerHTML = '<div class="text-center"><p class="text-sm">Image load error</p><p class="text-xs mt-1">URL: ' + url.substring(0, 50) + '...</p></div>';
                    parent.appendChild(placeholder);
                  }
                }}
              />
            </div>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute -top-2 -right-2 shadow-lg rounded-full"
              onClick={handleRemove}
              disabled={uploading}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-gray-500 break-all">
            {url.startsWith("data:") ? "SVG (disimpan sebagai data URL)" : url}
          </p>
        </div>
      )}

      {/* Upload Button */}
      {!url && (
        <div className="flex items-center gap-3">
          <Input
            id={`${name}-upload`}
            type="file"
            accept="image/*,.svg"
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
          />
          <Label
            htmlFor={`${name}-upload`}
            className="cursor-pointer"
          >
            <Button
              type="button"
              variant="outline"
              disabled={uploading}
              asChild
            >
              <span>
                {uploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {uploading ? "Memproses..." : ""}
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Image
                  </>
                )}
              </span>
            </Button>
          </Label>
          <span className="text-xs text-muted-foreground">
            Max 5MB • JPEG, PNG, WebP, GIF, SVG
          </span>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      {/* Upload Progress */}
      {uploading && (
        <div className="text-sm text-muted-foreground">
          Memproses file...
        </div>
      )}
    </div>
  );
}
