"use client";

import { ChefHat } from "lucide-react";

export default function Header() {
  return (
    <header
      className="border-b sticky top-0 z-50"
      style={{
        borderColor: "var(--border)",
        background: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        paddingTop: "env(safe-area-inset-top)",
      }}
    >
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center gradient-wood flex-shrink-0">
            <ChefHat size={18} color="white" />
          </div>
          <div>
            <h1 className="font-bold text-base leading-none" style={{ color: "var(--primary)" }}>
              CuisineIA
            </h1>
            <p className="text-xs hidden sm:block" style={{ color: "var(--muted)" }}>
              Cuisines sur-mesure par IA
            </p>
          </div>
        </div>
        <span
          className="text-xs px-3 py-1 rounded-full font-medium"
          style={{ background: "rgba(45, 90, 61, 0.1)", color: "var(--accent)" }}
        >
          IA
        </span>
      </div>
    </header>
  );
}
