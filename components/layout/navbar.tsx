import ThemeToggle from "@/components/global/theme-toggle";
import LanguageSwitcher from "@/components/global/language-switcher";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between p-4 border-b">
      <h1 className="font-bold text-lg">Dashboard</h1>

      <div className="flex items-center gap-3">
        <LanguageSwitcher />
        <ThemeToggle />
      </div>
    </nav>
  );
}
