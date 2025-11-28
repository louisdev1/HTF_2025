import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fishy Dex - Marine Monitoring System",
  description: "Global fish tracking and monitoring system",
  manifest: "/manifest.json",
  themeColor: "#14ffec",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
