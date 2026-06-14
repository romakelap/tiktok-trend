import type { Metadata } from "next";
import { Providers } from "./providers";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "TikTok Trend Analytics",
  description: "TikTok analytics and ML insight dashboard",
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