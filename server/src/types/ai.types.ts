export interface TranscriptSegment {
  text: string;
  timestamp: number; // ms since session start
  speaker: "teacher";
}

export interface SessionTranscript {
  sessionId: string;
  segments: TranscriptSegment[];
  fullText: string;
  startedAt: Date;
  endedAt?: Date;
}

export interface SummaryResult {
  sessionId: string;
  title: string;
  overview: string;
  keyPoints: string[];
  topicsCovered: string[];
  generatedAt: Date;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // index of correct option
  explanation: string;
}

export interface QuizResult {
  sessionId: string;
  questions: QuizQuestion[];
  generatedAt: Date;
}

export interface GeminiResponse {
  candidates: {
    content: {
      parts: { text: string }[];
    };
  }[];
}
