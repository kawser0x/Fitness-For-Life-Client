"use client";

import React, { useState } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import { FaCloudArrowUp, FaImage, FaSpinner, FaTrash, FaLink, FaTriangleExclamation } from "react-icons/fa6";

export default function ImgBBUpload({
  value,
  onChange,
  label = "Featured Image (ImgBB Upload)",
  required = false,
}) {
  const [uploading, setUploading] = useState(false);
  const [useUrlInput, setUseUrlInput] = useState(false);
  const [urlWarning, setUrlWarning] = useState("");

  const IMGBB_API_KEY =
    process.env.NEXT_PUBLIC_IMGBB_API_KEY || "c3f15c7e0c46645367b1297e68e4c029";

  // Upload file directly to ImgBB API
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file (PNG, JPG, WEBP)");
      return;
    }

    try {
      setUploading(true);
      setUrlWarning("");
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();

      if (result.success) {
        // ImgBB API returns direct image URL in data.display_url or data.url
        const directImageUrl = result.data.display_url || result.data.url;
        onChange(directImageUrl);
        toast.success("Image file uploaded successfully to ImgBB!");
      } else {
        throw new Error(result.error?.message || "ImgBB upload failed");
      }
    } catch (error) {
      console.error("ImgBB Upload Error:", error);
      toast.error(error.message || "Failed to upload image to ImgBB");
    } finally {
      setUploading(false);
    }
  };

  // Validate manual URL input
  const handleUrlChange = (inputUrl) => {
    onChange(inputUrl);
    
    // Detect ImgBB webpage links vs direct image links
    if (
      (inputUrl.includes("ibb.co/") || inputUrl.includes("ibb.co.com/")) &&
      !inputUrl.includes("i.ibb.co")
    ) {
      setUrlWarning(
        "Warning: This is an ImgBB webpage link (HTML), not a direct image URL. Please use the 'Click to upload image file' button above for automatic ImgBB hosting!"
      );
    } else {
      setUrlWarning("");
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
          <FaImage className="h-3.5 w-3.5 text-cyan-500" />
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
        <button
          type="button"
          onClick={() => {
            setUseUrlInput(!useUrlInput);
            setUrlWarning("");
          }}
          className="text-[11px] font-semibold text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1">
          <FaLink className="h-3 w-3" />
          {useUrlInput ? "Switch to File Upload" : "Paste Image URL Direct"}
        </button>
      </div>

      {value ? (
        /* Image Preview Box */
        <div className="relative rounded-2xl overflow-hidden border border-border bg-accent/30 p-3 flex flex-col gap-2">
          <div className="flex items-center gap-4">
            <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-accent border border-border shrink-0">
              <Image
                src={value}
                alt="Uploaded Preview"
                fill
                className="object-cover"
                unoptimized
                onError={(e) => {
                  toast.error("Image failed to load. Please ensure it is a direct image URL.");
                }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-foreground truncate">{value}</p>
              <span className="inline-block mt-1.5 px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                ✓ Image Linked
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                onChange("");
                setUrlWarning("");
              }}
              className="p-2.5 rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition shrink-0"
              title="Remove Image">
              <FaTrash className="h-4 w-4" />
            </button>
          </div>

          {urlWarning && (
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs flex items-start gap-2">
              <FaTriangleExclamation className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{urlWarning}</span>
            </div>
          )}
        </div>
      ) : useUrlInput ? (
        /* Direct URL Input */
        <div className="space-y-2">
          <input
            type="url"
            required={required}
            value={value || ""}
            onChange={(e) => handleUrlChange(e.target.value)}
            placeholder="https://i.ibb.co.com/example/image.jpg"
            className="w-full px-4 py-2.5 rounded-xl border border-border text-foreground text-sm focus:outline-none focus:border-cyan-500 transition"
          />
          {urlWarning && (
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs flex items-start gap-2">
              <FaTriangleExclamation className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{urlWarning}</span>
            </div>
          )}
        </div>
      ) : (
        /* Drag & Drop / File Input Box */
        <label className="relative flex flex-col items-center justify-center p-6 border-2 border-dashed border-border hover:border-cyan-500/50 bg-card hover:bg-accent/30 rounded-2xl cursor-pointer transition text-center group">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            disabled={uploading}
            className="hidden"
          />
          {uploading ? (
            <div className="flex flex-col items-center gap-2 text-cyan-500">
              <FaSpinner className="h-8 w-8 animate-spin" />
              <span className="text-xs font-bold">Uploading file to ImgBB...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                <FaCloudArrowUp className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-foreground">
                  Click to upload image file
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Select PNG, JPG, or WEBP file to upload directly to ImgBB
                </p>
              </div>
            </div>
          )}
        </label>
      )}
    </div>
  );
}
