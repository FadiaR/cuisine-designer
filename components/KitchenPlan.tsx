"use client";

import { useEffect, useRef } from "react";
import { KitchenConfig } from "@/types";

interface Props {
  config: KitchenConfig;
}

const SCALE = 60; // pixels per meter
const PADDING = 40;
const CABINET_DEPTH = 0.6; // meters
const ISLAND_DEPTH = 1.0;
const ISLAND_WIDTH = 1.5;

export default function KitchenPlan({ config }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = config.dimensions.width * SCALE;
    const L = config.dimensions.length * SCALE;
    const D = CABINET_DEPTH * SCALE;

    canvas.width = W + PADDING * 2;
    canvas.height = L + PADDING * 2;

    // Background
    ctx.fillStyle = "#FAFAFA";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Room outline
    ctx.strokeStyle = "#1a1a1a";
    ctx.lineWidth = 3;
    ctx.strokeRect(PADDING, PADDING, W, L);

    // Grid (subtle)
    ctx.strokeStyle = "#E8E0D4";
    ctx.lineWidth = 0.5;
    for (let x = 0; x <= config.dimensions.width; x += 0.5) {
      ctx.beginPath();
      ctx.moveTo(PADDING + x * SCALE, PADDING);
      ctx.lineTo(PADDING + x * SCALE, PADDING + L);
      ctx.stroke();
    }
    for (let y = 0; y <= config.dimensions.length; y += 0.5) {
      ctx.beginPath();
      ctx.moveTo(PADDING, PADDING + y * SCALE);
      ctx.lineTo(PADDING + W, PADDING + y * SCALE);
      ctx.stroke();
    }

    // Draw cabinets based on layout
    ctx.fillStyle = "#C4972A";
    ctx.strokeStyle = "#8B6914";
    ctx.lineWidth = 1.5;

    const drawCabinet = (x: number, y: number, w: number, h: number, label?: string) => {
      const rx = PADDING + x * SCALE;
      const ry = PADDING + y * SCALE;
      const rw = w * SCALE;
      const rh = h * SCALE;

      // Cabinet fill
      ctx.fillStyle = "#F5E8C8";
      ctx.fillRect(rx, ry, rw, rh);
      ctx.strokeStyle = "#8B6914";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(rx, ry, rw, rh);

      // Door lines (horizontal or vertical depending on orientation)
      ctx.strokeStyle = "#C4972A";
      ctx.lineWidth = 0.8;
      if (rw > rh) {
        // Horizontal cabinets: vertical dividers every ~0.6m
        const segments = Math.max(1, Math.round(w / 0.6));
        for (let i = 1; i < segments; i++) {
          ctx.beginPath();
          ctx.moveTo(rx + (rw * i) / segments, ry + 4);
          ctx.lineTo(rx + (rw * i) / segments, ry + rh - 4);
          ctx.stroke();
        }
      } else {
        // Vertical cabinets: horizontal dividers
        const segments = Math.max(1, Math.round(h / 0.6));
        for (let i = 1; i < segments; i++) {
          ctx.beginPath();
          ctx.moveTo(rx + 4, ry + (rh * i) / segments);
          ctx.lineTo(rx + rw - 4, ry + (rh * i) / segments);
          ctx.stroke();
        }
      }

      // Label
      if (label) {
        ctx.fillStyle = "#5C3D1E";
        ctx.font = `bold ${Math.min(10, Math.min(rw, rh) * 0.35)}px Arial`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(label, rx + rw / 2, ry + rh / 2);
      }
    };

    const { width: roomW, length: roomL } = config.dimensions;

    switch (config.layout) {
      case "lineaire":
        drawCabinet(0, 0, roomW, CABINET_DEPTH, "Meubles bas");
        break;

      case "L":
        drawCabinet(0, 0, roomW, CABINET_DEPTH, "Meubles bas");
        drawCabinet(0, CABINET_DEPTH, CABINET_DEPTH, roomL - CABINET_DEPTH, "");
        break;

      case "U":
        drawCabinet(0, 0, roomW, CABINET_DEPTH);
        drawCabinet(0, CABINET_DEPTH, CABINET_DEPTH, roomL - CABINET_DEPTH * 2);
        drawCabinet(roomW - CABINET_DEPTH, CABINET_DEPTH, CABINET_DEPTH, roomL - CABINET_DEPTH * 2);
        drawCabinet(0, roomL - CABINET_DEPTH, roomW, CABINET_DEPTH);
        break;

      case "ilot":
        drawCabinet(0, 0, roomW, CABINET_DEPTH, "Meubles bas");
        // Island in center
        const islandX = (roomW - ISLAND_WIDTH) / 2;
        const islandY = (roomL - ISLAND_DEPTH) / 2;
        drawCabinet(islandX, islandY, ISLAND_WIDTH, ISLAND_DEPTH, "Îlot");
        break;

      case "parallele":
        drawCabinet(0, 0, roomW, CABINET_DEPTH, "Côté 1");
        drawCabinet(0, roomL - CABINET_DEPTH, roomW, CABINET_DEPTH, "Côté 2");
        break;
    }

    // Dimensions annotations
    ctx.fillStyle = "#5C3D1E";
    ctx.font = "bold 11px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Width annotation
    ctx.strokeStyle = "#8B6914";
    ctx.lineWidth = 1;
    const yDim = PADDING + L + 20;
    ctx.beginPath();
    ctx.moveTo(PADDING, yDim);
    ctx.lineTo(PADDING + W, yDim);
    ctx.stroke();
    ctx.beginPath(); // left tick
    ctx.moveTo(PADDING, yDim - 5);
    ctx.lineTo(PADDING, yDim + 5);
    ctx.stroke();
    ctx.beginPath(); // right tick
    ctx.moveTo(PADDING + W, yDim - 5);
    ctx.lineTo(PADDING + W, yDim + 5);
    ctx.stroke();
    ctx.fillStyle = "#8B6914";
    ctx.fillText(`${config.dimensions.width.toFixed(2)} m`, PADDING + W / 2, yDim);

    // Length annotation
    const xDim = PADDING + W + 20;
    ctx.save();
    ctx.translate(xDim, PADDING + L / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(`${config.dimensions.length.toFixed(2)} m`, 0, 0);
    ctx.restore();
    ctx.beginPath();
    ctx.moveTo(xDim - 4, PADDING);
    ctx.lineTo(xDim + 4, PADDING);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(xDim, PADDING);
    ctx.lineTo(xDim, PADDING + L);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(xDim - 4, PADDING + L);
    ctx.lineTo(xDim + 4, PADDING + L);
    ctx.stroke();

    // North indicator
    ctx.fillStyle = "#2D5A3D";
    ctx.font = "bold 10px Arial";
    ctx.textAlign = "left";
    ctx.fillText("Plan vu du dessus", PADDING, PADDING - 12);

    // Scale bar
    ctx.fillStyle = "#8a7d6b";
    ctx.font = "10px Arial";
    ctx.textAlign = "left";
    ctx.fillText("Échelle 1:50", PADDING, PADDING + L + 34);

  }, [config]);

  return (
    <div className="plan-canvas-container overflow-x-auto">
      <canvas ref={canvasRef} style={{ display: 'block', maxWidth: '100%' }} />
    </div>
  );
}
