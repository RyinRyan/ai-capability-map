import type { Metadata } from "next";
import { Exo_2, Raleway } from "next/font/google";
import "./globals.css";

// Initialize database on server startup
if (typeof window === 'undefined') {
  // Only run on server side
  import('../lib/db').then(({ initDb }) => {
    try {
      initDb();
    } catch (error) {
      console.error('[Layout] Failed to initialize database:', error);
    }
  });
}

const exo2 = Exo_2({
  variable: "--font-exo-2",
  subsets: ["latin"],
  weight: ["300", "400", "600", "700", "900"],
});

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "AI 研发能力探索地图",
  description: "AI R&D Capability Map - 探索 AI 辅助研发能力全景",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${exo2.variable} ${raleway.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
