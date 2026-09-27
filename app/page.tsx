"use client";

import LandingNavbar from "@/components/landing/LandingNavbar";
import LandingHero from "@/components/landing/LandingHero";
import LandingWorkbench from "@/components/landing/LandingWorkbench";
import LandingArchitecture from "@/components/landing/LandingArchitecture";
import LandingMLModels from "@/components/landing/LandingMLModels";
import LandingUseCases from "@/components/landing/LandingUseCases";
import LandingFAQ from "@/components/landing/LandingFAQ";
import LandingCTA from "@/components/landing/LandingCTA";
import LandingFooter from "@/components/landing/LandingFooter";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 text-stone-900 dark:text-neutral-100 font-sans selection:bg-stone-900 selection:text-white dark:selection:bg-white dark:selection:text-stone-900">
      {/* Top Navbar */}
      <LandingNavbar />

      {/* Hero Section with Interactive 3D Wireframe Canvas */}
      <LandingHero />

      {/* Live Simulation Workbench (Dashboard Interface Preview) */}
      <LandingWorkbench />

      {/* 4-Stage Microservice Value Creation Architecture */}
      <LandingArchitecture />

      {/* 5 Machine Learning Algorithms Showcase */}
      <LandingMLModels />

      {/* Target Personas & Use Cases */}
      <LandingUseCases />

      {/* Technical FAQ & Methodology */}
      <LandingFAQ />

      {/* Final Call to Action */}
      <LandingCTA />

      {/* System Footer */}
      <LandingFooter />
    </div>
  );
}
