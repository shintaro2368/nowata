import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import type { Metadata } from "next";
import { Zen_Maru_Gothic } from "next/font/google";

import "./globals.css";

const inter = Zen_Maru_Gothic({ weight: "400", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Nowata",
  description: "Nowata(Note Working Time) app.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <AppRouterCacheProvider>{children}</AppRouterCacheProvider>
      </body>
    </html>
  );
}
