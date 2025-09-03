
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { FileUpload } from './components/FileUpload';
import { QuizDisplay } from './components/QuizDisplay';
import { Loader } from './components/Loader';
import { extractTextFromFile } from './services/fileProcessor';
import { generateQuizFromText } from './services/geminiService';
import { type Quiz } from './types';
import { ErrorIcon, SparklesIcon } from './components/icons/Icons';

export default function App() {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateQuiz = useCallback(async (file: File) => {
    setIsLoading(true);
    setError(null);
    setQuiz(null);

    try {
      const textContent = await extractTextFromFile(file);
      if (!textContent || textContent.trim().length < 100) {
        throw new Error("Could not extract sufficient text from the file. Please ensure the document has at least 100 characters.");
      }
      
      const generatedQuiz = await generateQuizFromText(textContent);
      setQuiz(generatedQuiz);

    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred during quiz generation.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleReset = () => {
    setQuiz(null);
    setError(null);
    setIsLoading(false);
  };

  const WelcomeMessage = () => (
    <div className="text-center p-8">
      <div className="inline-block bg-sky-100 dark:bg-sky-900/50 p-4 rounded-full mb-4">
        <SparklesIcon className="w-12 h-12 text-sky-500 dark:text-sky-400" />
      </div>
      <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Welcome to the Auto Quiz Generator</h2>
      <p className="mt-2 text-slate-600 dark:text-slate-400">
        Upload a text or PDF file to instantly create a quiz.
      </p>
    </div>
  );

  const ErrorDisplay = () => (
    <div className="w-full max-w-2xl mx-auto mt-8 bg-red-100 dark:bg-red-900/50 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg relative" role="alert">
        <div className="flex items-center">
            <ErrorIcon className="w-6 h-6 mr-3" />
            <div>
                <strong className="font-bold">An error occurred.</strong>
                <span className="block sm:inline ml-2">{error}</span>
            </div>
        </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {!quiz && !isLoading && <FileUpload onGenerateQuiz={handleGenerateQuiz} />}

          {isLoading && <Loader />}
          
          {error && <ErrorDisplay />}

          {quiz && !isLoading && !error && (
            <QuizDisplay quiz={quiz} onReset={handleReset} />
          )}

          {!quiz && !isLoading && !error && <WelcomeMessage />}
        </div>
      </main>
    </div>
  );
}
