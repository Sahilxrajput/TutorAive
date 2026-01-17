import { useEffect, useState, useCallback } from "react";

export const useFullscreen = () => {
  const [isFullScreen, setIsFullScreen] = useState<boolean>(
    !!document.fullscreenElement,
  );

  useEffect(() => {
    const handler = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  const enter = useCallback(async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
    }
  }, []);

  const exit = useCallback(async () => {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    }
  }, []);

  const toggle = useCallback(async () => {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    } else {
      await document.documentElement.requestFullscreen();
    }
  }, []);

  return {
    isFullScreen,
    enter,
    exit,
    toggle,
  };
};
