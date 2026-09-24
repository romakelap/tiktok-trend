"use client";

import * as React from "react";

type AuthSplitLayoutProps = {
  /** Which side the form appears on. */
  formSide?: "left" | "right";
  /** The form panel (light). */
  form: React.ReactNode;
  /** The marketing/preview panel (dark). Hidden on small screens. */
  preview: React.ReactNode;
};

/**
 * Two-column split layout for authentication pages consistent with Landing Page design language.
 */
export function AuthSplitLayout({
  formSide = "right",
  form,
  preview,
}: AuthSplitLayoutProps) {
  return (
    <div className="min-h-screen w-full grid lg:grid-cols-12 bg-white selection:bg-black selection:text-white">
      {formSide === "right" ? (
        <>
          {/* Left Preview Panel (Desktop only) */}
          <div className="hidden lg:flex lg:col-span-6 xl:col-span-7 relative flex-col items-center justify-center p-8 lg:p-12 xl:p-16 bg-[#0E0E10] text-white overflow-hidden border-r border-stone-800/80">
            {preview}
          </div>

          {/* Right Form Panel */}
          <div className="col-span-12 lg:col-span-6 xl:col-span-5 relative flex flex-col justify-between p-6 sm:p-10 md:p-14 bg-stone-50/50 overflow-y-auto">
            {form}
          </div>
        </>
      ) : (
        <>
          {/* Left Form Panel */}
          <div className="col-span-12 lg:col-span-6 xl:col-span-5 relative flex flex-col justify-between p-6 sm:p-10 md:p-14 bg-stone-50/50 overflow-y-auto">
            {form}
          </div>

          {/* Right Preview Panel (Desktop only) */}
          <div className="hidden lg:flex lg:col-span-6 xl:col-span-7 relative flex-col items-center justify-center p-8 lg:p-12 xl:p-16 bg-[#0E0E10] text-white overflow-hidden border-l border-stone-800/80">
            {preview}
          </div>
        </>
      )}
    </div>
  );
}
