"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseQuizData = void 0;
const parseQuizData = (rawData) => __awaiter(void 0, void 0, void 0, function* () {
    let cleanData = rawData
        .replace(/^```json\s*/, "")
        .replace(/^```\s*/, "")
        .replace(/\s*```$/, "")
        .trim();
    let parsed;
    try {
        parsed = yield JSON.parse(cleanData);
        console.log("parsed data");
    }
    catch (e) {
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
});
exports.parseQuizData = parseQuizData;
