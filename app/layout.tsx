import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#8B6914",
};

export const metadata: Metadata = {
  title: "CuisineIA — Cuisines Sur-Mesure",
  description: "Visualisez votre cuisine sur-mesure en quelques secondes grâce à l'IA",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "CuisineIA",
  },
  icons: {
    apple: "/apple-touch-icon.svg",
    icon: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="CuisineIA" />
        <meta name="format-detection" content="telephone=no" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.svg" />
      </head>
      <body className="antialiased min-h-screen" style={{ background: "var(--background)" }}>
        {children}
      </body>
    </html>
  );
}
