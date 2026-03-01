"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Download, RefreshCw, RotateCcw, ChevronLeft, ChevronRight, Clipboard, Check } from "lucide-react";
import { KitchenConfig, ProjectData } from "@/types";
import KitchenPlan from "./KitchenPlan";

interface Props {
  projectData: ProjectData;
  kitchenConfig: KitchenConfig;
  photoPreview: string;
  onReset: () => void;
  onRegenerate: () => void;
}

const woodLabels: Record<string, string> = {
  chene: "Chêne naturel", noyer: "Noyer", frene: "Frêne",
  laque: "Laqué mat", stratifie: "Stratifié",
};
const countertopLabels: Record<string, string> = {
  quartz: "Quartz", granit: "Granit", marbre: "Marbre",
  beton: "Béton ciré", bois: "Bois massif", inox: "Inox",
};
const layoutLabels: Record<string, string> = {
  lineaire: "Linéaire", L: "En L", U: "En U", ilot: "Avec îlot", parallele: "Parallèle",
};
const handleLabels: Record<string, string> = {
  sans: "Sans poignée", barre: "Barre", bouton: "Bouton rond",
  gorge: "Gorge fraisée", cuir: "Cuir",
};

export default function StepResult({
  projectData,
  kitchenConfig,
  photoPreview,
  onReset,
  onRegenerate,
}: Props) {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [activeTab, setActiveTab] = useState<"rendu" | "plan" | "fiche">("rendu");
  const [promptCopied, setPromptCopied] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const selectedImage = projectData.images[selectedIdx];

  const handlePrev = () => setSelectedIdx((prev) => (prev > 0 ? prev - 1 : projectData.images.length - 1));
  const handleNext = () => setSelectedIdx((prev) => (prev < projectData.images.length - 1 ? prev + 1 : 0));

  const handleDownload = async () => {
    const url = selectedImage.url;
    const a = document.createElement("a");
    a.href = url;
    a.download = `cuisine-${kitchenConfig.projectName || "projet"}-variante${selectedIdx + 1}.jpg`;
    a.target = "_blank";
    a.click();
  };

  const handlePrint = () => {
    window.print();
  };

  const copyPrompt = () => {
    navigator.clipboard.writeText(projectData.promptUsed);
    setPromptCopied(true);
    setTimeout(() => setPromptCopied(false), 2000);
  };

  const applianceList = Object.entries(kitchenConfig.appliances)
    .filter(([, v]) => v)
    .map(([k]) => {
      const labels: Record<string, string> = {
        fridge: "Réfrigérateur", oven: "Four encastré", dishwasher: "Lave-vaisselle",
        microwave: "Micro-ondes", hood: "Hotte", dressing: "Dressing", tvUnit: "Meuble TV",
      };
      return labels[k];
    });

  const date = new Date(projectData.generatedAt).toLocaleDateString("fr-FR", {
    day: "numeric", month: "long", year: "numeric",
  });

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold">Votre cuisine générée</h2>
          <p style={{ color: 'var(--muted)' }}>
            {projectData.images.length} variante(s) — {date}
            {kitchenConfig.projectName && ` — ${kitchenConfig.projectName}`}
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={onRegenerate}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border font-medium text-sm"
            style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}
          >
            <RefreshCw size={16} />
            Regénérer
          </button>
          <button
            onClick={onReset}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border font-medium text-sm"
            style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}
          >
            <RotateCcw size={16} />
            Nouveau projet
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 p-1 rounded-xl" style={{ background: 'var(--border)' }}>
        {(["rendu", "plan", "fiche"] as const).map((tab) => {
          const labels = { rendu: "Rendu IA", plan: "Plan côté", fiche: "Fiche projet" };
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="flex-1 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                background: activeTab === tab ? 'var(--surface)' : 'transparent',
                color: activeTab === tab ? 'var(--primary)' : 'var(--muted)',
                boxShadow: activeTab === tab ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
              }}
            >
              {labels[tab]}
            </button>
          );
        })}
      </div>

      {/* Tab: Rendu IA */}
      {activeTab === "rendu" && (
        <div>
          {/* Main image */}
          <div className="result-card mb-4">
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <Image
                src={selectedImage.url}
                alt={`Variante ${selectedIdx + 1}`}
                fill
                className="object-cover"
                unoptimized
              />
              {/* Navigation arrows */}
              {projectData.images.length > 1 && (
                <>
                  <button
                    onClick={handlePrev}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center"
                    style={{ background: 'rgba(255,255,255,0.9)' }}
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={handleNext}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center"
                    style={{ background: 'rgba(255,255,255,0.9)' }}
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}
              {/* Variant badge */}
              <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold text-white"
                style={{ background: 'rgba(139, 105, 20, 0.9)' }}>
                Variante {selectedIdx + 1} / {projectData.images.length}
              </div>
            </div>
          </div>

          {/* Thumbnails */}
          {projectData.images.length > 1 && (
            <div className="flex gap-3 mb-6">
              {projectData.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedIdx(i)}
                  className="relative rounded-xl overflow-hidden flex-1"
                  style={{
                    paddingBottom: '18%',
                    border: `2px solid ${i === selectedIdx ? 'var(--primary)' : 'var(--border)'}`,
                  }}
                >
                  <Image src={img.url} alt={`Variante ${i + 1}`} fill className="object-cover" unoptimized />
                </button>
              ))}
            </div>
          )}

          {/* Before/After */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="rounded-xl overflow-hidden card-shadow">
              <div className="relative w-full" style={{ paddingBottom: '75%' }}>
                <Image src={photoPreview} alt="Avant" fill className="object-cover" />
              </div>
              <div className="px-3 py-2 text-sm font-medium" style={{ background: 'var(--surface)' }}>
                Avant
              </div>
            </div>
            <div className="rounded-xl overflow-hidden card-shadow">
              <div className="relative w-full" style={{ paddingBottom: '75%' }}>
                <Image src={selectedImage.url} alt="Après" fill className="object-cover" unoptimized />
              </div>
              <div className="px-3 py-2 text-sm font-medium" style={{ background: 'var(--surface)' }}>
                Après (IA)
              </div>
            </div>
          </div>

          {/* Prompt used */}
          <div className="rounded-xl p-4 mb-6" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold" style={{ color: 'var(--muted)' }}>PROMPT IA UTILISÉ</p>
              <button onClick={copyPrompt} className="flex items-center gap-1 text-xs"
                style={{ color: 'var(--primary)' }}>
                {promptCopied ? <Check size={14} /> : <Clipboard size={14} />}
                {promptCopied ? "Copié !" : "Copier"}
              </button>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--muted)', fontFamily: 'monospace' }}>
              {projectData.promptUsed}
            </p>
          </div>

          {/* Download */}
          <button
            onClick={handleDownload}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-white gradient-wood"
          >
            <Download size={18} />
            Télécharger cette variante
          </button>
        </div>
      )}

      {/* Tab: Plan côté */}
      {activeTab === "plan" && (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Plan de masse vu du dessus</h3>
              <p className="text-sm" style={{ color: 'var(--muted)' }}>
                {layoutLabels[kitchenConfig.layout]} — {(kitchenConfig.dimensions.width * kitchenConfig.dimensions.length).toFixed(1)} m²
              </p>
            </div>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm text-white gradient-wood"
            >
              <Download size={16} />
              Imprimer
            </button>
          </div>
          <KitchenPlan config={kitchenConfig} />
          <p className="text-xs mt-3 text-center" style={{ color: 'var(--muted)' }}>
            Plan schématique indicatif — dimensions réelles à vérifier sur place
          </p>
        </div>
      )}

      {/* Tab: Fiche projet */}
      {activeTab === "fiche" && (
        <div ref={printRef}>
          <div className="rounded-2xl p-8 card-shadow" style={{ background: 'var(--surface)' }}>
            {/* Header */}
            <div className="flex items-start justify-between mb-8 pb-6"
              style={{ borderBottom: '2px solid var(--border)' }}>
              <div>
                <h3 className="text-2xl font-bold" style={{ color: 'var(--primary)' }}>
                  {kitchenConfig.projectName || "Projet cuisine"}
                </h3>
                <p className="text-lg mt-1">{kitchenConfig.clientName || "—"}</p>
                <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>Généré le {date}</p>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold px-3 py-1 rounded-full"
                  style={{ background: 'rgba(139, 105, 20, 0.1)', color: 'var(--primary)' }}>
                  CuisineIA
                </div>
              </div>
            </div>

            {/* Visuel */}
            <div className="rounded-xl overflow-hidden mb-8" style={{ border: '1px solid var(--border)' }}>
              <div className="relative w-full" style={{ paddingBottom: '40%' }}>
                <Image src={selectedImage.url} alt="Rendu" fill className="object-cover" unoptimized />
              </div>
            </div>

            {/* Details grid */}
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div>
                <h4 className="font-bold mb-3 text-sm uppercase tracking-wide"
                  style={{ color: 'var(--primary)' }}>
                  Dimensions
                </h4>
                <div className="space-y-2">
                  {[
                    ["Largeur", `${kitchenConfig.dimensions.width} m`],
                    ["Longueur", `${kitchenConfig.dimensions.length} m`],
                    ["Hauteur sous plafond", `${kitchenConfig.dimensions.height} m`],
                    ["Surface", `${(kitchenConfig.dimensions.width * kitchenConfig.dimensions.length).toFixed(1)} m²`],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between text-sm">
                      <span style={{ color: 'var(--muted)' }}>{k}</span>
                      <span className="font-semibold">{v}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-bold mb-3 text-sm uppercase tracking-wide"
                  style={{ color: 'var(--primary)' }}>
                  Matériaux
                </h4>
                <div className="space-y-2">
                  {[
                    ["Agencement", layoutLabels[kitchenConfig.layout]],
                    ["Façades", woodLabels[kitchenConfig.woodStyle]],
                    ["Plan de travail", countertopLabels[kitchenConfig.countertop]],
                    ["Poignées", handleLabels[kitchenConfig.handleStyle]],
                    ["Gamme", kitchenConfig.budget],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between text-sm">
                      <span style={{ color: 'var(--muted)' }}>{k}</span>
                      <span className="font-semibold capitalize">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Électroménager */}
            {applianceList.length > 0 && (
              <div className="mb-8">
                <h4 className="font-bold mb-3 text-sm uppercase tracking-wide"
                  style={{ color: 'var(--primary)' }}>
                  Électroménager intégré
                </h4>
                <div className="flex flex-wrap gap-2">
                  {applianceList.map((a) => (
                    <span key={a} className="px-3 py-1 rounded-full text-sm"
                      style={{ background: 'rgba(45, 90, 61, 0.1)', color: 'var(--accent)' }}>
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            {kitchenConfig.additionalPrompt && (
              <div className="mb-8">
                <h4 className="font-bold mb-2 text-sm uppercase tracking-wide"
                  style={{ color: 'var(--primary)' }}>
                  Notes / Instructions
                </h4>
                <p className="text-sm p-3 rounded-lg" style={{ background: '#FAFAFA', color: 'var(--muted)' }}>
                  {kitchenConfig.additionalPrompt}
                </p>
              </div>
            )}

            {/* Footer */}
            <div className="pt-6 flex items-center justify-between text-xs"
              style={{ borderTop: '1px solid var(--border)', color: 'var(--muted)' }}>
              <span>Document généré par CuisineIA</span>
              <span>Rendu IA — indicatif</span>
            </div>
          </div>

          <button
            onClick={handlePrint}
            className="mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-white gradient-wood"
          >
            <Download size={18} />
            Imprimer / Exporter en PDF
          </button>
        </div>
      )}
    </div>
  );
}
