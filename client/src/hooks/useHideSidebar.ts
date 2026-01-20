// hooks/useHideSidebar.ts
import { useMatch } from "react-router-dom";
import { useFullscreen } from "@/hooks/useFullscreen";
import { useIsMobile } from "@/hooks/use-mobile";
import { useCallback, useEffect, useState } from "react";

export const useHideSidebar = () => {
  const { isFullScreen } = useFullscreen();
  const isMobile = useIsMobile();

  const isLiveLecture = useMatch(
    "/classrooms/:classroomId/lecture/live/:lectureId",
  );

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
  const hideSidebar = isFullScreen || !!isLiveLecture || userHidden;

  return {
    hideSidebar,
    toggleSidebar,
    isMobile,
    userHidden,
  };
};
