"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Check,
  Crop as CropIcon,
  RefreshCcw,
  Sparkles,
  Layers,
  Image as ImageIcon
} from "lucide-react";

export type AspectRatioType = "16:9" | "4:3" | "4:5" | "1:1" | "free";

interface ImageCropModalProps {
  isOpen: boolean;
  imageSrc: string | null;
  title?: string;
  defaultAspectRatio?: AspectRatioType;
  onClose: () => void;
  onCropComplete: (uploadedUrl: string) => void;
}

export default function ImageCropModal({
  isOpen,
  imageSrc,
  title = "Crop & Frame Image",
  defaultAspectRatio = "16:9",
  onClose,
  onCropComplete
}: ImageCropModalProps) {
  const [aspectRatio, setAspectRatio] = useState<AspectRatioType>(defaultAspectRatio);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0); // 0, 90, 180, 270
  const [offset, setOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [previewDataUrl, setPreviewDataUrl] = useState<string | null>(null);

  const imageRef = useRef<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Sync aspect ratio prop
  useEffect(() => {
    if (defaultAspectRatio) {
      setAspectRatio(defaultAspectRatio);
    }
  }, [defaultAspectRatio]);

  // Reset transform state when new image arrives
  useEffect(() => {
    if (imageSrc) {
      const img = new window.Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        imageRef.current = img;
        setZoom(1);
        setRotation(0);
        setOffset({ x: 0, y: 0 });
      };
      img.src = imageSrc;
    }
  }, [imageSrc]);

  // Helper to calculate target aspect ratio ratio number
  const getRatioNum = useCallback((): number => {
    if (aspectRatio === "16:9") return 16 / 9;
    if (aspectRatio === "4:3") return 4 / 3;
    if (aspectRatio === "4:5") return 4 / 5;
    if (aspectRatio === "1:1") return 1;
    if (imageRef.current && imageRef.current.naturalWidth && imageRef.current.naturalHeight) {
      return imageRef.current.naturalWidth / imageRef.current.naturalHeight;
    }
    return 16 / 9;
  }, [aspectRatio]);

  // Draw main viewport and live preview canvas
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!canvas || !img || !img.naturalWidth) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cw = canvas.width;
    const ch = canvas.height;

    ctx.clearRect(0, 0, cw, ch);

    // Dark backdrop for viewport
    ctx.fillStyle = "#160f0f";
    ctx.fillRect(0, 0, cw, ch);

    // Calculate crop target frame dimensions inside viewport
    const targetRatio = getRatioNum();
    const padding = 28;
    const maxBoxW = cw - padding * 2;
    const maxBoxH = ch - padding * 2;

    let boxW = maxBoxW;
    let boxH = boxW / targetRatio;

    if (boxH > maxBoxH) {
      boxH = maxBoxH;
      boxW = boxH * targetRatio;
    }

    const boxX = (cw - boxW) / 2;
    const boxY = (ch - boxH) / 2;

    // Draw the source image with zoom, rotation, and offset
    ctx.save();

    // Clip to viewport center area or draw full, then overlay dark mask outside box
    ctx.translate(cw / 2 + offset.x, ch / 2 + offset.y);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(zoom, zoom);

    // Determine scale to fill box at zoom = 1
    const isRotated90 = rotation % 180 !== 0;
    const naturalW = isRotated90 ? img.naturalHeight : img.naturalWidth;
    const naturalH = isRotated90 ? img.naturalWidth : img.naturalHeight;

    const baseScale = Math.max(boxW / naturalW, boxH / naturalH);
    const renderW = img.naturalWidth * baseScale;
    const renderH = img.naturalHeight * baseScale;

    ctx.drawImage(img, -renderW / 2, -renderH / 2, renderW, renderH);
    ctx.restore();

    // Draw darkened mask outside the active crop box
    ctx.fillStyle = "rgba(10, 6, 6, 0.72)";
    // Top
    ctx.fillRect(0, 0, cw, boxY);
    // Bottom
    ctx.fillRect(0, boxY + boxH, cw, ch - (boxY + boxH));
    // Left
    ctx.fillRect(0, boxY, boxX, boxH);
    // Right
    ctx.fillRect(boxX + boxW, boxY, cw - (boxX + boxW), boxH);

    // Draw Gold Frame border around crop box
    ctx.strokeStyle = "#C8955F";
    ctx.lineWidth = 2;
    ctx.strokeRect(boxX, boxY, boxW, boxH);

    // Draw Rule of Thirds subtle guidelines inside crop box
    ctx.strokeStyle = "rgba(200, 149, 95, 0.35)";
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);

    ctx.beginPath();
    // Vertical guidelines
    ctx.moveTo(boxX + boxW / 3, boxY);
    ctx.lineTo(boxX + boxW / 3, boxY + boxH);
    ctx.moveTo(boxX + (boxW * 2) / 3, boxY);
    ctx.lineTo(boxX + (boxW * 2) / 3, boxY + boxH);
    // Horizontal guidelines
    ctx.moveTo(boxX, boxY + boxH / 3);
    ctx.lineTo(boxX + boxW, boxY + boxH / 3);
    ctx.moveTo(boxX, boxY + (boxH * 2) / 3);
    ctx.lineTo(boxX + boxW, boxY + (boxH * 2) / 3);
    ctx.stroke();
    ctx.setLineDash([]);

    // --- Render Live Preview Canvas (the cropped result) ---
    const prevCanvas = previewCanvasRef.current;
    if (prevCanvas) {
      const prevCtx = prevCanvas.getContext("2d");
      if (prevCtx) {
        prevCtx.clearRect(0, 0, prevCanvas.width, prevCanvas.height);
        prevCtx.drawImage(
          canvas,
          boxX,
          boxY,
          boxW,
          boxH,
          0,
          0,
          prevCanvas.width,
          prevCanvas.height
        );
        try {
          const dataUrl = prevCanvas.toDataURL("image/jpeg", 0.9);
          setPreviewDataUrl(dataUrl);
        } catch {}
      }
    }
  }, [getRatioNum, offset, rotation, zoom]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas, imageSrc]);

  // Pointer drag event handlers for panning
  const handlePointerDown = (clientX: number, clientY: number) => {
    setIsDragging(true);
    setDragStart({ x: clientX - offset.x, y: clientY - offset.y });
  };

  const handlePointerMove = (clientX: number, clientY: number) => {
    if (!isDragging) return;
    setOffset({
      x: clientX - dragStart.x,
      y: clientY - dragStart.y
    });
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  // Perform Final High-Res Crop and upload to /api/portal/upload
  const handleCropAndUpload = async () => {
    const img = imageRef.current;
    if (!img || !img.naturalWidth) return;

    setUploading(true);
    try {
      const targetRatio = getRatioNum();
      const outputW = 1200;
      const outputH = Math.round(outputW / targetRatio);

      const offscreen = document.createElement("canvas");
      offscreen.width = outputW;
      offscreen.height = outputH;
      const oCtx = offscreen.getContext("2d");

      if (!oCtx) throw new Error("Could not create offscreen canvas");

      // Draw the cropped result with current transform mapping
      const canvas = canvasRef.current;
      if (!canvas) throw new Error("Canvas not ready");

      const cw = canvas.width;
      const ch = canvas.height;
      const padding = 28;
      const maxBoxW = cw - padding * 2;
      const maxBoxH = ch - padding * 2;

      let boxW = maxBoxW;
      let boxH = boxW / targetRatio;
      if (boxH > maxBoxH) {
        boxH = maxBoxH;
        boxW = boxH * targetRatio;
      }
      const boxX = (cw - boxW) / 2;
      const boxY = (ch - boxH) / 2;

      // Draw exact cropped portion onto offscreen canvas
      oCtx.drawImage(canvas, boxX, boxY, boxW, boxH, 0, 0, outputW, outputH);

      // Convert offscreen canvas to Blob
      const blob = await new Promise<Blob | null>((resolve) => {
        offscreen.toBlob((b) => resolve(b), "image/jpeg", 0.92);
      });

      if (!blob) throw new Error("Failed to generate cropped image blob");

      const fileName = `cropped_${Date.now()}.jpg`;
      const file = new File([blob], fileName, { type: "image/jpeg" });

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/portal/upload", {
        method: "POST",
        body: formData
      });

      const data = await res.json();
      if (data.success && data.url) {
        onCropComplete(data.url);
        onClose();
      } else {
        setUploadError(data.error || "Failed to upload cropped image.");
      }
    } catch (err) {
      console.error("Cropping error:", err);
      setUploadError("Failed to crop and upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen || !imageSrc) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-2 xs:p-3 sm:p-5">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#140D0D]/90 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-2xl bg-[#241A1A] border border-cappuccino/40 rounded-2xl sm:rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.6)] text-white overflow-hidden flex flex-col max-h-[92dvh] sm:max-h-[90vh]"
        >
          {/* Top Header */}
          <div className="px-3.5 py-3 sm:px-5 sm:py-4 border-b border-cappuccino/20 flex items-center justify-between gap-2.5 sm:gap-3 bg-white/[0.02]">
            <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
              <span className="p-1.5 rounded-lg bg-cappuccino/20 text-cappuccino shrink-0">
                <CropIcon size={16} />
              </span>
              <div className="min-w-0">
                <h3 className="font-serif font-bold text-sm sm:text-base text-white leading-tight truncate">
                  {title}
                </h3>
                <p className="text-[10px] sm:text-[11px] text-white/60 font-light truncate">
                  Reposition, zoom or rotate to frame photo.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-10 h-10 min-w-[40px] min-h-[40px] flex items-center justify-center rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0 touch-manipulation"
              title="Close"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>
          </div>

          {/* Upload Error Banner */}
          {uploadError && (
            <div className="mx-3.5 sm:mx-5 mt-3 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between gap-2">
              <span>{uploadError}</span>
              <button
                type="button"
                onClick={() => setUploadError(null)}
                className="text-white/60 hover:text-white text-xs font-bold underline cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Modal Body: Viewport + Live Preview */}
          <div className="p-3 sm:p-5 overflow-y-auto space-y-3.5 sm:space-y-4">
            
            {/* Aspect Ratio Selector Pills - Responsive wrap with zero clipping on 320px */}
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center flex-wrap gap-1 bg-black/30 p-1 rounded-xl border border-white/10">
                {(["16:9", "4:3", "4:5", "1:1", "free"] as AspectRatioType[]).map((ratio) => (
                  <button
                    key={ratio}
                    type="button"
                    onClick={() => setAspectRatio(ratio)}
                    className={`px-2.5 sm:px-3 py-1.5 sm:py-1 rounded-lg text-xs font-bold transition-all cursor-pointer min-h-[34px] sm:min-h-[30px] flex items-center touch-manipulation ${
                      aspectRatio === ratio
                        ? "bg-cappuccino text-coffee-dark shadow-sm"
                        : "text-white/70 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {ratio === "16:9" && <>16:9<span className="hidden xs:inline"> (Courses)</span></>}
                    {ratio === "4:3" && <>4:3<span className="hidden xs:inline"> (Gallery)</span></>}
                    {ratio === "4:5" && <>4:5<span className="hidden xs:inline"> (Portrait)</span></>}
                    {ratio === "1:1" && <>1:1<span className="hidden xs:inline"> (Square)</span></>}
                    {ratio === "free" && "Original"}
                  </button>
                ))}
              </div>

              {/* Reset Button */}
              <button
                type="button"
                onClick={() => {
                  setZoom(1);
                  setRotation(0);
                  setOffset({ x: 0, y: 0 });
                }}
                className="px-2.5 py-1 min-h-[34px] sm:min-h-[30px] text-[11px] text-white/60 hover:text-cappuccino flex items-center gap-1.5 transition-colors cursor-pointer touch-manipulation"
                title="Reset Position"
              >
                <RefreshCcw size={12} />
                <span>Reset</span>
              </button>
            </div>

            {/* Canvas Interactive Viewport */}
            <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] bg-black/60 rounded-xl sm:rounded-2xl overflow-hidden border border-white/15 cursor-grab active:cursor-grabbing select-none touch-none">
              <canvas
                ref={canvasRef}
                width={640}
                height={420}
                onMouseDown={(e) => handlePointerDown(e.clientX, e.clientY)}
                onMouseMove={(e) => handlePointerMove(e.clientX, e.clientY)}
                onMouseUp={handlePointerUp}
                onMouseLeave={handlePointerUp}
                onTouchStart={(e) => {
                  if (e.touches[0]) {
                    handlePointerDown(e.touches[0].clientX, e.touches[0].clientY);
                  }
                }}
                onTouchMove={(e) => {
                  if (e.touches[0]) {
                    handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
                  }
                }}
                onTouchEnd={handlePointerUp}
                className="w-full h-full object-contain touch-none"
              />

              {/* Live Preview Floating Picture-in-Picture Box */}
              <div className="absolute bottom-2 right-2 xs:bottom-3 xs:right-3 p-1.5 xs:p-2 bg-[#1C1414]/90 backdrop-blur-md rounded-xl border border-cappuccino/40 shadow-xl flex flex-col items-center gap-1 pointer-events-none scale-90 xs:scale-100 origin-bottom-right">
                <span className="text-[8px] xs:text-[8.5px] uppercase tracking-wider text-cappuccino font-bold font-mono">
                  Live Preview
                </span>
                <div
                  className={`overflow-hidden rounded-lg bg-black/50 border border-white/20 ${
                    aspectRatio === "16:9"
                      ? "w-24 xs:w-28 h-[54px] xs:h-[63px]"
                      : aspectRatio === "4:3"
                      ? "w-20 xs:w-24 h-[60px] xs:h-[72px]"
                      : aspectRatio === "1:1"
                      ? "w-16 xs:w-20 h-16 xs:h-20"
                      : "w-20 xs:w-24 h-14 xs:h-16"
                  }`}
                >
                  <canvas
                    ref={previewCanvasRef}
                    width={200}
                    height={
                      aspectRatio === "16:9"
                        ? 112
                        : aspectRatio === "4:3"
                        ? 150
                        : aspectRatio === "1:1"
                        ? 200
                        : 130
                    }
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Viewport Controls: Zoom Slider + Rotation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 pt-1">
              {/* Zoom Slider */}
              <div className="flex items-center gap-2.5 sm:gap-3 bg-white/[0.04] px-3 sm:px-3.5 py-2 rounded-xl border border-white/10">
                <button
                  type="button"
                  onClick={() => setZoom((z) => Math.max(0.5, Number((z - 0.2).toFixed(1))))}
                  className="w-9 h-9 min-w-[36px] min-h-[36px] text-white/70 hover:text-white flex items-center justify-center rounded-lg cursor-pointer touch-manipulation active:bg-white/10"
                  title="Zoom Out"
                >
                  <ZoomOut size={16} />
                </button>
                <input
                  type="range"
                  min="0.5"
                  max="3"
                  step="0.05"
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="flex-1 accent-[#C8955F] cursor-pointer"
                />
                <button
                  type="button"
                  onClick={() => setZoom((z) => Math.min(3, Number((z + 0.2).toFixed(1))))}
                  className="w-9 h-9 min-w-[36px] min-h-[36px] text-white/70 hover:text-white flex items-center justify-center rounded-lg cursor-pointer touch-manipulation active:bg-white/10"
                  title="Zoom In"
                >
                  <ZoomIn size={16} />
                </button>
                <span className="text-[10px] font-mono text-cappuccino min-w-[30px] text-right">
                  {zoom.toFixed(1)}x
                </span>
              </div>

              {/* Rotation Button */}
              <div className="flex items-center justify-between bg-white/[0.04] px-3 sm:px-3.5 py-2 rounded-xl border border-white/10">
                <span className="text-xs text-white/70 font-medium">Orientation</span>
                <button
                  type="button"
                  onClick={() => setRotation((r) => (r + 90) % 360)}
                  className="min-h-[36px] px-3 py-1 bg-white/10 hover:bg-white/20 active:scale-95 rounded-lg text-xs font-bold text-white flex items-center gap-1.5 transition-colors cursor-pointer touch-manipulation"
                >
                  <RotateCw size={13} />
                  <span>Rotate 90° ({rotation}°)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Modal Footer Actions */}
          <div className="px-3.5 py-3 sm:px-5 sm:py-4 border-t border-cappuccino/20 flex items-center justify-between gap-2.5 sm:gap-3 bg-white/[0.02]">
            <button
              type="button"
              onClick={onClose}
              disabled={uploading}
              className="min-h-[44px] px-4 py-2 text-xs font-bold text-white/70 hover:text-white hover:bg-white/5 rounded-full transition-colors cursor-pointer disabled:opacity-50 touch-manipulation"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleCropAndUpload}
              disabled={uploading}
              className="min-h-[44px] px-5 sm:px-6 bg-cappuccino hover:bg-[#b5834f] text-coffee-dark font-extrabold text-xs uppercase tracking-wider rounded-full shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50 touch-manipulation flex-1 xs:flex-initial"
            >
              {uploading ? (
                <>
                  <RefreshCcw size={14} className="animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Check size={14} />
                  <span>Crop &amp; Apply</span>
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
