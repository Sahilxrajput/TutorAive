import { useEffect, useRef, useState, useCallback } from "react";
import { Socket } from "socket.io-client";
import { toast } from "sonner";

interface UseTranscriptionOptions {
  sessionId: string;
  socket: Socket | null; // pass your existing socket
  onTranscriptUpdate?: (text: string) => void;
  autoSaveInterval?: number; // ms, default 4000
}

interface UseTranscriptionReturn {
  isListening: boolean;
  liveText: string;
  fullTranscript: string;
  startTranscription: () => void;
  stopTranscription: () => Promise<void>;
  error: string | null;
}

export function useTranscription({
  sessionId,
  socket,
  onTranscriptUpdate,
  autoSaveInterval = 4000,
}: UseTranscriptionOptions): UseTranscriptionReturn {
  const [isListening, setIsListening] = useState(false);
  const [liveText, setLiveText] = useState("");
  const [fullTranscript, setFullTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const accumulatedRef = useRef<string>("");
  const saveBufferRef = useRef<string[]>([]);
  const saveIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isListeningRef = useRef(false); // stable ref for onend callback
  const currentInterimRef = useRef("");

  // ── Flush buffer → emit via socket (real-time to students) ─────────────
  const flushBuffer = useCallback(() => {
    if (!socket || saveBufferRef.current.length === 0) return;

    const text = saveBufferRef.current.join(" ").trim();
    saveBufferRef.current = [];

    socket.emit("transcript:teacher-chunk", {
      roomId: sessionId,
      text,
      interim: currentInterimRef.current,
      timestamp: Date.now(),
    });
  }, [socket, sessionId]);

  // ── Initialize Web Speech API ───────────────────────────────────────────
  const initRecognition = useCallback(() => {
    const SpeechRecognitionAPI =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      setError("Speech recognition not supported. Please use Chrome.");
      toast.info("Speech recognition not supported. Please use Chrome.");
      return null;
    }

    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = "";
      let final = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const text = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          final += text + " ";
        } else {
          interim += text;
        }
      }

      currentInterimRef.current = interim;
      setLiveText(interim);

      if (final) {
        accumulatedRef.current += final;
        saveBufferRef.current.push(final.trim());
        setFullTranscript(accumulatedRef.current);
        onTranscriptUpdate?.(accumulatedRef.current);

        // Send final text + current interim immediately via socket
        if (socket) {
          socket.emit("transcript:teacher-chunk", {
            roomId: sessionId,
            text: final.trim(),
            interim,
            timestamp: Date.now(),
          });
          saveBufferRef.current = [];
        }
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (event.error === "network") {
        // Auto retry after 2 seconds
        setTimeout(() => {
          if (isListeningRef.current) {
            try {
              recognition.start();
            } catch {console.log("network error")}
          }
        }, 2000);
        return; // don't show error to user
      }
      if (event.error !== "no-speech") {
        setError(`Speech recognition error: ${event.error}`);
      }
    };


    // Auto-restart to keep recognition alive during long sessions
    recognition.onend = () => {
      if (isListeningRef.current) {
        try {
          recognition.start();
        } catch {
          /* already started */
        }
      }
    };

    return recognition;
  }, [socket, sessionId, onTranscriptUpdate]);

  // ── Start Transcription ─────────────────────────────────────────────────
  const startTranscription = useCallback(() => {
    setError(null);
    const recognition = initRecognition();
    if (!recognition){
        toast.error("no recognitation")
        return;
    } 

    recognitionRef.current = recognition;
    isListeningRef.current = true;
    recognition.start();
    setIsListening(true);

    // Fallback interval for any remaining buffered text
    saveIntervalRef.current = setInterval(flushBuffer, autoSaveInterval);
  }, [initRecognition, flushBuffer, autoSaveInterval]);

  // ── Stop Transcription ──────────────────────────────────────────────────
  const stopTranscription = useCallback(async () => {
    isListeningRef.current = false;
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setIsListening(false);
    setLiveText("");
    currentInterimRef.current = "";

    if (saveIntervalRef.current) {
      clearInterval(saveIntervalRef.current);
      saveIntervalRef.current = null;
    }

    flushBuffer();

    // Tell server transcript session is over → saves endedAt to MongoDB
    if (socket) {
      socket.emit("transcript:end", { roomId: sessionId });
    }
  }, [flushBuffer, socket, sessionId]);

  // ── Cleanup on unmount ──────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      isListeningRef.current = false;
      recognitionRef.current?.stop();
      if (saveIntervalRef.current) clearInterval(saveIntervalRef.current);
    };
  }, []);

  return {
    isListening,
    liveText,
    fullTranscript,
    startTranscription,
    stopTranscription,
    error,
  };
}

// ─── Browser type extensions ───────────────────────────────────────────────
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}
