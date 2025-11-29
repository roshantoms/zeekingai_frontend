import React, { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved ? saved === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark-mode", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <button
      className="theme-toggle"
      onClick={() => setDark((v) => !v)}
      title="Toggle theme"
    >
      {dark ? (
        <i className="fa fa-sun"></i>
      ) : (
        <i className="fa fa-moon"></i>
      )}
    </button>
  );
}