"use client";

import * as React from "react";

type SocialProvider = "google" | "github" | "tiktok";

const PROVIDERS: Record<
  SocialProvider,
  { label: string; render: () => React.ReactNode }
> = {
  google: {
    label: "Google",
    render: () => (
      <svg className="w-4 h-4" viewBox="0 0 24 24">
        <path
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          fill="#4285F4"
        />
        <path
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          fill="#34A853"
        />
        <path
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          fill="#FBBC05"
        />
        <path
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          fill="#EA4335"
        />
      </svg>
    ),
  },
  github: {
    label: "GitHub",
    render: () => (
      <svg className="w-4 h-4" fill="#333" viewBox="0 0 24 24">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      </svg>
    ),
  },
  tiktok: {
    label: "TikTok",
    render: () => (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.89-.74-3.99-1.72-.08-.07-.17-.17-.25-.25v6.23c.04 2.22-.65 4.54-2.28 6.13-1.71 1.69-4.22 2.37-6.55 1.83-2.61-.54-4.85-2.58-5.46-5.18-.73-2.85.32-6.09 2.71-7.75 1.73-1.22 3.93-1.63 6.01-1.18v4.2c-1.27-.47-2.77-.28-3.84.52-1.15.82-1.63 2.36-1.17 3.73.43 1.34 1.86 2.32 3.28 2.29 1.48.06 2.94-1.01 3.12-2.51.05-.33.02-.67.02-1v-14.4c-.01-.01-.01-.02-.02-.02z" />
      </svg>
    ),
  },
};

type AuthSocialButtonsProps = {
  providers?: SocialProvider[];
  onSelect?: (provider: SocialProvider) => void;
};

/**
 * Row of social sign-in buttons. The actual auth flow is left to the
 * caller via `onSelect`; defaults to a local OAuth simulation callback redirect.
 */
export function AuthSocialButtons({
  providers = ["tiktok"],
  onSelect,
}: AuthSocialButtonsProps) {
  
  const handleSelect = (id: SocialProvider) => {
    if (onSelect) {
      onSelect(id);
      return;
    }

    // Default OAuth flow redirects to simulation URLs if no handler is provided
    if (id === "tiktok") {
      const clientKey = "mock_tiktok_client_key";
      const redirectUri = encodeURIComponent(`${window.location.origin}/auth/callback/tiktok`);
      const authUrl = `/auth/tiktok-authorize?client_key=${clientKey}&redirect_uri=${redirectUri}&state=csrf_tiktok`;
      window.location.href = authUrl;
    } else {
      alert(`Otentikasi via ${id} disimulasikan. Hubungi Administrator untuk konfigurasi token OAuth ${id}.`);
    }
  };

  const colClass = providers.length === 3
    ? "grid-cols-3"
    : providers.length === 2
    ? "grid-cols-2"
    : "grid-cols-1";

  return (
    <div className={`grid ${colClass} gap-3`}>
      {providers.map((id) => {
        const p = PROVIDERS[id];
        return (
          <button
            key={id}
            type="button"
            onClick={() => handleSelect(id)}
            className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 hover:scale-[1.02] hover:-translate-y-0.5 cursor-pointer"
            style={{
              background: "rgba(255,255,255,0.9)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(0,0,0,0.1)",
              color: "#333",
              boxShadow:
                "0 2px 8px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,1)",
            }}
          >
            {p.render()}
            {p.label}
          </button>
        );
      })}
    </div>
  );
}

/**
 * Horizontal "or" divider used between social and email sign-in.
 */
export function AuthDivider({ label = "or" }: { label?: string }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="flex-1 h-px"
        style={{ background: "rgba(0,0,0,0.09)" }}
      />
      <span
        className="text-xs font-bold uppercase tracking-widest"
        style={{ color: "#ccc" }}
      >
        {label}
      </span>
      <div
        className="flex-1 h-px"
        style={{ background: "rgba(0,0,0,0.09)" }}
      />
    </div>
  );
}
