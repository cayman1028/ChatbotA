import { Question } from '../types/chatbot.types';
import { ChatbotError } from '../utils/errors';

export { ChatbotError };

interface ChatHistory {
  answer: string;
  timestamp: Date;
}

export class ChatbotService {
  private questions: Question[];
  private currentQuestionId: string | null;
  private initialQuestionId: string;
  private history: ChatHistory[] = [];

  constructor(questions: Question[]) {
    this.questions = [];
    this.currentQuestionId = null;
    this.initialQuestionId = '';
    this.initializeQuestions(questions);
  }

  private initializeQuestions(questions: Question[]): void {
    if (!questions.length) {
      throw new ChatbotError('質問リストが空です');
    }

    questions.forEach(question => {
      if (!question.answers) {
        throw new ChatbotError(`質問 "${question.id}" にanswersプロパティが設定されていません`);
      }
    });

    this.questions = questions;
    this.initialQuestionId = questions[0].id;
    this.currentQuestionId = this.initialQuestionId;
  }

  getCurrentQuestion(): Question | null {
    if (!this.currentQuestionId) return null;
    return this.questions.find(q => q.id === this.currentQuestionId) || null;
  }

  selectOption(optionId: string): string {
    const currentQuestion = this.getCurrentQuestion();
    if (!currentQuestion) {
      throw new ChatbotError('現在の質問が見つかりません');
    }

    const selectedOption = currentQuestion.options.find(opt => opt.id === optionId);
    if (!selectedOption) {
      throw new ChatbotError('選択された選択肢が見つかりません');
    }

    const answer = currentQuestion.answers[optionId] || selectedOption.answer;
    this.history.push({
      answer,
      timestamp: new Date()
    });

    this.currentQuestionId = selectedOption.nextQuestionId || null;
    return answer;
  }

  resetConversation(): void {
    this.currentQuestionId = this.initialQuestionId;
    this.history = [];
  }
} 