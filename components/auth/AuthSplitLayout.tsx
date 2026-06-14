"use client";

import * as React from "react";

type AuthSplitLayoutProps = {
  /** Which side the form appears on. */
  formSide?: "left" | "right";
  /** The form panel (white). */
  form: React.ReactNode;
  /** The marketing/preview panel (charcoal). Hidden on small screens. */
  preview: React.ReactNode;
};

/**
 * Two-column split layout used by login/signup. The preview panel hides on
 * narrow viewports so the form alone fills the screen.
 */
export function AuthSplitLayout({
  formSide = "right",
  form,
  preview,
}: AuthSplitLayoutProps) {
  return (
    <div
      className="min-h-screen w-full grid lg:grid-cols-2"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {formSide === "right" ? (
        <>
          <div
            className="relative hidden lg:flex flex-col items-center justify-center p-12 overflow-hidden"
            style={{ background: "#2c2c2c" }}
          >
            {preview}
          </div>
          <div
            className="relative flex flex-col p-8 md:p-12 overflow-hidden"
            style={{ background: "#f9f9f9" }}
          >
            {form}
          </div>
        </>
      ) : (
        <>
          <div
            className="relative flex flex-col p-8 md:p-12 overflow-hidden"
            style={{ background: "#f9f9f9" }}
          >
            {form}
          </div>
          <div
            className="relative hidden lg:flex flex-col items-center justify-center p-12 overflow-hidden"
            style={{ background: "#2c2c2c" }}
          >
            {preview}
          </div>
        </>
      )}
    </div>
  );
}
