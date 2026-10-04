import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-ibm-plex-sans",
  weight: ["400", "500", "600"],
  subsets: ["latin"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  weight: ["400", "500"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SolarPulse | Space Weather Dashboard",
  description: "Space weather, as it happens. Educational dashboard for the NASA Space Apps Challenge.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${ibmPlexSans.variable} ${ibmPlexMono.variable} antialiased scroll-smooth`}>
      <body className="min-h-screen bg-brand-bg text-brand-text font-sans selection:bg-brand-blue selection:text-brand-bg overflow-x-hidden">
        <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-[-1]">
          <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-brand-amber opacity-[0.05] blur-[120px] rounded-full" />
          <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] bg-brand-teal opacity-[0.04] blur-[120px] rounded-full" />
        </div>
        {children}
      </body>
    </html>
  );
}
