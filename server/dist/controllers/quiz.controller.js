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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateQuizs = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: "../../.env" });
const genai_1 = require("@google/genai");
const parseQuizData_1 = require("../utils/parseQuizData");
const { GEMINI_API_KEY, PINECONE_API_KEY, PINECONE_ENVIRONMENT, PINECONE_INDEX_NAME, } = process.env;
const ai = new genai_1.GoogleGenAI({});
const History = [];
// const convertQueryIntoVector = async (query: string) => {
//   try {
//     //1.convert this question into vector
//     const embeddings = new GoogleGenerativeAIEmbeddings({
//       apiKey: GEMINI_API_KEY,
//       model: "text-embedding-004",
//     });
//     const queryVector = await embeddings.embedQuery(query);
//     //3. search in pinecone
//     const pinecone = new Pinecone();
//     const pineconeIndex = pinecone.Index(PINECONE_INDEX_NAME!);
//     const searchResults = await pineconeIndex.query({
//       topK: 10,
//       vector: queryVector,
//       includeMetadata: true,
//     });
//     //   console.log("searchResults: ", searchResults);
//     // 4. extract text from each document's metadata
//     const context = searchResults.matches
//       .map((match) => match.metadata?.text || "")
//       .filter((text) => typeof text === "string" && text.length > 0)
//       .join("\n\n---\n\n");
//     // console.log("context: ", context);
//     //create the context for LLM
//     History.push({
//       role: "user",
//       parts: [{ text: query }],
//     });
//     //Gemini
//     const response = await ai.models.generateContent({
//       model: "gemini-2.5-flash",
//       contents: History,
//       config: {
//         systemInstruction: `You have to behave like a Data Structure and Algorithm Expert.
//       You will be given a context of relevant information and a user question.
//       Your task is to answer the user's question based ONLY on the provided context.
//       If the answer is not in the context, you must say "I could not find the answer in the provided document."
//       Keep your answers clear, concise, and educational.
//         Context: ${context}
//         `,
//       },
//     });
//     History.push({
//       role: "model",
//       parts: [{ text: response.text }],
//     });
//     console.log("\n");
//     console.log("response", response.text);
//   } catch (error) {
//     console.log("error: ", error);
//   }
// };
// const name = readline.question("Enter Search Query: ");
// convertQueryIntoVector(name);
// async function init() {
//   //1. load
//   const PDF_PATH = "./dsa.pdf";
//   const pdfLoader = new PDFLoader(PDF_PATH);
//   const rawDocs = await pdfLoader.load();
//   console.log(rawDocs.length);
//   // 2.   chunking kro
//   const textSplitter = new RecursiveCharacterTextSplitter({
//     chunkSize: 1000,
//     chunkOverlap: 200, //* can be 800 to 1800 normally 0-1000
//   });
//   const chunkedDocs = await textSplitter.splitDocuments(rawDocs);
//   //   console.log("chunkedDocs", chunkedDocs);
//   console.log("chunks completed");
//   // 3.  vector embedding model
//   const embeddings = new GoogleGenerativeAIEmbeddings({
//     apiKey: process.env.GEMINI_API_KEY,
//     model: "text-embedding-004",
//   });
//   //   console.log("embeddings: ", embeddings);
//   console.log("embeddings model configured");
//   //4. database configure
//   //Initialize Pinecone Client
//   const pinecone = new Pinecone();
//   const pineconeIndex = pinecone.Index(PINECONE_INDEX_NAME!);
//   console.log("pinecone db configure");
//   //5. langchain (chunking,embedding,database)
//   //   await PineconeStore.fromDocuments(chunkedDocs, embeddings, {
//   //     pineconeIndex,
//   //     maxConcurrency: 5, // no of chunks which do this process(chunks -> vector -> save in db)
//   //   });
//   console.log("data store successfully");
// }
// init();
function generateContent(prompt) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const aiRes = yield ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: [{ role: "user", parts: [{ text: prompt }] }],
            });
            return aiRes.text || "⚠️ No response.";
        }
        catch (err) {
            console.error("Gemini API error:", err);
            if (err.status === 503) {
                return "🚧 The AI service is overloaded/unavailable. Please try again later.";
            }
            return "❌ An unexpected error occurred while generating content.";
        }
    });
}
const generateQuizs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const { topic, subject, numQuestions, numOptions } = req.body;
        // if (!topic || !subject || !numQuestions || !numOptions) {
        //   return res.status(400).json({ message: "All fields are required" });
        // }
        const subject = "computer science";
        const topic = "react";
        const numQuestions = "5";
        const numOptions = "4";
        const prompt = `Generate a ${numQuestions}-question multiple-choice quiz on the topic "${topic}" and subject "${subject}". 
Each question should have ${numOptions} options with the correct answer marked. Return JSON DATA with Options`;
        // Call Gemini API
        const data = yield generateContent(prompt);
        // Parse Data
        const str = yield (0, parseQuizData_1.parseQuizData)(data);
        res.json(str);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error generating quiz", error });
    }
});
exports.generateQuizs = generateQuizs;
