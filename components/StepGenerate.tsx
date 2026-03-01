"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowLeft, Sparkles, AlertCircle } from "lucide-react";
import { UnifiedConfig, ProjectData } from "@/types";

interface Props {
  photoFile: File;
  photoPreview: string;
  unifiedConfig: UnifiedConfig;
  onGenerationDone: (data: ProjectData) => void;
  onBack: () => void;
}

const GENERATION_STEPS = [
  "Analyse de la photo...",
  "Détection de l'espace et des murs...",
  "Construction du prompt architectural...",
  "Génération IA en cours (peut prendre 30-60s)...",
  "Rendu des variantes...",
  "Finalisation des images...",
];

const PROJECT_LABELS: Record<string, string> = {
  cuisine: "cuisine",
  dressing: "dressing",
  tvUnit: "meuble TV",
};

export default function StepGenerate({
  photoFile,
  photoPreview,
  unifiedConfig,
  onGenerationDone,
  onBack,
}: Props) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState("");
  const [hasStarted, setHasStarted] = useState(false);

  const startGeneration = async () => {
    setIsGenerating(true);
    setError("");
    setHasStarted(true);

    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < GENERATION_STEPS.length - 1) return prev + 1;
        return prev;
      });
    }, 8000);

    try {
      const base64 = await fileToBase64(photoFile);

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: base64, unifiedConfig }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur de génération");
      }

      clearInterval(stepInterval);

      onGenerationDone({
        images: data.images,
        selectedImageIndex: 0,
        generatedAt: new Date().toISOString(),
        promptUsed: data.prompt,
      });
    } catch (err: unknown) {
      clearInterval(stepInterval);
      setIsGenerating(false);
      setCurrentStep(0);
      const message = err instanceof Error ? err.message : "Erreur inconnue";
      setError(message);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  useEffect(() => {
    if (!hasStarted) {
      startGeneration();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const projectLabel = PROJECT_LABELS[unifiedConfig.type];

  // Build summary rows depending on project type
  const summaryRows: { label: string; value: string }[] = [];
  if (unifiedConfig.type === "cuisine") {
    const d = unifiedConfig.data;
    const layoutLabels: Record<string, string> = {
      lineaire: "Linéaire", L: "En L", U: "En U", ilot: "Avec îlot", parallele: "Parallèle",
    };
    const woodLabels: Record<string, string> = {
      chene: "Chêne naturel", noyer: "Noyer", frene: "Frêne", laque: "Laqué mat", stratifie: "Stratifié",
    };
    summaryRows.push(
      { label: "Agencement", value: layoutLabels[d.layout] },
      { label: "Façades", value: woodLabels[d.woodStyle] },
      { label: "Surface", value: `${(d.dimensions.width * d.dimensions.length).toFixed(1)} m²` },
      { label: "Plan de travail", value: d.countertop },
      { label: "Budget", value: d.budget },
      { label: "Client", value: d.clientName || "—" },
    );
  } else if (unifiedConfig.type === "dressing") {
    const d = unifiedConfig.data;
    const openingLabels: Record<string, string> = {
      coulissantes: "Portes coulissantes", battantes: "Portes battantes", ouvert: "Ouvert",
    };
    const woodLabels: Record<string, string> = {
      chene: "Chêne naturel", noyer: "Noyer", frene: "Frêne", laque: "Laqué mat", stratifie: "Stratifié",
    };
    summaryRows.push(
      { label: "Ouverture", value: openingLabels[d.openingStyle] },
      { label: "Façades", value: woodLabels[d.woodStyle] },
      { label: "Largeur", value: `${d.dimensions.width} m` },
      { label: "Hauteur", value: `${d.dimensions.height} m` },
      { label: "Budget", value: d.budget },
      { label: "Client", value: d.clientName || "—" },
    );
  } else {
    const d = unifiedConfig.data;
    const styleLabels: Record<string, string> = {
      suspendu: "Suspendu", sol: "Au sol", bibliotheque: "Bibliothèque intégrée",
    };
    const woodLabels: Record<string, string> = {
      chene: "Chêne naturel", noyer: "Noyer", frene: "Frêne", laque: "Laqué mat", stratifie: "Stratifié",
    };
    summaryRows.push(
      { label: "Style", value: styleLabels[d.style] },
      { label: "Façades", value: woodLabels[d.woodStyle] },
      { label: "Largeur", value: `${d.dimensions.width} m` },
      { label: "LED", value: d.ledLighting ? "Oui" : "Non" },
      { label: "Budget", value: d.budget },
      { label: "Client", value: d.clientName || "—" },
    );
  }

  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Génération en cours</h2>
        <p style={{ color: "var(--muted)" }}>
          L&apos;IA crée 3 variantes de votre {projectLabel} sur-mesure
        </p>
      </div>

      {/* Preview + loader */}
      <div className="relative rounded-2xl overflow-hidden card-shadow mb-8">
        <div className="relative w-full" style={{ paddingBottom: "66%" }}>
          <Image src={photoPreview} alt="Pièce" fill className="object-cover" />
          {isGenerating && (
            <div className="absolute inset-0 flex flex-col items-center justify-center"
              style={{ background: "rgba(26, 15, 0, 0.75)" }}>
              <div className="mb-4">
                <Sparkles size={40} color="#C4972A" className="animate-pulse" />
              </div>
              <p className="text-white font-semibold text-lg mb-2">IA au travail</p>
              <p className="text-sm mb-6" style={{ color: "#C4972A" }}>
                {GENERATION_STEPS[currentStep]}
              </p>
              <div className="loader-bar">
                <div className="loader-bar-fill" />
              </div>
              <p className="text-xs mt-3" style={{ color: "rgba(255,255,255,0.5)" }}>
                Étape {currentStep + 1} / {GENERATION_STEPS.length}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Config summary */}
      <div className="rounded-2xl p-6 card-shadow mb-6 text-left" style={{ background: "var(--surface)" }}>
        <h3 className="font-semibold mb-3 text-sm" style={{ color: "var(--muted)" }}>
          Résumé de votre configuration
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {summaryRows.map((item) => (
            <div key={item.label} className="flex flex-col">
              <span className="text-xs font-medium" style={{ color: "var(--muted)" }}>{item.label}</span>
              <span className="text-sm font-semibold capitalize">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 rounded-xl p-4 text-left"
          style={{ background: "#FEF2F2", border: "1px solid #FECACA" }}>
          <div className="flex items-start gap-3">
            <AlertCircle size={20} color="#DC2626" className="flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-sm" style={{ color: "#DC2626" }}>Erreur de génération</p>
              <p className="text-sm mt-1" style={{ color: "#991B1B" }}>{error}</p>
              {error.includes("REPLICATE_API_TOKEN") && (
                <div className="mt-3 p-3 rounded-lg text-xs font-mono"
                  style={{ background: "#1a1a1a", color: "#C4972A" }}>
                  <p># Créez le fichier .env.local :</p>
                  <p className="mt-1">REPLICATE_API_TOKEN=r8_xxxxxxxxxxxx</p>
                  <p className="mt-2 text-gray-400"># Clé disponible sur replicate.com</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={onBack}
          disabled={isGenerating}
          className="flex items-center gap-2 px-6 py-3 rounded-xl border font-medium transition-all disabled:opacity-40"
          style={{ borderColor: "var(--border)", color: "var(--muted)" }}
        >
          <ArrowLeft size={18} />
          Modifier
        </button>
        {error && (
          <button
            onClick={startGeneration}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-white gradient-wood"
          >
            <Sparkles size={18} />
            Réessayer
          </button>
        )}
      </div>
    </div>
  );
}
