import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import API from "@/lib/api";

type Question = {
  id?: number;
  question?: string;
  options?: string[];
  correct_answer?: string;
};

type QuizData = {
  quiz_title?: string;
  subject?: string;
  questions?: Question[];
};

const Quiz: React.FC = () => {
  const [data, setData] = useState<QuizData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getQuiz = async () => {
      try {
        const res = await API.get("/quizs/generate");
        const quizData = res.data;
        setData(quizData);
      } catch (error) {
        console.error("Failed to fetch quiz:", error);
      } finally {
        setLoading(false);
      }
    };

    getQuiz();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500 animate-pulse">Loading quiz...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center text-red-500 mt-10">
        Failed to load quiz data.
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <Card className="shadow-md border border-gray-200">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">
            {data.quiz_title}
          </CardTitle>
          <Badge className="mt-2" variant="secondary">
            {data.subject}
          </Badge>
        </CardHeader>

        <CardContent className="space-y-8">
          {data?.questions?.map((q) => (
            <div
              key={q.id}
              className="p-4 border rounded-xl hover:bg-gray-50 transition"
            >
              <p className="font-medium mb-3">
                {q.id}. {q.question}
              </p>

              <ul className="space-y-2">
                {q?.options?.map((opt, i) => {
                  const isCorrect = opt === q.correct_answer;
                  return (
                    <li
                      key={i}
                      className={`p-2 rounded-lg border ${isCorrect
                          ? "border-green-500 bg-green-50 text-green-700 font-medium"
                          : "border-gray-200"
                        }`}
                    >
                      {opt}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default Quiz;
