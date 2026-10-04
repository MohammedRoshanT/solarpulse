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
  title: "Heliowatch | Space Weather Dashboard",
  description: "Space weather, as it happens. Educational dashboard for the NASA Space Apps Challenge.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${ibmPlexSans.variable} ${ibmPlexMono.variable} antialiased scroll-smooth`}>
      <body className="min-h-screen bg-[#070A10] text-[#E6EAF2] font-sans selection:bg-[#7FB2D9] selection:text-[#070A10]">
        <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-[-1]">
          <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-[#FF963C] opacity-[0.09] blur-[120px] rounded-full" />
          <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] bg-[#3CC8AA] opacity-[0.07] blur-[120px] rounded-full" />
        </div>
        {children}
      </body>
    </html>
  );
}
