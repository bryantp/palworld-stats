import "bootstrap/dist/css/bootstrap.min.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from '@vercel/analytics/react';
import "./globals.css";
import BootstrapClient from '../../src/components/BootstrapClient';



const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Palstoria",
  description: "Palstoria server information",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <BootstrapClient />
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
