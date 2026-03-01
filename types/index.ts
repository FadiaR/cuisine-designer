export type ProjectType = "cuisine" | "dressing" | "tvUnit";
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
  };
  additionalPrompt: string;
  budget: "economique" | "standard" | "premium";
}

export type DressingOpeningStyle = "coulissantes" | "battantes" | "ouvert";

export interface DressingConfig {
  projectName: string;
  clientName: string;
  dimensions: { width: number; height: number; depth: number };
  openingStyle: DressingOpeningStyle;
  interior: {
    penderie: boolean;
    etageres: boolean;
    tiroirs: boolean;
    chaussures: boolean;
  };
  woodStyle: WoodStyle;
  woodColor: string;
  handleStyle: HandleStyle;
  budget: "economique" | "standard" | "premium";
  additionalPrompt: string;
}

export type TvUnitStyle = "suspendu" | "sol" | "bibliotheque";

export interface TvUnitConfig {
  projectName: string;
  clientName: string;
  dimensions: { width: number; height: number; depth: number };
  style: TvUnitStyle;
  woodStyle: WoodStyle;
  woodColor: string;
  handleStyle: HandleStyle;
  ledLighting: boolean;
  budget: "economique" | "standard" | "premium";
  additionalPrompt: string;
}

export type UnifiedConfig =
  | { type: "cuisine"; data: KitchenConfig }
  | { type: "dressing"; data: DressingConfig }
  | { type: "tvUnit"; data: TvUnitConfig };

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
