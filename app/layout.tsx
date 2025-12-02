import "./globals.css";
import { ThemeProvider } from "@/components/global/theme-provider";
import { LanguageProvider } from "@/components/global/language-provider";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/context/authContext";

export const metadata = {
  title: "Carbon Leaf",
  description: "Carbon Leaf - Sustainable Solutions",
  icons: {
    icon: "/images/logos/Favicon_CARBON LEAF.svg",
  },
};



export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AuthProvider>
          <ThemeProvider>
            <LanguageProvider>
              {children}
              <Toaster richColors />
            </LanguageProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
