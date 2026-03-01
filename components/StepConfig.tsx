"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Settings2 } from "lucide-react";
import { KitchenConfig, KitchenLayout, WoodStyle, CountertopMaterial, HandleStyle } from "@/types";

interface Props {
  photoPreview: string;
  onConfigDone: (config: KitchenConfig) => void;
  onBack: () => void;
}

const LAYOUTS: { value: KitchenLayout; label: string; desc: string }[] = [
  { value: "lineaire", label: "Linéaire", desc: "Meubles sur un seul mur" },
  { value: "L", label: "En L", desc: "Deux murs perpendiculaires" },
  { value: "U", label: "En U", desc: "Trois murs, max de rangements" },
  { value: "ilot", label: "Avec îlot", desc: "Central + plan de travail central" },
  { value: "parallele", label: "Parallèle", desc: "Deux rangées en face" },
];

const WOOD_STYLES: { value: WoodStyle; label: string; color: string }[] = [
  { value: "chene", label: "Chêne naturel", color: "#C4972A" },
  { value: "noyer", label: "Noyer", color: "#5C3D1E" },
  { value: "frene", label: "Frêne", color: "#D4B896" },
  { value: "laque", label: "Laqué mat", color: "#E8E8E8" },
  { value: "stratifie", label: "Stratifié", color: "#B8C4CC" },
];

const COUNTERTOPS: { value: CountertopMaterial; label: string }[] = [
  { value: "quartz", label: "Quartz" },
  { value: "granit", label: "Granit" },
  { value: "marbre", label: "Marbre" },
  { value: "beton", label: "Béton ciré" },
  { value: "bois", label: "Bois massif" },
  { value: "inox", label: "Inox" },
];

const HANDLES: { value: HandleStyle; label: string }[] = [
  { value: "sans", label: "Sans poignée (push)" },
  { value: "barre", label: "Barre" },
  { value: "bouton", label: "Bouton rond" },
  { value: "gorge", label: "Gorge fraisée" },
  { value: "cuir", label: "Cuir / tressé" },
];

export default function StepConfig({ photoPreview, onConfigDone, onBack }: Props) {
  const [form, setForm] = useState<KitchenConfig>({
    projectName: "",
    clientName: "",
    layout: "L",
    dimensions: { width: 4.0, length: 3.5, height: 2.5 },
    woodStyle: "chene",
    woodColor: "#C4972A",
    countertop: "quartz",
    countertopColor: "#F5F5F0",
    handleStyle: "barre",
    appliances: {
      fridge: true,
      oven: true,
      dishwasher: true,
      microwave: false,
      hood: true,
      dressing: false,
      tvUnit: false,
    },
    additionalPrompt: "",
    budget: "standard",
  });

  const update = <K extends keyof KitchenConfig>(key: K, value: KitchenConfig[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const updateDim = (key: keyof KitchenConfig["dimensions"], value: number) => {
    setForm((prev) => ({ ...prev, dimensions: { ...prev.dimensions, [key]: value } }));
  };

  const toggleAppliance = (key: keyof KitchenConfig["appliances"]) => {
    setForm((prev) => ({
      ...prev,
      appliances: { ...prev.appliances, [key]: !prev.appliances[key] },
    }));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Configuration de votre cuisine</h2>
        <p style={{ color: 'var(--muted)' }}>
          Définissez les caractéristiques pour guider l&apos;IA
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Photo preview */}
        <div className="lg:col-span-1">
          <div className="sticky top-4 rounded-2xl overflow-hidden card-shadow">
            <div className="relative w-full" style={{ paddingBottom: '75%' }}>
              <Image src={photoPreview} alt="Pièce" fill className="object-cover" />
            </div>
            <div className="p-4" style={{ background: 'var(--surface)' }}>
              <p className="text-sm font-medium" style={{ color: 'var(--muted)' }}>
                Photo de référence
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Infos projet */}
          <div className="rounded-2xl p-6 card-shadow" style={{ background: 'var(--surface)' }}>
            <div className="flex items-center gap-2 mb-4">
              <Settings2 size={18} style={{ color: 'var(--primary)' }} />
              <h3 className="font-semibold">Informations projet</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--muted)' }}>
                  Nom du projet
                </label>
                <input
                  type="text"
                  placeholder="Cuisine Dupont"
                  value={form.projectName}
                  onChange={(e) => update("projectName", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border text-sm"
                  style={{ borderColor: 'var(--border)', background: '#FAFAFA' }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--muted)' }}>
                  Nom du client
                </label>
                <input
                  type="text"
                  placeholder="M. Dupont"
                  value={form.clientName}
                  onChange={(e) => update("clientName", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border text-sm"
                  style={{ borderColor: 'var(--border)', background: '#FAFAFA' }}
                />
              </div>
            </div>
          </div>

          {/* Dimensions */}
          <div className="rounded-2xl p-6 card-shadow" style={{ background: 'var(--surface)' }}>
            <h3 className="font-semibold mb-4">Dimensions de la pièce</h3>
            <div className="grid grid-cols-3 gap-4">
              {(["width", "length", "height"] as const).map((dim) => (
                <div key={dim}>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--muted)' }}>
                    {dim === "width" ? "Largeur" : dim === "length" ? "Longueur" : "Hauteur"} (m)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="15"
                    value={form.dimensions[dim]}
                    onChange={(e) => updateDim(dim, parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-lg border text-sm font-mono"
                    style={{ borderColor: 'var(--border)', background: '#FAFAFA' }}
                  />
                </div>
              ))}
            </div>
            <p className="text-xs mt-3" style={{ color: 'var(--muted)' }}>
              Surface : {(form.dimensions.width * form.dimensions.length).toFixed(1)} m²
            </p>
          </div>

          {/* Layout */}
          <div className="rounded-2xl p-6 card-shadow" style={{ background: 'var(--surface)' }}>
            <h3 className="font-semibold mb-4">Agencement</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {LAYOUTS.map((l) => (
                <button
                  key={l.value}
                  onClick={() => update("layout", l.value)}
                  className={`p-3 rounded-xl border-2 text-left transition-all ${
                    form.layout === l.value ? 'border-yellow-600' : ''
                  }`}
                  style={{
                    borderColor: form.layout === l.value ? 'var(--primary)' : 'var(--border)',
                    background: form.layout === l.value ? 'rgba(139, 105, 20, 0.08)' : '#FAFAFA',
                  }}
                >
                  <p className="font-semibold text-sm">{l.label}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{l.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Materials */}
          <div className="rounded-2xl p-6 card-shadow" style={{ background: 'var(--surface)' }}>
            <h3 className="font-semibold mb-4">Matériaux & Finitions</h3>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--muted)' }}>
                Style des façades
              </label>
              <div className="flex flex-wrap gap-2">
                {WOOD_STYLES.map((w) => (
                  <button
                    key={w.value}
                    onClick={() => { update("woodStyle", w.value); update("woodColor", w.color); }}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg border-2 text-sm transition-all"
                    style={{
                      borderColor: form.woodStyle === w.value ? 'var(--primary)' : 'var(--border)',
                      background: form.woodStyle === w.value ? 'rgba(139, 105, 20, 0.08)' : '#FAFAFA',
                    }}
                  >
                    <span className="w-4 h-4 rounded-full border border-gray-200"
                      style={{ background: w.color }} />
                    {w.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--muted)' }}>
                Plan de travail
              </label>
              <div className="flex flex-wrap gap-2">
                {COUNTERTOPS.map((c) => (
                  <button
                    key={c.value}
                    onClick={() => update("countertop", c.value)}
                    className="px-3 py-2 rounded-lg border-2 text-sm transition-all"
                    style={{
                      borderColor: form.countertop === c.value ? 'var(--primary)' : 'var(--border)',
                      background: form.countertop === c.value ? 'rgba(139, 105, 20, 0.08)' : '#FAFAFA',
                    }}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--muted)' }}>
                Poignées
              </label>
              <div className="flex flex-wrap gap-2">
                {HANDLES.map((h) => (
                  <button
                    key={h.value}
                    onClick={() => update("handleStyle", h.value)}
                    className="px-3 py-2 rounded-lg border-2 text-sm transition-all"
                    style={{
                      borderColor: form.handleStyle === h.value ? 'var(--primary)' : 'var(--border)',
                      background: form.handleStyle === h.value ? 'rgba(139, 105, 20, 0.08)' : '#FAFAFA',
                    }}
                  >
                    {h.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Électroménager */}
          <div className="rounded-2xl p-6 card-shadow" style={{ background: 'var(--surface)' }}>
            <h3 className="font-semibold mb-4">Électroménager à intégrer</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {(Object.keys(form.appliances) as Array<keyof KitchenConfig["appliances"]>).map((key) => {
                const labels: Record<keyof KitchenConfig["appliances"], string> = {
                  fridge: "Réfrigérateur",
                  oven: "Four encastré",
                  dishwasher: "Lave-vaisselle",
                  microwave: "Micro-ondes",
                  hood: "Hotte",
                  dressing: "Dressing",
                  tvUnit: "Meuble TV",
                };
                return (
                  <button
                    key={key}
                    onClick={() => toggleAppliance(key)}
                    className="flex items-center gap-2 p-3 rounded-xl border-2 text-sm text-left transition-all"
                    style={{
                      borderColor: form.appliances[key] ? 'var(--accent)' : 'var(--border)',
                      background: form.appliances[key] ? 'rgba(45, 90, 61, 0.08)' : '#FAFAFA',
                    }}
                  >
                    <span className="w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0"
                      style={{
                        borderColor: form.appliances[key] ? 'var(--accent)' : 'var(--border)',
                        background: form.appliances[key] ? 'var(--accent)' : 'transparent',
                      }}>
                      {form.appliances[key] && <span className="text-white text-xs">✓</span>}
                    </span>
                    {labels[key]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Budget */}
          <div className="rounded-2xl p-6 card-shadow" style={{ background: 'var(--surface)' }}>
            <h3 className="font-semibold mb-4">Gamme de budget</h3>
            <div className="grid grid-cols-3 gap-3">
              {(["economique", "standard", "premium"] as const).map((b) => {
                const labels = { economique: "Économique", standard: "Standard", premium: "Premium" };
                const descs = { economique: "< 5 000 €", standard: "5 000 – 15 000 €", premium: "> 15 000 €" };
                return (
                  <button
                    key={b}
                    onClick={() => update("budget", b)}
                    className="p-3 rounded-xl border-2 text-center transition-all"
                    style={{
                      borderColor: form.budget === b ? 'var(--primary)' : 'var(--border)',
                      background: form.budget === b ? 'rgba(139, 105, 20, 0.08)' : '#FAFAFA',
                    }}
                  >
                    <p className="font-semibold text-sm">{labels[b]}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{descs[b]}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Additional prompt */}
          <div className="rounded-2xl p-6 card-shadow" style={{ background: 'var(--surface)' }}>
            <h3 className="font-semibold mb-2">Instructions supplémentaires (optionnel)</h3>
            <p className="text-sm mb-3" style={{ color: 'var(--muted)' }}>
              Décrivez des éléments spécifiques : couleurs, style, détails particuliers...
            </p>
            <textarea
              placeholder="Ex: style campagnard avec carreaux de ciment au sol, éclairage sous-meuble LED, crédence en carrelage blanc métro..."
              value={form.additionalPrompt}
              onChange={(e) => update("additionalPrompt", e.target.value)}
              className="w-full px-3 py-2 rounded-lg border text-sm resize-none"
              style={{ borderColor: 'var(--border)', background: '#FAFAFA' }}
              rows={3}
            />
          </div>

          {/* Navigation */}
          <div className="flex gap-3">
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-6 py-3 rounded-xl border font-medium transition-all"
              style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}
            >
              <ArrowLeft size={18} />
              Retour
            </button>
            <button
              onClick={() => onConfigDone(form)}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all gradient-wood hover:opacity-90"
            >
              Générer ma cuisine
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
