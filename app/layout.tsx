import type { Metadata } from "next";
import { Providers } from "./providers";
import { Toaster } from "sonner";
import "./globals.css";

const baseUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: "TikTok Trend Analytics",
  description: "TikTok analytics and ML insight dashboard",
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
  openGraph: {
    title: "TikTok Trend Analytics",
    description: "TikTok analytics and ML insight dashboard",
    url: baseUrl,
    siteName: "TikTok Trend Analytics",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 1200,
        alt: "TikTok Trend Analytics Preview",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TikTok Trend Analytics",
    description: "TikTok analytics and ML insight dashboard",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}