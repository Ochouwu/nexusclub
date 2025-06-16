import { Inter } from 'next/font/google';
import "./globals.css";
import type { Metadata } from 'next';

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'Nexus Club',
  description: 'Carnet oficial del Club Nexus',
  icons: {
    icon: '/logo.png', // asegúrate que exista en /public
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={inter.variable}>
      <head>
        <link rel="icon" href="/logo.ico" />
        <title>Carnet Nexus</title>
        <meta name="description" content="Carnet oficial del Club Nexus" />
      </head>
      <body>{children}</body>
    </html>
  );
}


