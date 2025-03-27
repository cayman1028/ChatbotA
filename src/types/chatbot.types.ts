export interface Question {
  id: string;
  text: string;
  options: Option[];
  answers: {
    [key: string]: string;
  };
}

export interface Option {
  id: string;
  text: string;
  answer: string;
  nextQuestionId?: string | null;
}

export interface ChatbotProps {
  initialQuestions: Question[];
}

export interface ChatMessage {
  type: 'question' | 'answer';
  text: string;
  timestamp: Date;
}

export interface ChatbotState {
  isOpen: boolean;
  currentQuestion: Question | null;
  messages: ChatMessage[];
  isLoading: boolean;
}