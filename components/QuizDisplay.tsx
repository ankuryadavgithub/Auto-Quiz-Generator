
import React, { useState } from 'react';
import { type Quiz, type Question, QuestionType } from '../types';
import { CheckIcon, CrossIcon, LightbulbIcon, RefreshIcon } from './icons/Icons';

interface QuizDisplayProps {
  quiz: Quiz;
  onReset: () => void;
}

const QuestionCard: React.FC<{ question: Question; index: number; showAnswers: boolean }> = ({ question, index, showAnswers }) => {
  const isMCQ = question.type === QuestionType.MULTIPLE_CHOICE;
  const isTF = question.type === QuestionType.TRUE_FALSE;

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md border border-slate-200 dark:border-slate-700 transition-all duration-300">
      <p className="text-lg font-semibold text-slate-800 dark:text-slate-100">
        <span className="text-sky-500 font-bold mr-2">{index + 1}.</span>
        {question.question}
      </p>

      {isMCQ && (
        <div className="mt-4 space-y-3">
          {question.options.map((option, i) => {
            const isCorrect = option === question.answer;
            return (
              <div
                key={i}
                className={`flex items-center p-3 rounded-md border ${
                  showAnswers && isCorrect
                    ? 'bg-green-100 dark:bg-green-900/50 border-green-400 dark:border-green-600'
                    : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600'
                }`}
              >
                {showAnswers && isCorrect && <CheckIcon className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />}
                <span className="text-slate-700 dark:text-slate-300">{option}</span>
              </div>
            );
          })}
        </div>
      )}

      {isTF && (
        <div className="mt-4 space-y-3">
          {[true, false].map((option, i) => {
            const isCorrect = option === question.answer;
            return (
              <div
                key={i}
                className={`flex items-center p-3 rounded-md border ${
                  showAnswers && isCorrect
                    ? 'bg-green-100 dark:bg-green-900/50 border-green-400 dark:border-green-600'
                    : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600'
                }`}
              >
                {showAnswers && isCorrect && <CheckIcon className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />}
                <span className="text-slate-700 dark:text-slate-300">{option ? 'True' : 'False'}</span>
              </div>
            );
          })}
        </div>
      )}
      
      {showAnswers && (
         <div className="mt-4 p-3 bg-sky-50 dark:bg-sky-900/30 rounded-lg flex items-start space-x-3">
             <LightbulbIcon className="w-5 h-5 text-sky-500 dark:text-sky-400 flex-shrink-0 mt-1" />
             <div>
                 <p className="font-semibold text-sky-800 dark:text-sky-200">Explanation</p>
                 <p className="text-sm text-sky-700 dark:text-sky-300">{question.explanation}</p>
             </div>
         </div>
      )}
    </div>
  );
};


export const QuizDisplay: React.FC<QuizDisplayProps> = ({ quiz, onReset }) => {
  const [showAnswers, setShowAnswers] = useState(false);

  return (
    <div className="space-y-8">
      <div className="text-center bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-50">{quiz.title}</h2>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center">
            <label htmlFor="show-answers" className="mr-3 text-sm font-medium text-slate-700 dark:text-slate-300">
                Show Answers
            </label>
            <button
                role="switch"
                aria-checked={showAnswers}
                onClick={() => setShowAnswers(!showAnswers)}
                className={`${showAnswers ? 'bg-sky-600' : 'bg-slate-300 dark:bg-slate-600'}
                relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 dark:ring-offset-slate-900`}
            >
                <span
                className={`${showAnswers ? 'translate-x-5' : 'translate-x-0'}
                    pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                />
            </button>
        </div>

        <button
          onClick={onReset}
          className="inline-flex items-center px-4 py-2 border border-slate-300 dark:border-slate-600 text-sm font-medium rounded-md shadow-sm text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:ring-offset-slate-900 focus:ring-sky-500"
        >
          <RefreshIcon className="w-5 h-5 mr-2"/>
          Generate New Quiz
        </button>
      </div>

      <div className="space-y-6">
        {quiz.questions.map((q, index) => (
          <QuestionCard key={index} question={q} index={index} showAnswers={showAnswers} />
        ))}
      </div>
    </div>
  );
};
