// src/components/ThemeToggle.jsx
import { useTheme } from "../context/ThemeContext";

export default function ThemeToggle({ className = "" }) {
  const { toggleTheme, isDark } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      aria-label="Toggle theme"
      className={`relative inline-flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 ${className}`}
      style={{
        background: isDark ? "#1e293b" : "#fff4e6",
        border: isDark ? "1px solid #f59e0b" : "1px solid #fdba74",
        color: isDark ? "#fbbf24" : "#c2410c",
      }}
    >
      {/* Sun icon */}
      <svg
        className={`absolute w-5 h-5 transition-all duration-500 ${
          isDark ? "opacity-0 rotate-90 scale-0" : "opacity-100 rotate-0 scale-100"
        }`}
        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z"
        />
      </svg>

      {/* Moon icon */}
      <svg
        className={`absolute w-5 h-5 transition-all duration-500 ${
          isDark ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-0"
        }`}
        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
        />
      </svg>
    </button>
  );
}
