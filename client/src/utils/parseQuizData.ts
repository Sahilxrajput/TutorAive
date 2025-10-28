// utils/parseQuizData.js
export const parseQuizData = (rawData:any) => {
  try {
    const parsed = JSON.parse(rawData);
    return parsed.quiz.map((item:any, index:number) => ({
      id: index + 1,
      question: item.question,
      options: item.options.map((opt:any, i:number) => ({
        id: i,
        text: opt.text,
        isCorrect: opt.is_correct,
      })),
    }));
  } catch (error) {
    console.error("Invalid quiz data:", error);
    return [];
  }
};
