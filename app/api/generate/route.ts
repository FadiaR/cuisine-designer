import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";
import { UnifiedConfig, KitchenConfig, DressingConfig, TvUnitConfig } from "@/types";

const woodLabels: Record<string, string> = {
  chene: "natural oak wood",
  noyer: "dark walnut wood",
  frene: "light ash wood",
  laque: "matte lacquered white",
  stratifie: "grey laminate",
};

const budgetModifiers: Record<string, string> = {
  economique: "simple clean design",
  standard: "elegant modern design",
  premium: "luxury high-end design with premium finishes",
};

const handleLabels: Record<string, string> = {
  sans: "push-to-open handleless",
  barre: "bar handles",
  bouton: "round knobs",
  gorge: "recessed groove handles",
  cuir: "leather strap handles",
};

function buildKitchenPrompt(config: KitchenConfig): string {
  const countertopLabels: Record<string, string> = {
    quartz: "white quartz countertop",
    granit: "granite countertop",
    marbre: "marble countertop",
    beton: "polished concrete countertop",
    bois: "solid wood countertop",
    inox: "stainless steel countertop",
  };
  const layoutLabels: Record<string, string> = {
    lineaire: "linear single-wall kitchen",
    L: "L-shaped kitchen",
    U: "U-shaped kitchen",
    ilot: "kitchen with central island",
    parallele: "galley kitchen",
  };

  const appliances = [];
  if (config.appliances.fridge) appliances.push("integrated refrigerator");
  if (config.appliances.oven) appliances.push("built-in oven");
  if (config.appliances.dishwasher) appliances.push("dishwasher");
  if (config.appliances.microwave) appliances.push("microwave");
  if (config.appliances.hood) appliances.push("range hood");

  let prompt =
    `Interior design photo, ${layoutLabels[config.layout]} custom kitchen, ` +
    `${woodLabels[config.woodStyle]} cabinet fronts, ` +
    `${countertopLabels[config.countertop]}, ` +
    `${budgetModifiers[config.budget]}, ` +
    `room size ${config.dimensions.width}x${config.dimensions.length}m, ` +
    `${config.dimensions.height}m ceiling height, ` +
    (appliances.length > 0 ? `with ${appliances.join(", ")}, ` : "") +
    `photorealistic render, professional kitchen photography, 8k, sharp details, ` +
    `natural lighting, warm atmosphere, architectural visualization`;

  if (config.additionalPrompt) prompt += `, ${config.additionalPrompt}`;
  return prompt;
}

function buildDressingPrompt(config: DressingConfig): string {
  const openingLabels: Record<string, string> = {
    coulissantes: "sliding door wardrobe",
    battantes: "hinged door wardrobe",
    ouvert: "open walk-in wardrobe without doors",
  };

  const interiorParts = [];
  if (config.interior.penderie) interiorParts.push("hanging rail section");
  if (config.interior.etageres) interiorParts.push("shelving sections");
  if (config.interior.tiroirs) interiorParts.push("drawers");
  if (config.interior.chaussures) interiorParts.push("shoe storage");

  let prompt =
    `Interior design photo, custom built-in ${openingLabels[config.openingStyle]}, ` +
    `${woodLabels[config.woodStyle]} panel fronts, ` +
    `${handleLabels[config.handleStyle]}, ` +
    `${budgetModifiers[config.budget]}, ` +
    `${config.dimensions.width}m wide, ${config.dimensions.height}m tall, ${config.dimensions.depth}m deep, ` +
    (interiorParts.length > 0 ? `interior with ${interiorParts.join(", ")}, ` : "") +
    `photorealistic render, professional interior photography, 8k, sharp details, ` +
    `natural lighting, luxury bedroom atmosphere, architectural visualization`;

  if (config.additionalPrompt) prompt += `, ${config.additionalPrompt}`;
  return prompt;
}

function buildTvUnitPrompt(config: TvUnitConfig): string {
  const styleLabels: Record<string, string> = {
    suspendu: "wall-mounted floating TV unit",
    sol: "floor-standing TV unit",
    bibliotheque: "TV unit with integrated bookcase and storage",
  };

  let prompt =
    `Interior design photo, custom ${styleLabels[config.style]}, ` +
    `${woodLabels[config.woodStyle]} cabinet fronts, ` +
    `${handleLabels[config.handleStyle]}, ` +
    `${budgetModifiers[config.budget]}, ` +
    `${config.dimensions.width}m wide, ${config.dimensions.height}m tall, ` +
    (config.ledLighting ? "integrated LED strip lighting, " : "") +
    `photorealistic render, professional living room interior photography, 8k, sharp details, ` +
    `natural and ambient lighting, modern atmosphere, architectural visualization`;

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
    const { unifiedConfig } = await req.json();

    const apiToken = process.env.REPLICATE_API_TOKEN;
    if (!apiToken) {
      return NextResponse.json(
        { error: "REPLICATE_API_TOKEN non configuré. Ajoutez-le dans votre fichier .env.local" },
        { status: 500 }
      );
    }

    const replicate = new Replicate({ auth: apiToken });
    const prompt = buildPrompt(unifiedConfig as UnifiedConfig);

    const output = await replicate.run("black-forest-labs/flux-schnell", {
      input: {
        prompt,
        num_outputs: 3,
        aspect_ratio: "16:9",
        output_format: "webp",
        output_quality: 90,
      },
    });

    const images = Array.isArray(output) ? output : [output];

    return NextResponse.json({
      images: images.map((url: unknown, i: number) => ({
        url: String(url),
        variant: i + 1,
      })),
      prompt,
    });
  } catch (err: unknown) {
    console.error("Replicate error:", err);
    const message = err instanceof Error ? err.message : "Erreur lors de la génération";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
