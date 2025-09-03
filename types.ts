
export enum QuestionType {
  MULTIPLE_CHOICE = 'MCQ',
  TRUE_FALSE = 'TF',
}

export interface MultipleChoiceQuestion {
  type: QuestionType.MULTIPLE_CHOICE;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

export interface TrueFalseQuestion {
  type: QuestionType.TRUE_FALSE;
  question: string;
  answer: boolean;
  explanation: string;
}

export type Question = MultipleChoiceQuestion | TrueFalseQuestion;

export interface Quiz {
  title: string;
  questions: Question[];
}
