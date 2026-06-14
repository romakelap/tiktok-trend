import type { Metadata } from "next";
import { Providers } from "./providers";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://tiktok-trend-yvb5.vercel.app"),
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
    url: "https://tiktok-trend-yvb5.vercel.app",
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