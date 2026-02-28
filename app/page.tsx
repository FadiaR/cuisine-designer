"use client";

import { useState } from "react";
import Header from "@/components/Header";
import StepIndicator from "@/components/StepIndicator";
import StepUpload from "@/components/StepUpload";
import StepConfig from "@/components/StepConfig";
import StepGenerate from "@/components/StepGenerate";
import StepResult from "@/components/StepResult";
import { KitchenConfig, ProjectData } from "@/types";

export default function Home() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>("");
  const [kitchenConfig, setKitchenConfig] = useState<KitchenConfig | null>(null);
  const [projectData, setProjectData] = useState<ProjectData | null>(null);

  const handlePhotoUploaded = (file: File, preview: string) => {
    setPhotoFile(file);
    setPhotoPreview(preview);
    setStep(2);
  };

  const handleConfigDone = (config: KitchenConfig) => {
    setKitchenConfig(config);
    setStep(3);
  };

  const handleGenerationDone = (data: ProjectData) => {
    setProjectData(data);
    setStep(4);
  };

  const handleReset = () => {
    setStep(1);
    setPhotoFile(null);
    setPhotoPreview("");
    setKitchenConfig(null);
    setProjectData(null);
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main
        className="max-w-5xl mx-auto px-4 py-6"
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 24px)" }}
      >
        <StepIndicator currentStep={step} />

        <div className="mt-6">
          {step === 1 && (
            <StepUpload onPhotoUploaded={handlePhotoUploaded} />
          )}
          {step === 2 && (
            <StepConfig
              photoPreview={photoPreview}
              onConfigDone={handleConfigDone}
              onBack={() => setStep(1)}
            />
          )}
          {step === 3 && photoFile && kitchenConfig && (
            <StepGenerate
              photoFile={photoFile}
              photoPreview={photoPreview}
              kitchenConfig={kitchenConfig}
              onGenerationDone={handleGenerationDone}
              onBack={() => setStep(2)}
            />
          )}
          {step === 4 && projectData && kitchenConfig && (
            <StepResult
              projectData={projectData}
              kitchenConfig={kitchenConfig}
              photoPreview={photoPreview}
              onReset={handleReset}
              onRegenerate={() => {
                setProjectData(null);
                setStep(3);
              }}
            />
          )}
        </div>
      </main>
    </div>
  );
}
