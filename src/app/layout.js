import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "AI Recipe Generator",
  description: "Internship Assignment 3",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen font-sans antialiased dark", // <-- 'bg-background' is removed here
          fontSans.variable
        )}
      >
        <video autoPlay muted loop className="background-video">
          <source src="/background-video.mp4" type="video/mp4" />
        </video>
        <main className="relative z-10">
          {children}
        </main>
      </body>
    </html>
  );
}