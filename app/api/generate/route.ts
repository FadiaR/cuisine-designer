import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";
import { KitchenConfig } from "@/types";

function buildPrompt(config: KitchenConfig): string {
  const woodLabels: Record<string, string> = {
    chene: "natural oak wood",
    noyer: "dark walnut wood",
    frene: "light ash wood",
    laque: "matte lacquered white",
    stratifie: "grey laminate",
  };
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
  const budgetModifiers: Record<string, string> = {
    economique: "simple clean design",
    standard: "elegant modern design",
    premium: "luxury high-end design with premium finishes",
  };

  const appliances = [];
  if (config.appliances.fridge) appliances.push("integrated refrigerator");
  if (config.appliances.oven) appliances.push("built-in oven");
  if (config.appliances.dishwasher) appliances.push("dishwasher");
  if (config.appliances.microwave) appliances.push("microwave");
  if (config.appliances.hood) appliances.push("range hood");
  if (config.appliances.wineRack) appliances.push("wine rack");

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

  if (config.additionalPrompt) {
    prompt += `, ${config.additionalPrompt}`;
  }

  return prompt;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { config }: { config: KitchenConfig } = body;

    const apiToken = process.env.REPLICATE_API_TOKEN;
    if (!apiToken) {
      return NextResponse.json(
        { error: "REPLICATE_API_TOKEN non configuré. Ajoutez-le dans votre fichier .env.local" },
        { status: 500 }
      );
    }

    const replicate = new Replicate({ auth: apiToken });

    const prompt = buildPrompt(config);

    const output = await replicate.run(
      "black-forest-labs/flux-schnell",
      {
        input: {
          prompt: prompt,
          num_outputs: 3,
          aspect_ratio: "16:9",
          output_format: "webp",
          output_quality: 90,
        },
      }
    );

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
