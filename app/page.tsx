"use client";

import LandingNavbar from "@/components/landing/LandingNavbar";
import LandingHero from "@/components/landing/LandingHero";
import LandingArchitecture from "@/components/landing/LandingArchitecture";
import LandingFeatures from "@/components/landing/LandingFeatures";
import LandingMLModels from "@/components/landing/LandingMLModels";
import LandingUseCases from "@/components/landing/LandingUseCases";
import LandingFAQ from "@/components/landing/LandingFAQ";
import LandingCTA from "@/components/landing/LandingCTA";
import LandingFooter from "@/components/landing/LandingFooter";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-stone-900 selection:text-white">
      {/* Dynamic Glassmorphism Navbar */}
      <LandingNavbar />

      {/* Hero with 3D Perspective Cockpit Preview */}
      <LandingHero />

      {/* 4-Stage Microservice Value Creation Architecture */}
      <LandingArchitecture />

      {/* 8 Core Analytics Modules */}
      <LandingFeatures />

      {/* 5 Machine Learning Algorithms Showcase */}
      <LandingMLModels />

      {/* Target Personas & Use Cases */}
      <LandingUseCases />

      {/* Technical FAQ */}
      <LandingFAQ />

      {/* Final Call to Action */}
      <LandingCTA />

      {/* Thesis & System Footer */}
      <LandingFooter />
    </div>
  );
}
