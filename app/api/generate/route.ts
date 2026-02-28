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
    const { imageBase64, config }: { imageBase64: string; config: KitchenConfig } = body;

    const apiToken = process.env.REPLICATE_API_TOKEN;
    if (!apiToken) {
      return NextResponse.json(
        { error: "REPLICATE_API_TOKEN non configuré. Ajoutez-le dans votre fichier .env.local" },
        { status: 500 }
      );
    }

    const replicate = new Replicate({ auth: apiToken });

    const prompt = buildPrompt(config);

    // Convert base64 to data URI if needed
    const imageUri = imageBase64.startsWith("data:") ? imageBase64 : `data:image/jpeg;base64,${imageBase64}`;

    // Use img2img with controlnet for room transformation
    // Model: jagilley/controlnet-hough (room structure preservation)
    // Fallback: stability-ai/stable-diffusion-img2img
    const output = await replicate.run(
      "stability-ai/stable-diffusion-img2img:15a3689ee13b0d2616e98820eca31d4af4b51808982614f7e9a01ad9d800b426",
      {
        input: {
          image: imageUri,
          prompt: prompt,
          negative_prompt:
            "blurry, low quality, distorted, unrealistic, cartoon, sketch, bad proportions, ugly, dark, messy",
          num_inference_steps: 30,
          guidance_scale: 7.5,
          prompt_strength: 0.65,
          width: 768,
          height: 512,
          num_outputs: 3,
          scheduler: "DPMSolverMultistep",
        },
      }
    );

    const images = Array.isArray(output) ? output : [output];

    return NextResponse.json({
      images: images.map((url: string, i: number) => ({ url, variant: i + 1 })),
      prompt,
    });
  } catch (err: unknown) {
    console.error("Replicate error:", err);
    const message = err instanceof Error ? err.message : "Erreur lors de la génération";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
