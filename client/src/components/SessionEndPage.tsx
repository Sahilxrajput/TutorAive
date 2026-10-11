import React, { useEffect, useState } from "react";
import { SummaryResult, QuizResult, QuizQuestion } from "../types/ai.types";

interface SessionEndPageProps {
  sessionId: string;
  onReturnHome: () => void;
}

type Tab = "summary" | "quiz";

// ─── Main Component ────────────────────────────────────────────────────────

const SessionEndPage: React.FC<SessionEndPageProps> = ({
  sessionId,
  onReturnHome,
}) => {
  const [activeTab, setActiveTab] = useState<Tab>("summary");
  const [summary, setSummary] = useState<SummaryResult | null>(null);
  const [quiz, setQuiz] = useState<QuizResult | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [loadingQuiz, setLoadingQuiz] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Quiz state
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // ── Fetch Summary ─────────────────────────────────────────────────────
  useEffect(() => {
    const fetchSummary = async () => {
      setLoadingSummary(true);
      try {
        const res = await fetch("/api/ai/summary", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });
        if (!res.ok) throw new Error("Failed to generate summary");
        const data: SummaryResult = await res.json();
        setSummary(data);
      } catch (err) {
        setError("Could not generate summary. The transcript may be too short.");
      } finally {
        setLoadingSummary(false);
      }
    };

    fetchSummary();
  }, [sessionId]);

  // ── Fetch Quiz ────────────────────────────────────────────────────────
  const handleLoadQuiz = async () => {
    if (quiz) return;
    setLoadingQuiz(true);
    try {
      const res = await fetch("/api/ai/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, questionCount: 5 }),
      });
      if (!res.ok) throw new Error("Failed to generate quiz");
      const data: QuizResult = await res.json();
      setQuiz(data);
    } catch (err) {
      setError("Could not generate quiz.");
    } finally {
      setLoadingQuiz(false);
    }
  };

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    if (tab === "quiz") handleLoadQuiz();
  };

  // ── Quiz Submit ───────────────────────────────────────────────────────
  const handleSubmitQuiz = () => {
    if (!quiz) return;
    let correct = 0;
    quiz.questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctAnswer) correct++;
    });
    setScore(correct);
    setSubmitted(true);
  };

  // ─── Render ────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-8 text-center">
          <div className="text-4xl mb-2">🎓</div>
          <h1 className="text-3xl font-bold text-white">Session Complete</h1>
          <p className="text-gray-400 mt-1">Here's what was covered in this class</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-gray-900 p-1 rounded-xl">
          <button
            onClick={() => handleTabChange("summary")}
            className={`flex-1 py-2.5 rounded-lg font-medium text-sm transition-all ${
              activeTab === "summary"
                ? "bg-indigo-600 text-white shadow"
                : "text-gray-400 hover:text-white"
            }`}
          >
            📋 AI Summary
          </button>
          <button
            onClick={() => handleTabChange("quiz")}
            className={`flex-1 py-2.5 rounded-lg font-medium text-sm transition-all ${
              activeTab === "quiz"
                ? "bg-indigo-600 text-white shadow"
                : "text-gray-400 hover:text-white"
            }`}
          >
            ❓ Quiz Yourself
          </button>
        </div>

        {error && (
          <div className="bg-red-900/30 border border-red-700 text-red-300 p-4 rounded-xl mb-4">
            {error}
          </div>
        )}

        {/* ── Summary Tab ─────────────────────────────────────────────── */}
        {activeTab === "summary" && (
          <div>
            {loadingSummary ? (
              <LoadingCard message="Generating your AI summary..." />
            ) : summary ? (
              <div className="space-y-4">
                <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
                  <h2 className="text-xl font-bold text-indigo-400 mb-2">
                    {summary.title}
                  </h2>
                  <p className="text-gray-300 leading-relaxed">{summary.overview}</p>
                </div>

                <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
                  <h3 className="font-semibold text-white mb-3">📌 Key Points</h3>
                  <ul className="space-y-2">
                    {summary.keyPoints.map((point, i) => (
                      <li key={i} className="flex gap-2 text-gray-300">
                        <span className="text-indigo-400 mt-0.5">•</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
                  <h3 className="font-semibold text-white mb-3">🏷️ Topics Covered</h3>
                  <div className="flex flex-wrap gap-2">
                    {summary.topicsCovered.map((topic, i) => (
                      <span
                        key={i}
                        className="bg-indigo-900/50 text-indigo-300 px-3 py-1 rounded-full text-sm border border-indigo-700"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        )}

        {/* ── Quiz Tab ─────────────────────────────────────────────────── */}
        {activeTab === "quiz" && (
          <div>
            {loadingQuiz ? (
              <LoadingCard message="Generating quiz questions from the lecture..." />
            ) : quiz ? (
              <div className="space-y-5">
                {submitted && (
                  <div className="bg-green-900/30 border border-green-700 rounded-2xl p-4 text-center">
                    <div className="text-2xl font-bold text-green-400">
                      {score} / {quiz.questions.length} correct
                    </div>
                    <p className="text-gray-400 text-sm mt-1">
                      {score === quiz.questions.length
                        ? "Perfect score! 🎉"
                        : score >= quiz.questions.length / 2
                        ? "Good job! Keep it up 👍"
                        : "Review the summary and try again 📚"}
                    </p>
                  </div>
                )}

                {quiz.questions.map((q, qi) => (
                  <QuizCard
                    key={q.id}
                    question={q}
                    index={qi}
                    selected={selectedAnswers[q.id]}
                    submitted={submitted}
                    onSelect={(optionIdx) =>
                      !submitted &&
                      setSelectedAnswers((prev) => ({
                        ...prev,
                        [q.id]: optionIdx,
                      }))
                    }
                  />
                ))}

                {!submitted && (
                  <button
                    onClick={handleSubmitQuiz}
                    disabled={
                      Object.keys(selectedAnswers).length < quiz.questions.length
                    }
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl font-semibold transition-colors"
                  >
                    Submit Answers
                  </button>
                )}
              </div>
            ) : null}
          </div>
        )}

        <button
          onClick={onReturnHome}
          className="mt-8 w-full py-3 bg-gray-800 hover:bg-gray-700 rounded-xl text-gray-300 transition-colors"
        >
          ← Return Home
        </button>
      </div>
    </div>
  );
};

// ─── Sub-components ────────────────────────────────────────────────────────

const LoadingCard: React.FC<{ message: string }> = ({ message }) => (
  <div className="bg-gray-900 rounded-2xl p-10 flex flex-col items-center gap-4 border border-gray-800">
    <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
    <p className="text-gray-400">{message}</p>
  </div>
);

interface QuizCardProps {
  question: QuizQuestion;
  index: number;
  selected: number | undefined;
  submitted: boolean;
  onSelect: (i: number) => void;
}

const QuizCard: React.FC<QuizCardProps> = ({
  question,
  index,
  selected,
  submitted,
  onSelect,
}) => {
  const getOptionStyle = (i: number) => {
    if (!submitted) {
      return selected === i
        ? "border-indigo-500 bg-indigo-900/30 text-white"
        : "border-gray-700 bg-gray-800 text-gray-300 hover:border-gray-500";
    }
    if (i === question.correctAnswer)
      return "border-green-500 bg-green-900/30 text-green-300";
    if (selected === i && i !== question.correctAnswer)
      return "border-red-500 bg-red-900/30 text-red-300";
    return "border-gray-700 bg-gray-800 text-gray-500";
  };

  return (
    <div className="bg-gray-900 rounded-2xl p-5 border border-gray-800">
      <p className="font-medium text-white mb-4">
        <span className="text-indigo-400 mr-2">Q{index + 1}.</span>
        {question.question}
      </p>
      <div className="space-y-2">
        {question.options.map((option, i) => (
          <button
            key={i}
            onClick={() => onSelect(i)}
            className={`w-full text-left px-4 py-2.5 rounded-xl border text-sm transition-all ${getOptionStyle(i)}`}
          >
            <span className="mr-2 font-semibold">
              {["A", "B", "C", "D"][i]}.
            </span>
            {option}
          </button>
        ))}
      </div>
      {submitted && (
        <p className="mt-3 text-xs text-gray-400 bg-gray-800 p-3 rounded-lg">
          💡 {question.explanation}
        </p>
      )}
    </div>
  );
};

export default SessionEndPage;
