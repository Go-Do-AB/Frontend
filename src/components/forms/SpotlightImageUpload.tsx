// src/components/forms/SpotlightImageUpload.tsx
// Optional spotlight banner image upload for the event form.
// NOTE: This only uploads the image — spotlight placement itself is purchased
// via Stripe from "Mina evenemang" (SpotlightPurchaseDialog).
import * as React from "react";
import { useFormContext } from "react-hook-form";
import { Upload, X, ImageIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useCloudinaryUpload } from "@/hooks/useCloudinaryUpload";

import type { FormData } from "@/hooks/useEventForm";

export function SpotlightImageUpload() {
  const { watch, setValue } = useFormContext<FormData>();
  const spotlightImageUrl = watch("spotlightImageUrl");

  const { upload, isUploading, error: uploadError, reset: resetUpload } = useCloudinaryUpload();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = async (file: File | null) => {
    if (!file) return;
    const url = await upload(file);
    if (url) setValue("spotlightImageUrl", url, { shouldDirty: true });
  };

  const handleRemove = () => {
    setValue("spotlightImageUrl", "", { shouldDirty: true });
    resetUpload();
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="space-y-2">
      <Label className="py-2 block">Spotlightbild (valfritt)</Label>
      <p className="text-xs text-muted-foreground">
        Bilden visas om du köper en spotlightplacering. Själva placeringen köper du
        under &quot;Mina evenemang&quot; efter att evenemanget har skapats.
      </p>

      {spotlightImageUrl ? (
        <div className="relative">
          <div className="relative w-full aspect-video rounded-xl overflow-hidden border bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={spotlightImageUrl}
              alt="Spotlight banner"
              className="w-full h-full object-cover"
            />
          </div>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="mt-2"
            onClick={handleRemove}
          >
            <X className="mr-1 h-3 w-3" />
            Ta bort / Ersätt
          </Button>
        </div>
      ) : (
        <div
          className={cn(
            "flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-8 text-center cursor-pointer transition-colors",
            "hover:border-yellow-400 hover:bg-yellow-50/30",
            isUploading && "pointer-events-none opacity-60"
          )}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            handleFileChange(e.dataTransfer.files[0] ?? null);
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
          />
          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-yellow-400 border-t-transparent" />
              <span className="text-sm text-muted-foreground">Laddar upp…</span>
            </div>
          ) : (
            <>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                {uploadError ? (
                  <ImageIcon className="h-5 w-5 text-destructive" />
                ) : (
                  <Upload className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
              <p className="text-sm font-medium">
                Dra och släpp eller klicka för att ladda upp
              </p>
              <p className="text-xs text-muted-foreground">JPEG, PNG eller WebP · max 5 MB</p>
            </>
          )}
        </div>
      )}

      {uploadError && <p className="text-sm text-destructive">{uploadError}</p>}
    </div>
  );
}
