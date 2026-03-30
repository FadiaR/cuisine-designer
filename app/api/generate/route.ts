import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";
import { UnifiedConfig, KitchenConfig, DressingConfig, TvUnitConfig } from "@/types";

const woodLabels: Record<string, string> = {
  chene: "façades en chêne naturel",
  noyer: "façades en noyer foncé",
  frene: "façades en frêne clair",
  laque: "façades laquées mat blanc",
  stratifie: "façades en stratifié gris",
};

const budgetModifiers: Record<string, string> = {
  economique: "design simple et épuré",
  standard: "design élégant et moderne",
  premium: "design haut de gamme luxueux avec finitions premium",
};

const handleLabels: Record<string, string> = {
  sans: "sans poignée push-to-open",
  barre: "poignées barre",
  bouton: "boutons ronds",
  gorge: "gorge fraisée",
  cuir: "poignées en cuir",
};

function buildKitchenPrompt(config: KitchenConfig): string {
  const countertopLabels: Record<string, string> = {
    quartz: "plan de travail en quartz blanc",
    granit: "plan de travail en granit",
    marbre: "plan de travail en marbre",
    beton: "plan de travail en béton ciré",
    bois: "plan de travail en bois massif",
    inox: "plan de travail en inox",
  };
  const layoutLabels: Record<string, string> = {
    lineaire: "cuisine linéaire sur un seul mur",
    L: "cuisine en L",
    U: "cuisine en U",
    ilot: "cuisine avec îlot central",
    parallele: "cuisine parallèle double rangée",
  };

  const appliances = [];
  if (config.appliances.fridge) appliances.push("réfrigérateur intégré");
  if (config.appliances.oven) appliances.push("four encastré");
  if (config.appliances.dishwasher) appliances.push("lave-vaisselle");
  if (config.appliances.microwave) appliances.push("micro-ondes");
  if (config.appliances.hood) appliances.push("hotte aspirante");

  let prompt =
    `Même pièce, mêmes murs, même sol, même plafond, même luminosité, ` +
    `ajouter une ${layoutLabels[config.layout]} sur-mesure, ` +
    `${woodLabels[config.woodStyle]}, ` +
    `${countertopLabels[config.countertop]}, ` +
    `${budgetModifiers[config.budget]}, ` +
    (appliances.length > 0 ? `avec ${appliances.join(", ")}, ` : "") +
    `rendu photoréaliste, photographie professionnelle, 8k, détails nets`;

  if (config.additionalPrompt) prompt += `, ${config.additionalPrompt}`;
  return prompt;
}

function buildDressingPrompt(config: DressingConfig): string {
  const openingLabels: Record<string, string> = {
    coulissantes: "dressing encastré avec portes coulissantes",
    battantes: "dressing encastré avec portes battantes",
    ouvert: "dressing ouvert sans portes",
  };

  const interiorParts = [];
  if (config.interior.penderie) interiorParts.push("espace penderie avec tringles");
  if (config.interior.etageres) interiorParts.push("étagères");
  if (config.interior.tiroirs) interiorParts.push("tiroirs");
  if (config.interior.chaussures) interiorParts.push("rangement chaussures");

  let prompt =
    `Même pièce, mêmes murs, même sol, même plafond, même luminosité, ` +
    `ajouter un ${openingLabels[config.openingStyle]} sur-mesure, ` +
    `${woodLabels[config.woodStyle]}, ` +
    `${handleLabels[config.handleStyle]}, ` +
    `${budgetModifiers[config.budget]}, ` +
    `largeur ${config.dimensions.width}m, hauteur ${config.dimensions.height}m, ` +
    (interiorParts.length > 0 ? `intérieur avec ${interiorParts.join(", ")}, ` : "") +
    `rendu photoréaliste, photographie professionnelle, 8k, détails nets`;

  if (config.additionalPrompt) prompt += `, ${config.additionalPrompt}`;
  return prompt;
}

function buildTvUnitPrompt(config: TvUnitConfig): string {
  const styleLabels: Record<string, string> = {
    suspendu: "meuble TV suspendu flottant",
    sol: "meuble TV posé au sol",
    bibliotheque: "meuble TV avec bibliothèque intégrée et rangements",
  };

  let prompt =
    `Même pièce, mêmes murs, même sol, même plafond, même luminosité, ` +
    `ajouter un ${styleLabels[config.style]} sur-mesure, ` +
    `${woodLabels[config.woodStyle]}, ` +
    `${handleLabels[config.handleStyle]}, ` +
    `${budgetModifiers[config.budget]}, ` +
    `largeur ${config.dimensions.width}m, ` +
    (config.ledLighting ? "éclairage LED intégré, " : "") +
    `rendu photoréaliste, photographie professionnelle, 8k, détails nets`;

  if (config.additionalPrompt) prompt += `, ${config.additionalPrompt}`;
  return prompt;
}

function buildPrompt(unifiedConfig: UnifiedConfig): string {
  if (unifiedConfig.type === "cuisine") return buildKitchenPrompt(unifiedConfig.data);
  if (unifiedConfig.type === "dressing") return buildDressingPrompt(unifiedConfig.data);
  return buildTvUnitPrompt(unifiedConfig.data);
}

export async function POST(req: NextRequest) {
  try {
    const { imageBase64, unifiedConfig } = await req.json();

    const apiToken = process.env.REPLICATE_API_TOKEN;
    if (!apiToken) {
      return NextResponse.json(
        { error: "REPLICATE_API_TOKEN non configuré. Ajoutez-le dans votre fichier .env.local" },
        { status: 500 }
      );
    }

    const replicate = new Replicate({ auth: apiToken });
    const prompt = buildPrompt(unifiedConfig as UnifiedConfig);

    // 3 variantes en parallèle, mode image-to-image
    // prompt_strength 0.75 = conserve murs/sol/lumière, modifie les meubles
    const runs = await Promise.all(
      [0, 1, 2].map(() =>
        replicate.run("black-forest-labs/flux-dev", {
          input: {
            prompt,
            image: imageBase64,
            prompt_strength: 0.75,
            num_outputs: 1,
            aspect_ratio: "16:9",
            output_format: "webp",
            output_quality: 90,
            num_inference_steps: 28,
          },
        })
      )
    );

    const images = runs.map((output, i) => {
      const arr = Array.isArray(output) ? output : [output];
      return { url: String(arr[0]), variant: i + 1 };
    });

    return NextResponse.json({ images, prompt });
  } catch (err: unknown) {
    console.error("Replicate error:", err);
    const message = err instanceof Error ? err.message : "Erreur lors de la génération";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
