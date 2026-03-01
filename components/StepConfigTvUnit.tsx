"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Settings2 } from "lucide-react";
import { TvUnitConfig, WoodStyle, HandleStyle, TvUnitStyle } from "@/types";

interface Props {
  photoPreview: string;
  onConfigDone: (config: TvUnitConfig) => void;
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

const TV_STYLES: { value: TvUnitStyle; label: string; desc: string }[] = [
  { value: "suspendu", label: "Suspendu", desc: "Fixé au mur, effet flottant" },
  { value: "sol", label: "Au sol", desc: "Posé au sol, classique" },
  { value: "bibliotheque", label: "Bibliothèque intégrée", desc: "Avec étagères et rangements" },
];

export default function StepConfigTvUnit({ photoPreview, onConfigDone, onBack }: Props) {
  const [form, setForm] = useState<TvUnitConfig>({
    projectName: "",
    clientName: "",
    dimensions: { width: 2.0, height: 0.5, depth: 0.4 },
    style: "suspendu",
    woodStyle: "laque",
    woodColor: "#E8E8E8",
    handleStyle: "sans",
    ledLighting: false,
    budget: "standard",
    additionalPrompt: "",
  });

  const updateDim = (key: keyof TvUnitConfig["dimensions"], value: number) => {
    setForm((prev) => ({ ...prev, dimensions: { ...prev.dimensions, [key]: value } }));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Configuration de votre meuble TV</h2>
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
                  placeholder="Meuble TV Dupont"
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
                    step="0.05"
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

          {/* Style */}
          <div className="rounded-2xl p-6 card-shadow" style={{ background: "var(--surface)" }}>
            <h3 className="font-semibold mb-4">Style du meuble</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {TV_STYLES.map((s) => (
                <button
                  key={s.value}
                  onClick={() => setForm((p) => ({ ...p, style: s.value }))}
                  className="p-3 rounded-xl border-2 text-left transition-all"
                  style={{
                    borderColor: form.style === s.value ? "var(--primary)" : "var(--border)",
                    background: form.style === s.value ? "rgba(139, 105, 20, 0.08)" : "#FAFAFA",
                  }}
                >
                  <p className="font-semibold text-sm">{s.label}</p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>{s.desc}</p>
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

          {/* LED Lighting */}
          <div className="rounded-2xl p-6 card-shadow" style={{ background: "var(--surface)" }}>
            <h3 className="font-semibold mb-4">Options</h3>
            <button
              onClick={() => setForm((p) => ({ ...p, ledLighting: !p.ledLighting }))}
              className="flex items-center gap-3 p-3 rounded-xl border-2 text-sm transition-all"
              style={{
                borderColor: form.ledLighting ? "var(--accent)" : "var(--border)",
                background: form.ledLighting ? "rgba(45, 90, 61, 0.08)" : "#FAFAFA",
              }}
            >
              <span
                className="w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0"
                style={{
                  borderColor: form.ledLighting ? "var(--accent)" : "var(--border)",
                  background: form.ledLighting ? "var(--accent)" : "transparent",
                }}
              >
                {form.ledLighting && <span className="text-white text-xs">✓</span>}
              </span>
              Éclairage LED intégré
            </button>
          </div>

          {/* Budget */}
          <div className="rounded-2xl p-6 card-shadow" style={{ background: "var(--surface)" }}>
            <h3 className="font-semibold mb-4">Gamme de budget</h3>
            <div className="grid grid-cols-3 gap-3">
              {(["economique", "standard", "premium"] as const).map((b) => {
                const labels = { economique: "Économique", standard: "Standard", premium: "Premium" };
                const descs = { economique: "< 1 000 €", standard: "1 000 – 3 000 €", premium: "> 3 000 €" };
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
              placeholder="Ex: niche centrale pour TV 65 pouces, compartiments gauche et droite avec portes..."
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
              Générer mon meuble TV
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
