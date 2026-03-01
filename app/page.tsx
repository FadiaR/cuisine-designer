"use client";

import { useState } from "react";
import Header from "@/components/Header";
import StepIndicator from "@/components/StepIndicator";
import StepUpload from "@/components/StepUpload";
import StepConfig from "@/components/StepConfig";
import StepConfigDressing from "@/components/StepConfigDressing";
import StepConfigTvUnit from "@/components/StepConfigTvUnit";
import StepGenerate from "@/components/StepGenerate";
import StepResult from "@/components/StepResult";
import { ProjectType, KitchenConfig, DressingConfig, TvUnitConfig, UnifiedConfig, ProjectData } from "@/types";

export default function Home() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>("");
  const [projectType, setProjectType] = useState<ProjectType>("cuisine");
  const [unifiedConfig, setUnifiedConfig] = useState<UnifiedConfig | null>(null);
  const [projectData, setProjectData] = useState<ProjectData | null>(null);

  const handlePhotoUploaded = (file: File, preview: string, type: ProjectType) => {
    setPhotoFile(file);
    setPhotoPreview(preview);
    setProjectType(type);
    setStep(2);
  };

  const handleKitchenConfigDone = (config: KitchenConfig) => {
    setUnifiedConfig({ type: "cuisine", data: config });
    setStep(3);
  };

  const handleDressingConfigDone = (config: DressingConfig) => {
    setUnifiedConfig({ type: "dressing", data: config });
    setStep(3);
  };

  const handleTvUnitConfigDone = (config: TvUnitConfig) => {
    setUnifiedConfig({ type: "tvUnit", data: config });
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
    setUnifiedConfig(null);
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
          {step === 2 && projectType === "cuisine" && (
            <StepConfig
              photoPreview={photoPreview}
              onConfigDone={handleKitchenConfigDone}
              onBack={() => setStep(1)}
            />
          )}
          {step === 2 && projectType === "dressing" && (
            <StepConfigDressing
              photoPreview={photoPreview}
              onConfigDone={handleDressingConfigDone}
              onBack={() => setStep(1)}
            />
          )}
          {step === 2 && projectType === "tvUnit" && (
            <StepConfigTvUnit
              photoPreview={photoPreview}
              onConfigDone={handleTvUnitConfigDone}
              onBack={() => setStep(1)}
            />
          )}
          {step === 3 && photoFile && unifiedConfig && (
            <StepGenerate
              photoFile={photoFile}
              photoPreview={photoPreview}
              unifiedConfig={unifiedConfig}
              onGenerationDone={handleGenerationDone}
              onBack={() => setStep(2)}
            />
          )}
          {step === 4 && projectData && unifiedConfig && (
            <StepResult
              projectData={projectData}
              unifiedConfig={unifiedConfig}
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
