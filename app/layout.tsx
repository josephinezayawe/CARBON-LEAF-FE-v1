import "./globals.css";
import { ThemeProvider } from "@/components/global/theme-provider";
import { LanguageProvider } from "@/components/global/language-provider";
import { Toaster } from "@/components/ui/sonner";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </ThemeProvider>
    <html lang="en">
      <body
      >
        {children}
        <Toaster richColors/>
      </body>
    </html>
  );
}
