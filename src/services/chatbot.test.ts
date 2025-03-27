import { Question } from '../types/chatbot.types';
import { ChatbotService } from './chatbot';

describe('ChatbotService', () => {
  let chatbotService: ChatbotService;
  
  const mockQuestions: Question[] = [
    {
      id: 'q1',
      text: '何についてお困りですか？',
      options: [
        {
          id: 'q1_opt1',
          text: '製品について',
          answer: '製品についての詳細は製品カタログをご覧ください。',
          nextQuestionId: 'q2'
        },
        {
          id: 'q1_opt2',
          text: '注文について',
          answer: 'ご注文は受注フォームからお願いいたします。',
          nextQuestionId: 'q3'
        }
      ],
      answers: {
        q1_opt1: '製品についての詳細は製品カタログをご覧ください。',
        q1_opt2: 'ご注文は受注フォームからお願いいたします。'
      }
    },
    {
      id: 'q2',
      text: '製品のどの点についてお困りですか？',
      options: [
        {
          id: 'q2_opt1',
          text: '仕様について',
          answer: '製品仕様書をご確認ください。'
        }
      ],
      answers: {
        q2_opt1: '製品仕様書をご確認ください。'
      }
    }
  ];

  beforeEach(() => {
    chatbotService = new ChatbotService(mockQuestions);
  });

  describe('getCurrentQuestion', () => {
    it('初期状態で最初の質問を返すこと', () => {
      const question = chatbotService.getCurrentQuestion();
      expect(question).toBeDefined();
      expect(question?.id).toBe('q1');
    });
  });

  describe('selectOption', () => {
    it('選択肢を選んだ時に適切な回答を返すこと', () => {
      const response = chatbotService.selectOption('q1_opt1');
      expect(response).toBe('製品についての詳細は製品カタログをご覧ください。');
    });

    it('選択肢を選んだ時に次の質問に進むこと', () => {
      chatbotService.selectOption('q1_opt1');
      const nextQuestion = chatbotService.getCurrentQuestion();
      expect(nextQuestion?.id).toBe('q2');
    });
  });

  describe('エラーハンドリング', () => {
    it('空の質問リストで初期化するとエラーを投げること', () => {
      expect(() => new ChatbotService([])).toThrow('Questions cannot be empty');
    });

    it('存在しない選択肢IDを選択するとエラーを投げること', () => {
      expect(() => chatbotService.selectOption('invalid_id')).toThrow('Invalid option selected');
    });
  });
}); 