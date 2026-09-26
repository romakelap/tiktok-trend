"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { usePathname, useRouter } from "next/navigation";
import { IconChevronRight, IconChevronLeft, IconX } from "@tabler/icons-react";

type Step = {
  title: string;
  desc: string;
  selector: string;
};

export function OnboardingTour() {
  const { t } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();
  
  const [activeStep, setActiveStep] = useState<number>(-1);
  const [stepElement, setStepElement] = useState<DOMRect | null>(null);
  
  // Resolve dynamic steps based on current path
  const getSteps = useCallback((): Step[] => {
    switch (pathname) {
      case "/analytics":
        return [
          {
            title: t("tour_analytics_welcome_title"),
            desc: t("tour_analytics_welcome_desc"),
            selector: "", // Center
          },
          {
            title: t("tour_analytics_kpi"),
            desc: t("tour_analytics_kpi_desc"),
            selector: "#kpi",
          },
          {
            title: t("tour_analytics_historical"),
            desc: t("tour_analytics_historical_desc"),
            selector: "#historical",
          },
          {
            title: t("tour_analytics_performance"),
            desc: t("tour_analytics_performance_desc"),
            selector: "#performance",
          },
          {
            title: t("tour_analytics_schedule"),
            desc: t("tour_analytics_schedule_desc"),
            selector: "#schedule",
          },
          {
            title: t("tour_analytics_recs"),
            desc: t("tour_analytics_recs_desc"),
            selector: "#recs",
          },
        ];
      case "/nlp-insight":
        return [
          {
            title: t("tour_nlp_welcome_title"),
            desc: t("tour_nlp_welcome_desc"),
            selector: "", // Center
          },
          {
            title: t("tour_nlp_toolbar"),
            desc: t("tour_nlp_toolbar_desc"),
            selector: "#nlp-toolbar",
          },
          {
            title: t("tour_nlp_metrics"),
            desc: t("tour_nlp_metrics_desc"),
            selector: "#nlp-metrics",
          },
          {
            title: t("tour_nlp_summary"),
            desc: t("tour_nlp_summary_desc"),
            selector: "#nlp-summary",
          },
          {
            title: t("tour_nlp_insights"),
            desc: t("tour_nlp_insights_desc"),
            selector: "#nlp-insights",
          },
          {
            title: t("tour_nlp_cloud"),
            desc: t("tour_nlp_cloud_desc"),
            selector: "#nlp-cloud",
          },
          {
            title: t("tour_nlp_sentiment"),
            desc: t("tour_nlp_sentiment_desc"),
            selector: "#nlp-sentiment",
          },
        ];
      case "/hashtag":
        return [
          {
            title: t("tour_hashtag_welcome_title"),
            desc: t("tour_hashtag_welcome_desc"),
            selector: "", // Center
          },
          {
            title: t("tour_hashtag_kpi"),
            desc: t("tour_hashtag_kpi_desc"),
            selector: "#hashtag-kpi",
          },
          {
            title: t("tour_hashtag_categories"),
            desc: t("tour_hashtag_categories_desc"),
            selector: "#hashtag-categories",
          },
          {
            title: t("tour_hashtag_top"),
            desc: t("tour_hashtag_top_desc"),
            selector: "#hashtag-top",
          },
          {
            title: t("tour_hashtag_cross"),
            desc: t("tour_hashtag_cross_desc"),
            selector: "#hashtag-cross",
          },
          {
            title: t("tour_hashtag_hot"),
            desc: t("tour_hashtag_hot_desc"),
            selector: "#hashtag-hot",
          },
        ];
      case "/keyword":
        return [
          {
            title: t("tour_keyword_welcome_title"),
            desc: t("tour_keyword_welcome_desc"),
            selector: "", // Center
          },
          {
            title: t("tour_keyword_categories"),
            desc: t("tour_keyword_categories_desc"),
            selector: "#keyword-categories",
          },
          {
            title: t("tour_keyword_kpi"),
            desc: t("tour_keyword_kpi_desc"),
            selector: "#keyword-kpi",
          },
          {
            title: t("tour_keyword_charts_row1"),
            desc: t("tour_keyword_charts_row1_desc"),
            selector: "#keyword-charts-row1",
          },
          {
            title: t("tour_keyword_charts_row2"),
            desc: t("tour_keyword_charts_row2_desc"),
            selector: "#keyword-charts-row2",
          },
        ];
      case "/timeposting":
        return [
          {
            title: t("tour_timeposting_welcome_title"),
            desc: t("tour_timeposting_welcome_desc"),
            selector: "", // Center
          },
          {
            title: t("tour_timeposting_filter"),
            desc: t("tour_timeposting_filter_desc"),
            selector: "#timeposting-filter",
          },
          {
            title: t("tour_timeposting_heatmap"),
            desc: t("tour_timeposting_heatmap_desc"),
            selector: "#timeposting-heatmap",
          },
          {
            title: t("tour_timeposting_optimization"),
            desc: t("tour_timeposting_optimization_desc"),
            selector: "#timeposting-optimization",
          },
          {
            title: t("tour_timeposting_table"),
            desc: t("tour_timeposting_table_desc"),
            selector: "#timeposting-table",
          },
          {
            title: t("tour_timeposting_videos"),
            desc: t("tour_timeposting_videos_desc"),
            selector: "#timeposting-videos",
          },
        ];
      case "/video-library":
        return [
          {
            title: t("tour_video_welcome_title"),
            desc: t("tour_video_welcome_desc"),
            selector: "", // Center
          },
          {
            title: t("tour_video_kpis"),
            desc: t("tour_video_kpis_desc"),
            selector: "#video-kpis",
          },
          {
            title: t("tour_video_list"),
            desc: t("tour_video_list_desc"),
            selector: "#video-list-container",
          },
        ];
      case "/dashboard":
      default:
        return [
          {
            title: t("welcome_title"),
            desc: t("welcome_desc"),
            selector: "", // Center
          },
          {
            title: t("dashboard"),
            desc: t("step_sidebar"),
            selector: '[data-sidebar="sidebar"]',
          },
          {
            title: t("total_views"),
            desc: t("step_metrics"),
            selector: "#kpi",
          },
          {
            title: t("category_insight"),
            desc: t("step_category"),
            selector: "#category",
          },
          {
            title: t("performance_overview"),
            desc: t("step_chart"),
            selector: "#trend",
          },
          {
            title: t("category_insight"),
            desc: t("step_combination"),
            selector: "#combination",
          },
        ];
    }
  }, [pathname, t]);

  const steps = getSteps();

  const updateHighlight = useCallback(() => {
    if (activeStep < 0 || activeStep >= steps.length) {
      setStepElement(null);
      return;
    }

    const selector = steps[activeStep].selector;
    if (!selector) {
      setStepElement(null);
      return;
    }

    const el = document.querySelector(selector);
    if (el) {
      const rect = el.getBoundingClientRect();
      setStepElement(rect);
    } else {
      setStepElement(null);
    }
  }, [activeStep, steps]);

  // Recalculate position on resize/scroll/activeStep change
  useEffect(() => {
    if (activeStep >= 0 && activeStep < steps.length) {
      const selector = steps[activeStep].selector;
      if (selector) {
        const el = document.querySelector(selector);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
    }
    
    const timer = setTimeout(() => {
      updateHighlight();
    }, 200);

    window.addEventListener("resize", updateHighlight);
    window.addEventListener("scroll", updateHighlight, { capture: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updateHighlight);
      window.removeEventListener("scroll", updateHighlight, { capture: true });
    };
  }, [activeStep, updateHighlight, steps]);

  // Check if onboarding needs to run automatically on first load for this page
  useEffect(() => {
    const tourPages = [
      "/dashboard", "/analytics", "/nlp-insight",
      "/hashtag", "/keyword", "/timeposting", "/account-management",
      "/video-library"
    ];
    if (!tourPages.includes(pathname)) return;

    const isCompleted = localStorage.getItem(`onboarding-completed-${pathname}`);
    const isRedirectTour = sessionStorage.getItem("play-onboarding-tour") === "true";
    
    if (isRedirectTour && pathname === "/dashboard") {
      sessionStorage.removeItem("play-onboarding-tour");
      const timer = setTimeout(() => {
        setActiveStep(0);
      }, 800);
      return () => clearTimeout(timer);
    } else if (!isCompleted) {
      const timer = setTimeout(() => {
        setActiveStep(0);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [pathname]);

  // Listen for manual trigger
  useEffect(() => {
    const handleStartTour = () => {
      const tourPages = [
        "/dashboard", "/analytics", "/nlp-insight",
        "/hashtag", "/keyword", "/timeposting", "/account-management",
        "/video-library"
      ];
      if (!tourPages.includes(pathname)) {
        sessionStorage.setItem("play-onboarding-tour", "true");
        router.push("/dashboard");
      } else {
        setActiveStep(0);
      }
    };
    
    window.addEventListener("start-onboarding-tour", handleStartTour);
    return () => {
      window.removeEventListener("start-onboarding-tour", handleStartTour);
    };
  }, [pathname, router]);

  if (activeStep < 0 || activeStep >= steps.length) return null;

  const currentStep = steps[activeStep];
  const isFirst = activeStep === 0;
  const isLast = activeStep === steps.length - 1;

  const handleNext = () => {
    if (isLast) {
      handleComplete();
    } else {
      setActiveStep(activeStep + 1);
    }
  };

  const handleBack = () => {
    if (!isFirst) {
      setActiveStep(activeStep - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem(`onboarding-completed-${pathname}`, "true");
    setActiveStep(-1);
  };

  const handleSkip = () => {
    handleComplete();
  };

  // Get dynamic tooltip card styles
  const getCardStyle = (): React.CSSProperties => {
    if (!stepElement) {
      return {
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 1000,
      };
    }

    const cardWidth = 350;
    const cardHeight = 220; 
    
    const isSidebar = steps[activeStep]?.selector === '[data-sidebar="sidebar"]';
    
    if (isSidebar) {
      return {
        position: "fixed",
        top: "140px", 
        left: `${stepElement.right + 24}px`,
        zIndex: 1000,
      };
    }

    let top = stepElement.bottom + 16;
    let left = Math.max(16, Math.min(window.innerWidth - cardWidth - 16, stepElement.left));

    const spaceBelow = window.innerHeight - stepElement.bottom;
    const spaceAbove = stepElement.top;

    if (spaceBelow < cardHeight && spaceAbove > cardHeight) {
      top = stepElement.top - cardHeight - 16;
    }
    else if (spaceBelow < cardHeight && spaceAbove < cardHeight) {
      top = Math.max(80, window.innerHeight / 2 - cardHeight / 2);
      left = Math.max(16, window.innerWidth / 2 - cardWidth / 2);
    }

    return {
      position: "fixed",
      top: `${top}px`,
      left: `${left}px`,
      zIndex: 1000,
    };
  };

  // Get SVG cutout path for the spotlight
  const getClipPath = (): string => {
    if (!stepElement) return "";
    
    // Target element coordinates
    const x = stepElement.left - 8;
    const y = stepElement.top - 8;
    const w = stepElement.width + 16;
    const h = stepElement.height + 16;
    const r = 12; // rounded corner radius
    
    // Viewport dimensions
    const vw = typeof window !== "undefined" ? window.innerWidth : 1920;
    const vh = typeof window !== "undefined" ? window.innerHeight : 1080;
    
    // Outer rectangle (viewport size)
    const outer = `M 0 0 H ${vw} V ${vh} H 0 Z`;
    
    // Inner rounded rectangle cutout
    const inner = `M ${x + r} ${y} H ${x + w - r} a ${r} ${r} 0 0 1 ${r} ${r} V ${y + h - r} a ${r} ${r} 0 0 1 ${-r} ${r} H ${x + r} a ${r} ${r} 0 0 1 ${-r} ${-r} V ${y + r} a ${r} ${r} 0 0 1 ${r} ${-r} Z`;
    
    return `${outer} ${inner}`;
  };

  const clipPathD = getClipPath();

  return (
    <div className="fixed inset-0 z-[998] overflow-hidden pointer-events-none">
      {/* Invisible SVG definition for the clipPath */}
      <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true" style={{ position: "absolute", width: 0, height: 0 }}>
        <defs>
          <clipPath id="onboarding-spotlight-clip" clipPathUnits="userSpaceOnUse">
            {stepElement && (
              <path 
                d={clipPathD} 
                clipRule="evenodd"
                style={{ transition: "d 0.3s ease-out" }}
              />
            )}
          </clipPath>
        </defs>
      </svg>

      {/* Dimmed backdrop with blur */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-[4px] transition-opacity duration-300 pointer-events-auto"
        style={stepElement ? {
          clipPath: "url(#onboarding-spotlight-clip)",
          WebkitClipPath: "url(#onboarding-spotlight-clip)"
        } : undefined}
        onClick={handleSkip}
      />

      {/* Spotlight highlight */}
      {stepElement && (
        <div
          className="fixed border-2 border-rose-500 dark:border-rose-400 rounded-xl pointer-events-none transition-all duration-300 ease-out"
          style={{
            top: stepElement.top - 8,
            left: stepElement.left - 8,
            width: stepElement.width + 16,
            height: stepElement.height + 16,
          }}
        />
      )}

      {/* Tooltip Card */}
      <div
        className="w-[350px] bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl p-6 pointer-events-auto transition-all duration-300 ease-out flex flex-col gap-4 text-neutral-800 dark:text-neutral-200"
        style={getCardStyle()}
      >
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-500 text-xs font-black">
              {activeStep + 1}
            </span>
            {currentStep.title}
          </h3>
          <button 
            onClick={handleSkip} 
            className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-850 cursor-pointer"
          >
            <IconX className="w-4 h-4" />
          </button>
        </div>

        <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed min-h-[60px]">
          {currentStep.desc}
        </p>

        <div className="flex justify-between items-center mt-2">
          {/* Progress dots */}
          <div className="flex gap-1.5">
            {steps.map((_, idx) => (
              <div 
                key={idx} 
                className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === activeStep ? "w-4 bg-rose-500" : "bg-neutral-200 dark:bg-neutral-700"}`} 
              />
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            {!isFirst && (
              <button
                onClick={handleBack}
                className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors text-neutral-600 dark:text-neutral-400 cursor-pointer"
              >
                <IconChevronLeft className="w-3.5 h-3.5" />
                {t("back")}
              </button>
            )}
            <button
              onClick={handleNext}
              className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-lg transition-colors shadow-md shadow-rose-500/20 cursor-pointer"
            >
              {isLast ? t("finish") : t("next")}
              {!isLast && <IconChevronRight className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
