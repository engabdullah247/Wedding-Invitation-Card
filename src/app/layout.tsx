import type { Metadata, Viewport } from "next";
import "@fontsource/cormorant-garamond/latin-500.css";
import "@fontsource/cormorant-garamond/latin-500-italic.css";
import "@fontsource/cormorant-garamond/latin-600.css";
import "@fontsource/jost/latin-400.css";
import "@fontsource/jost/latin-500.css";
import "@fontsource/jost/latin-600.css";
import "@fontsource/pinyon-script/latin-400.css";
import "./globals.css";
import { MusicProvider } from "@/components/MusicProvider";
import { wedding } from "@/config/wedding";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: wedding.site.title,
  description: wedding.site.description,
  openGraph: {
    title: wedding.site.title,
    description: wedding.site.description,
    type: "website",
    siteName: "M & S Wedding Invitation",
  },
  twitter: {
    card: "summary_large_image",
    title: wedding.site.title,
    description: wedding.site.description,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#3b1424",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* Browser extensions (e.g. ColorZilla) inject attributes into <body> before React hydrates. */}
      <body suppressHydrationWarning>
        <MusicProvider>{children}</MusicProvider>
      </body>
    </html>
  );
}
