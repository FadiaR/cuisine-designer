"use client";

const STEPS = [
  { number: 1, label: "Photo", sublabel: "Téléchargez votre pièce" },
  { number: 2, label: "Configuration", sublabel: "Style & dimensions" },
  { number: 3, label: "Génération IA", sublabel: "Création du rendu" },
  { number: 4, label: "Résultat", sublabel: "Votre cuisine" },
];

interface Props {
  currentStep: number;
}

export default function StepIndicator({ currentStep }: Props) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between relative">
        {/* Connecting line */}
        <div className="absolute top-5 left-0 right-0 h-0.5 z-0"
          style={{ background: 'var(--border)', margin: '0 24px' }}>
          <div
            className="h-full transition-all duration-500"
            style={{
              background: 'linear-gradient(90deg, #8B6914, #C4972A)',
              width: `${((currentStep - 1) / 3) * 100}%`
            }}
          />
        </div>

        {STEPS.map((s) => {
          const isDone = currentStep > s.number;
          const isActive = currentStep === s.number;

          return (
            <div key={s.number} className="flex flex-col items-center gap-2 relative z-10">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                  isDone ? 'step-done' : isActive ? 'step-active' : 'step-pending'
                }`}
              >
                {isDone ? '✓' : s.number}
              </div>
              <div className="text-center hidden sm:block">
                <p className={`text-sm font-semibold ${isActive ? '' : 'opacity-60'}`}
                  style={{ color: isActive ? 'var(--primary)' : 'var(--foreground)' }}>
                  {s.label}
                </p>
                <p className="text-xs" style={{ color: 'var(--muted)' }}>
                  {s.sublabel}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
