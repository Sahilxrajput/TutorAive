import React, { useEffect, useRef } from "react";

interface LiveSubtitleProps {
  text: string;           // interim live text
  finalText: string;      // accumulated final text (last sentence shown)
  isActive: boolean;
}

const LiveSubtitle: React.FC<LiveSubtitleProps> = ({
  text,
  finalText,
  isActive,
}) => {
  const lastFinalRef = useRef<string>("");

  // Show last ~100 chars of final text + current interim
  useEffect(() => {
    if (finalText) {
      const words = finalText.trim().split(" ");
      lastFinalRef.current = words.slice(-12).join(" ");
    }
  }, [finalText]);

  if (!isActive) return null;

  const displayText = text || lastFinalRef.current;

  return (
    <div className="absolute bottom-24 left-1/2 -translate-x-1/2 w-[90%] max-w-2xl z-50">
      <div
        className="
          bg-black/70 backdrop-blur-sm
          text-white text-center text-lg font-medium
          px-6 py-3 rounded-xl
          border border-white/10
          transition-all duration-200
          min-h-13 flex items-center justify-center
        "
      >
        {displayText ? (
          <span>
            <span className="opacity-80">{lastFinalRef.current} </span>
            <span className="text-yellow-300">{text}</span>
          </span>
        ) : (
          <span className="opacity-30 text-sm">Subtitles active...</span>
        )}
      </div>
    </div>
  );
};

export default LiveSubtitle;
