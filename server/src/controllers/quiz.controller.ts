import dotenv from "dotenv";
dotenv.config({ path: "../../.env" });
import { Request, Response } from "express";
import { ContentListUnion, GoogleGenAI } from "@google/genai";
import { parseQuizData } from "../utils/parseQuizData";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { Pinecone } from "@pinecone-database/pinecone";
import { PineconeStore } from "@langchain/pinecone";
import readline from "readline-sync";

const {
  GEMINI_API_KEY,
  PINECONE_API_KEY,
  PINECONE_ENVIRONMENT,
  PINECONE_INDEX_NAME,
} = process.env;

const ai = new GoogleGenAI({});
const History: ContentListUnion = [];

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

async function generateContent(prompt: string): Promise<string> {
  try {
    const aiRes = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });
    return aiRes.text || "⚠️ No response.";
  } catch (err: any) {
    console.error("Gemini API error:", err);
    if (err.status === 503) {
      return "🚧 The AI service is overloaded/unavailable. Please try again later.";
    }
    return "❌ An unexpected error occurred while generating content.";
  }
}

export const generateQuizs = async (req: Request, res: Response) => {
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
    const data = await generateContent(prompt);
    // Parse Data
    const str = await parseQuizData(data);
    res.json(str);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error generating quiz", error });
  }
};
