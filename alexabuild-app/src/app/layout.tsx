import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Alexa+ Smart Productivity Agent | AWS Build Hackathon",
  description:
    "An Alexa+ Ambient AI Assistant powered by AWS Bedrock with MCP (Model Context Protocol) tool calling, real-time voice waveform visualization, and intelligent workflow automation.",
  keywords: ["Alexa+", "AWS Bedrock", "MCP", "AI Assistant", "Hackathon", "Amazon"],
  openGraph: {
    title: "Alexa+ Smart Productivity Agent",
    description: "Ambient AI Assistant with AWS Bedrock & MCP Integration",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-slate-950 text-slate-100 min-h-screen">
        {children}
      </body>
    </html>
  );
}
