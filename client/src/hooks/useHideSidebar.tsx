// hooks/useHideSidebar.ts
import { useFullscreen } from "@/hooks/useFullscreen";
import { useCallback, useEffect, useState } from "react";

export const useHideSidebar = () => {
  const { isFullScreen } = useFullscreen();

  // user-controlled toggle
  const [userHidden, setUserHidden] = useState(false);

  const toggleSidebar = useCallback(() => {
    setUserHidden((prev) => !prev);
  }, []);

  // Ctrl / Cmd + B shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().includes("MAC");
      const modifierPressed = isMac ? e.metaKey : e.ctrlKey;

      if (modifierPressed && e.key.toLowerCase() === "b") {
        e.preventDefault();
        toggleSidebar();
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [toggleSidebar]);

  // system rules override user toggle
  const hideSidebar = isFullScreen || userHidden;

  return {
    hideSidebar,
    toggleSidebar,
    userHidden,
  };
};
