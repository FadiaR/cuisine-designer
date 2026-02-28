"use client";

import { useState, useRef, DragEvent } from "react";
import { Camera, ImageIcon, AlertCircle, FolderOpen } from "lucide-react";

interface Props {
  onPhotoUploaded: (file: File, preview: string) => void;
}

export default function StepUpload({ onPhotoUploaded }: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    setError("");
    if (!file.type.startsWith("image/")) {
      setError("Veuillez sélectionner une image (JPG, PNG, WEBP)");
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      setError("L'image ne doit pas dépasser 15 Mo");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      onPhotoUploaded(file, e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div className="max-w-lg mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold mb-1">Photo de la pièce</h2>
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          Prenez une photo ou importez depuis votre galerie
        </p>
      </div>

      {/* Primary action — Camera */}
      <button
        onClick={() => cameraInputRef.current?.click()}
        className="w-full py-6 rounded-2xl flex flex-col items-center justify-center gap-3 mb-4 active:opacity-90 transition-opacity"
        style={{
          background: "linear-gradient(135deg, #8B6914, #C4972A)",
          boxShadow: "0 4px 20px rgba(139, 105, 20, 0.4)",
          minHeight: "120px",
        }}
      >
        <Camera size={40} color="white" />
        <div className="text-center">
          <p className="font-bold text-white text-lg">Prendre une photo</p>
          <p className="text-white text-sm opacity-80">Appareil photo de votre iPhone</p>
        </div>
      </button>
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
      />

      {/* Secondary action — Gallery */}
      <button
        onClick={() => galleryInputRef.current?.click()}
        className="w-full py-4 rounded-2xl flex items-center justify-center gap-3 mb-4 border-2 active:opacity-80 transition-opacity"
        style={{
          borderColor: "var(--primary)",
          color: "var(--primary)",
          background: "rgba(139, 105, 20, 0.06)",
          minHeight: "64px",
        }}
      >
        <FolderOpen size={22} />
        <span className="font-semibold">Choisir depuis la galerie</span>
      </button>
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
      />

      {/* Desktop drag & drop */}
      <div
        className={`upload-zone rounded-2xl p-6 text-center cursor-pointer sm:block hidden ${isDragging ? "drag-over" : ""}`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => galleryInputRef.current?.click()}
      >
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          Ou glissez-déposez une photo ici · JPG, PNG, WEBP · max 15 Mo
        </p>
      </div>

      {error && (
        <div className="mt-4 flex items-center gap-2 p-3 rounded-xl" style={{ background: "#FEF2F2", color: "#DC2626" }}>
          <AlertCircle size={16} />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Tips */}
      <div className="mt-6 rounded-2xl p-5" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
        <div className="flex items-center gap-2 mb-3">
          <ImageIcon size={16} style={{ color: "var(--primary)" }} />
          <p className="text-sm font-semibold" style={{ color: "var(--primary)" }}>
            Conseils pour un bon résultat
          </p>
        </div>
        <ul className="space-y-2">
          {[
            "Vue d'ensemble de la pièce (pas de zoom)",
            "Bonne luminosité naturelle ou artificielle",
            "Incluez les murs, sol et plafond si possible",
          ].map((tip, i) => (
            <li key={i} className="flex items-start gap-2 text-sm" style={{ color: "var(--muted)" }}>
              <span
                className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
                style={{ background: "rgba(196, 151, 42, 0.15)", color: "var(--primary)" }}
              >
                {i + 1}
              </span>
              {tip}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
