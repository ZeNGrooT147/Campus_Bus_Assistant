import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Ensure dark class is applied to HTML element
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  if (!mounted) {
    return (
      <div className="w-14 h-7 bg-gray-200 rounded-full p-1">
        <div className="w-5 h-5 bg-white rounded-full shadow-md" />
      </div>
    );
  }

  const isDark = theme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <button
      onClick={toggleTheme}
      className={`
        relative w-14 h-7 rounded-full p-1 transition-colors duration-300 ease-in-out
        ${isDark ? "bg-gray-700" : "bg-gray-200"}
        hover:${isDark ? "bg-gray-600" : "bg-gray-300"}
      `}
      aria-label="Toggle theme"
    >
      {/* Slider circle */}
      <div
        className={`
          absolute top-1 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ease-in-out
          ${isDark ? "translate-x-7" : "translate-x-0"}
        `}
      />

      {/* Icons */}
      <Sun
        className={`
          absolute top-1.5 left-1.5 w-4 h-4 transition-opacity duration-300
          ${isDark ? "opacity-0" : "opacity-100 text-yellow-500"}
        `}
      />
      <Moon
        className={`
          absolute top-1.5 right-1.5 w-4 h-4 transition-opacity duration-300
          ${isDark ? "opacity-100 text-blue-300" : "opacity-0"}
        `}
      />
    </button>
  );
}
