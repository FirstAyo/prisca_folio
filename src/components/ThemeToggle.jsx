import { Sun, Moon } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export default function ThemeToggle({ className = "" }) {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";
  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      className={`flex justify-center items-center gap-2 font-semibold py-5 h-10 px-3 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] text-[hsl(var(--card-fg))] hover:opacity-90 ${className}`}
    >
      {isDark ? <Sun size={20} /> : <Moon size={20} />}
      <span className="text-lg hidden sm:inline">
        {isDark ? "Light" : "Dark"}
      </span>
    </button>
  );
}
