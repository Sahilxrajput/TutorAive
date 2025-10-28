export const parseQuizData = async (rawData: any) => {
  let cleanData = rawData
    .replace(/^```json\s*/, "")
    .replace(/^```\s*/, "")
    .replace(/\s*```$/, "")
    .trim();

  let parsed;

  try {
    parsed = await JSON.parse(cleanData);
    console.log("parsed data");
  } catch (e) {
    console.log("can't parsed");
    parsed = cleanData;
  }
  console.log("parsed", parsed);
  
  // const parsedData = parsed?.quiz?.map((item: any, index: number) => ({
  //   id: index + 1,
  //   question: item.question,
  //   options: item.options.map((opt: any, i: number) => ({
  //     id: i,
  //     text: opt.text,
  //     isCorrect: opt.is_correct,
  //   })),
  // }));
  // console.log("parsedData : ", parsedData);

  return parsed;
};
