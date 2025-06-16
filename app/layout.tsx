import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'Nexus Club',
  description: 'Carnet oficial del Club Nexus',
  icons: {
    icon: '/logo.png', // ✅ asegúrate que /public/logo.png exista
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        {/* ✅ Forzamos el favicon manualmente */}
        <link rel="icon" href="/logo.ico" />
        <title>Carnet Nexus</title>
        <meta name="description" content="Carnet oficial del Club Nexus" />
      </head>
      <body>{children}</body>
    </html>
  );
}


