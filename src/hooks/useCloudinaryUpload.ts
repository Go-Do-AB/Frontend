"use client";
import { useState, useCallback } from "react";
import { api } from "@/lib/axios";

const MAX_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

type UploadTokenResponse = {
  signature: string;
  timestamp: number;
  apiKey: string;
  cloudName: string;
  folder?: string;
};

export function useCloudinaryUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = async (file: File): Promise<string | null> => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Only JPEG, PNG, or WebP images are allowed.");
      return null;
    }
    if (file.size > MAX_SIZE) {
      setError("File size must be 5 MB or less.");
      return null;
    }

    setError(null);
    setIsUploading(true);

    try {
      const tokenRes = await api.post<{ data: UploadTokenResponse }>("/spotlight/upload-token");
      const { signature, timestamp, apiKey, cloudName, folder } = tokenRes.data.data;

      const formData = new FormData();
      formData.append("file", file);
      formData.append("signature", signature);
      formData.append("timestamp", String(timestamp));
      formData.append("api_key", apiKey);
      if (folder) formData.append("folder", folder);

      const cloudRes = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: "POST", body: formData }
      );

      if (!cloudRes.ok) throw new Error("Cloudinary upload failed.");

      const cloudData = await cloudRes.json();
      const url: string = cloudData.secure_url;
      return url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed. Please try again.");
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const reset = useCallback(() => {
    setError(null);
  }, []);

  return { upload, isUploading, error, reset };
}
