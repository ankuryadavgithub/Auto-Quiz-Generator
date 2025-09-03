
import { GoogleGenAI, Type } from "@google/genai";
import { type Quiz } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const quizSchema = {
  type: Type.OBJECT,
  properties: {
    title: {
      type: Type.STRING,
      description: "A concise and relevant title for the quiz based on the provided text."
    },
    questions: {
      type: Type.ARRAY,
      description: "An array of questions.",
      items: {
        type: Type.OBJECT,
        properties: {
          type: {
            type: Type.STRING,
            enum: ["MCQ", "TF"],
            description: "The type of question, either 'MCQ' (Multiple Choice) or 'TF' (True/False)."
          },
          question: {
            type: Type.STRING,
            description: "The question text."
          },
          options: {
            type: Type.ARRAY,
            description: "An array of 4 strings for MCQ options. Should be an empty array for TF questions.",
            items: { type: Type.STRING }
          },
          answer: {
            type: Type.STRING, // For TF, this will be "true" or "false" as a string, to be parsed later
            description: "The correct answer. For MCQs, it's one of the options. For T/F, it's 'true' or 'false'."
          },
          explanation: {
              type: Type.STRING,
              description: "A brief explanation of why the answer is correct, based on the source text."
          }
        },
        required: ["type", "question", "answer", "explanation"]
      }
    }
  },
  required: ["title", "questions"]
};

export const generateQuizFromText = async (text: string): Promise<Quiz> => {
  try {
    const prompt = `Based on the following text, generate a quiz. The quiz should contain a mix of 5 multiple-choice and 5 true/false questions. All questions must be answerable directly from the provided text. Ensure the distractors for multiple-choice questions are plausible yet incorrect.

Text:
---
${text.substring(0, 20000)}
---

Generate the quiz according to the specified JSON schema.`;
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: quizSchema,
      }
    });

    const jsonText = response.text.trim();
    const parsedQuiz = JSON.parse(jsonText);
    
    // Data validation and transformation
    const validatedQuiz: Quiz = {
        title: parsedQuiz.title || "Generated Quiz",
        questions: parsedQuiz.questions.map((q: any) => {
            if(q.type === 'TF') {
                return { ...q, answer: q.answer.toLowerCase() === 'true' };
            }
            return q;
        })
    };
    
    return validatedQuiz;

  } catch (error) {
    console.error("Error generating quiz with Gemini:", error);
    throw new Error("Failed to generate quiz. The AI model may be experiencing issues.");
  }
};
