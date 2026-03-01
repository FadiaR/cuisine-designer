export type KitchenLayout = "lineaire" | "L" | "U" | "ilot" | "parallele";
export type WoodStyle = "chene" | "noyer" | "frene" | "laque" | "stratifie";
export type CountertopMaterial = "quartz" | "granit" | "marbre" | "beton" | "bois" | "inox";
export type HandleStyle = "sans" | "barre" | "bouton" | "gorge" | "cuir";

export interface RoomDimensions {
  width: number;
  length: number;
  height: number;
}

export interface KitchenConfig {
  projectName: string;
  clientName: string;
  layout: KitchenLayout;
  dimensions: RoomDimensions;
  woodStyle: WoodStyle;
  woodColor: string;
  countertop: CountertopMaterial;
  countertopColor: string;
  handleStyle: HandleStyle;
  appliances: {
    fridge: boolean;
    oven: boolean;
    dishwasher: boolean;
    microwave: boolean;
    hood: boolean;
    dressing: boolean;
    tvUnit: boolean;
  };
  additionalPrompt: string;
  budget: "economique" | "standard" | "premium";
}

export interface GeneratedImage {
  url: string;
  variant: number;
}

export interface ProjectData {
  images: GeneratedImage[];
  selectedImageIndex: number;
  generatedAt: string;
  promptUsed: string;
}
