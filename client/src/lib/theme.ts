export type Theme = "light" | "dark";

function updateFavicon(theme: Theme) {
  let faviconTag = document.getElementById("app-favicon") as HTMLLinkElement;

  if (!faviconTag) {
    faviconTag = document.createElement("link");
    faviconTag.id = "app-favicon";
    faviconTag.rel = "icon";
    document.head.appendChild(faviconTag);
  }

  faviconTag.href =
    theme === "dark"
      ? `/dark-logo.png?v=${Date.now()}`
      : `/light-logo.png?v=${Date.now()}`;
}

export function setTheme(theme: Theme) {
  const root = document.documentElement;

  if (theme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }

  localStorage.setItem("theme", theme);

  // Sync favicon on theme change
  updateFavicon(theme);
}

export function initTheme() {
  const saved = localStorage.getItem("theme") as Theme | null;

  if (saved) {
    setTheme(saved);
    return;
  }

  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  setTheme(prefersDark ? "dark" : "light");
}