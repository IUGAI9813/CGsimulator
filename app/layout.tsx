import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CoreGuard Simulator (CGS) - Autonomous Fleet & Cyber-Attack Engine",
  description: "Real-time telemetry generator, failure & cyber-attack injection engine for autonomous vehicles and SOC console integration.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="dark" className="h-full">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
