"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Settings2 } from "lucide-react";
import { DressingConfig, WoodStyle, HandleStyle, DressingOpeningStyle } from "@/types";

interface Props {
  photoPreview: string;
  onConfigDone: (config: DressingConfig) => void;
  onBack: () => void;
}

const WOOD_STYLES: { value: WoodStyle; label: string; color: string }[] = [
  { value: "chene", label: "Chêne naturel", color: "#C4972A" },
  { value: "noyer", label: "Noyer", color: "#5C3D1E" },
  { value: "frene", label: "Frêne", color: "#D4B896" },
  { value: "laque", label: "Laqué mat", color: "#E8E8E8" },
  { value: "stratifie", label: "Stratifié", color: "#B8C4CC" },
];

const HANDLES: { value: HandleStyle; label: string }[] = [
  { value: "sans", label: "Sans poignée (push)" },
  { value: "barre", label: "Barre" },
  { value: "bouton", label: "Bouton rond" },
  { value: "gorge", label: "Gorge fraisée" },
  { value: "cuir", label: "Cuir / tressé" },
];

const OPENING_STYLES: { value: DressingOpeningStyle; label: string; desc: string }[] = [
  { value: "coulissantes", label: "Portes coulissantes", desc: "Gain de place, design épuré" },
  { value: "battantes", label: "Portes battantes", desc: "Accès total, classique" },
  { value: "ouvert", label: "Ouvert", desc: "Sans portes, moderne" },
];

const INTERIOR_OPTIONS: { key: keyof DressingConfig["interior"]; label: string }[] = [
  { key: "penderie", label: "Penderie (cintres)" },
  { key: "etageres", label: "Étagères" },
  { key: "tiroirs", label: "Tiroirs" },
  { key: "chaussures", label: "Rangement chaussures" },
];

export default function StepConfigDressing({ photoPreview, onConfigDone, onBack }: Props) {
  const [form, setForm] = useState<DressingConfig>({
    projectName: "",
    clientName: "",
    dimensions: { width: 2.4, height: 2.4, depth: 0.6 },
    openingStyle: "coulissantes",
    interior: { penderie: true, etageres: true, tiroirs: false, chaussures: false },
    woodStyle: "laque",
    woodColor: "#E8E8E8",
    handleStyle: "sans",
    budget: "standard",
    additionalPrompt: "",
  });

  const updateDim = (key: keyof DressingConfig["dimensions"], value: number) => {
    setForm((prev) => ({ ...prev, dimensions: { ...prev.dimensions, [key]: value } }));
  };

  const toggleInterior = (key: keyof DressingConfig["interior"]) => {
    setForm((prev) => ({
      ...prev,
      interior: { ...prev.interior, [key]: !prev.interior[key] },
    }));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Configuration de votre dressing</h2>
        <p style={{ color: "var(--muted)" }}>Définissez les caractéristiques pour guider l&apos;IA</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Photo preview */}
        <div className="lg:col-span-1">
          <div className="sticky top-4 rounded-2xl overflow-hidden card-shadow">
            <div className="relative w-full" style={{ paddingBottom: "75%" }}>
              <Image src={photoPreview} alt="Pièce" fill className="object-cover" />
            </div>
            <div className="p-4" style={{ background: "var(--surface)" }}>
              <p className="text-sm font-medium" style={{ color: "var(--muted)" }}>Photo de référence</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Infos projet */}
          <div className="rounded-2xl p-6 card-shadow" style={{ background: "var(--surface)" }}>
            <div className="flex items-center gap-2 mb-4">
              <Settings2 size={18} style={{ color: "var(--primary)" }} />
              <h3 className="font-semibold">Informations projet</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "var(--muted)" }}>
                  Nom du projet
                </label>
                <input
                  type="text"
                  placeholder="Dressing Dupont"
                  value={form.projectName}
                  onChange={(e) => setForm((p) => ({ ...p, projectName: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border text-sm"
                  style={{ borderColor: "var(--border)", background: "#FAFAFA" }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "var(--muted)" }}>
                  Nom du client
                </label>
                <input
                  type="text"
                  placeholder="M. Dupont"
                  value={form.clientName}
                  onChange={(e) => setForm((p) => ({ ...p, clientName: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border text-sm"
                  style={{ borderColor: "var(--border)", background: "#FAFAFA" }}
                />
              </div>
            </div>
          </div>

          {/* Dimensions */}
          <div className="rounded-2xl p-6 card-shadow" style={{ background: "var(--surface)" }}>
            <h3 className="font-semibold mb-4">Dimensions</h3>
            <div className="grid grid-cols-3 gap-4">
              {(["width", "height", "depth"] as const).map((dim) => (
                <div key={dim}>
                  <label className="block text-sm font-medium mb-1" style={{ color: "var(--muted)" }}>
                    {dim === "width" ? "Largeur (m)" : dim === "height" ? "Hauteur (m)" : "Profondeur (m)"}
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    max="10"
                    value={form.dimensions[dim]}
                    onChange={(e) => updateDim(dim, parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-lg border text-sm font-mono"
                    style={{ borderColor: "var(--border)", background: "#FAFAFA" }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Opening style */}
          <div className="rounded-2xl p-6 card-shadow" style={{ background: "var(--surface)" }}>
            <h3 className="font-semibold mb-4">Type d&apos;ouverture</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {OPENING_STYLES.map((o) => (
                <button
                  key={o.value}
                  onClick={() => setForm((p) => ({ ...p, openingStyle: o.value }))}
                  className="p-3 rounded-xl border-2 text-left transition-all"
                  style={{
                    borderColor: form.openingStyle === o.value ? "var(--primary)" : "var(--border)",
                    background: form.openingStyle === o.value ? "rgba(139, 105, 20, 0.08)" : "#FAFAFA",
                  }}
                >
                  <p className="font-semibold text-sm">{o.label}</p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>{o.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Interior layout */}
          <div className="rounded-2xl p-6 card-shadow" style={{ background: "var(--surface)" }}>
            <h3 className="font-semibold mb-4">Aménagement intérieur</h3>
            <div className="grid grid-cols-2 gap-3">
              {INTERIOR_OPTIONS.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => toggleInterior(key)}
                  className="flex items-center gap-2 p-3 rounded-xl border-2 text-sm text-left transition-all"
                  style={{
                    borderColor: form.interior[key] ? "var(--accent)" : "var(--border)",
                    background: form.interior[key] ? "rgba(45, 90, 61, 0.08)" : "#FAFAFA",
                  }}
                >
                  <span
                    className="w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0"
                    style={{
                      borderColor: form.interior[key] ? "var(--accent)" : "var(--border)",
                      background: form.interior[key] ? "var(--accent)" : "transparent",
                    }}
                  >
                    {form.interior[key] && <span className="text-white text-xs">✓</span>}
                  </span>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Materials */}
          <div className="rounded-2xl p-6 card-shadow" style={{ background: "var(--surface)" }}>
            <h3 className="font-semibold mb-4">Matériaux & Finitions</h3>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2" style={{ color: "var(--muted)" }}>
                Style des façades
              </label>
              <div className="flex flex-wrap gap-2">
                {WOOD_STYLES.map((w) => (
                  <button
                    key={w.value}
                    onClick={() => setForm((p) => ({ ...p, woodStyle: w.value, woodColor: w.color }))}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg border-2 text-sm transition-all"
                    style={{
                      borderColor: form.woodStyle === w.value ? "var(--primary)" : "var(--border)",
                      background: form.woodStyle === w.value ? "rgba(139, 105, 20, 0.08)" : "#FAFAFA",
                    }}
                  >
                    <span className="w-4 h-4 rounded-full border border-gray-200" style={{ background: w.color }} />
                    {w.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "var(--muted)" }}>
                Poignées
              </label>
              <div className="flex flex-wrap gap-2">
                {HANDLES.map((h) => (
                  <button
                    key={h.value}
                    onClick={() => setForm((p) => ({ ...p, handleStyle: h.value }))}
                    className="px-3 py-2 rounded-lg border-2 text-sm transition-all"
                    style={{
                      borderColor: form.handleStyle === h.value ? "var(--primary)" : "var(--border)",
                      background: form.handleStyle === h.value ? "rgba(139, 105, 20, 0.08)" : "#FAFAFA",
                    }}
                  >
                    {h.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Budget */}
          <div className="rounded-2xl p-6 card-shadow" style={{ background: "var(--surface)" }}>
            <h3 className="font-semibold mb-4">Gamme de budget</h3>
            <div className="grid grid-cols-3 gap-3">
              {(["economique", "standard", "premium"] as const).map((b) => {
                const labels = { economique: "Économique", standard: "Standard", premium: "Premium" };
                const descs = { economique: "< 2 000 €", standard: "2 000 – 6 000 €", premium: "> 6 000 €" };
                return (
                  <button
                    key={b}
                    onClick={() => setForm((p) => ({ ...p, budget: b }))}
                    className="p-3 rounded-xl border-2 text-center transition-all"
                    style={{
                      borderColor: form.budget === b ? "var(--primary)" : "var(--border)",
                      background: form.budget === b ? "rgba(139, 105, 20, 0.08)" : "#FAFAFA",
                    }}
                  >
                    <p className="font-semibold text-sm">{labels[b]}</p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>{descs[b]}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Additional prompt */}
          <div className="rounded-2xl p-6 card-shadow" style={{ background: "var(--surface)" }}>
            <h3 className="font-semibold mb-2">Instructions supplémentaires (optionnel)</h3>
            <p className="text-sm mb-3" style={{ color: "var(--muted)" }}>
              Couleurs, style, détails particuliers...
            </p>
            <textarea
              placeholder="Ex: éclairage LED intégré, miroir pleine hauteur, ilôt central..."
              value={form.additionalPrompt}
              onChange={(e) => setForm((p) => ({ ...p, additionalPrompt: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg border text-sm resize-none"
              style={{ borderColor: "var(--border)", background: "#FAFAFA" }}
              rows={3}
            />
          </div>

          {/* Navigation */}
          <div className="flex gap-3">
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-6 py-3 rounded-xl border font-medium transition-all"
              style={{ borderColor: "var(--border)", color: "var(--muted)" }}
            >
              <ArrowLeft size={18} />
              Retour
            </button>
            <button
              onClick={() => onConfigDone(form)}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all gradient-wood hover:opacity-90"
            >
              Générer mon dressing
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
