import { Question } from '../../types/chatbot.types';
import { ChatbotError, ChatbotService } from '../chatbot';

describe('ChatbotService', () => {
  const validQuestions: Question[] = [
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
          answer: 'ご注文は受注フォームからお願いいたします。'
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

  describe('初期化', () => {
    it('空の質問リストでエラーが発生すること', () => {
      expect(() => new ChatbotService([])).toThrow(ChatbotError);
      expect(() => new ChatbotService([])).toThrow('質問リストが空です');
    });

    it('質問IDが未設定の場合エラーが発生すること', () => {
      const invalidQuestions = [{ ...validQuestions[0], id: '' }];
      expect(() => new ChatbotService(invalidQuestions)).toThrow(ChatbotError);
      expect(() => new ChatbotService(invalidQuestions)).toThrow('質問IDが未設定です');
    });

    it('質問テキストが未設定の場合エラーが発生すること', () => {
      const invalidQuestions = [{ ...validQuestions[0], text: '' }];
      expect(() => new ChatbotService(invalidQuestions)).toThrow(ChatbotError);
      expect(() => new ChatbotService(invalidQuestions)).toThrow('質問テキストが未設定です');
    });

    it('選択肢が未設定の場合エラーが発生すること', () => {
      const invalidQuestions = [{ ...validQuestions[0], options: [] }];
      expect(() => new ChatbotService(invalidQuestions)).toThrow(ChatbotError);
      expect(() => new ChatbotService(invalidQuestions)).toThrow('選択肢が未設定です');
    });

    it('存在しない次の質問IDが指定された場合エラーが発生すること', () => {
      const invalidQuestions = [{
        ...validQuestions[0],
        options: [{ ...validQuestions[0].options[0], nextQuestionId: 'non_existent' }]
      }];
      expect(() => new ChatbotService(invalidQuestions)).toThrow(ChatbotError);
      expect(() => new ChatbotService(invalidQuestions)).toThrow('次の質問ID "non_existent" が見つかりません');
    });

    it('選択肢のテキストが未設定の場合エラーが発生すること', () => {
      const invalidQuestions = [{
        ...validQuestions[0],
        options: [{ ...validQuestions[0].options[0], text: '' }]
      }];
      expect(() => new ChatbotService(invalidQuestions)).toThrow(ChatbotError);
      expect(() => new ChatbotService(invalidQuestions)).toThrow('選択肢のテキストが未設定です');
    });

    it('選択肢の回答が未設定の場合エラーが発生すること', () => {
      const invalidQuestions = [{
        ...validQuestions[0],
        options: [{ ...validQuestions[0].options[0], answer: '' }]
      }];
      expect(() => new ChatbotService(invalidQuestions)).toThrow(ChatbotError);
      expect(() => new ChatbotService(invalidQuestions)).toThrow('選択肢の回答が未設定です');
    });
  });

  describe('質問の取得', () => {
    let service: ChatbotService;

    beforeEach(() => {
      service = new ChatbotService(validQuestions);
    });

    it('現在の質問が正しく取得できること', () => {
      const question = service.getCurrentQuestion();
      expect(question).toBeDefined();
      expect(question?.id).toBe('q1');
      expect(question?.text).toBe('何についてお困りですか？');
      expect(question?.options).toHaveLength(2);
    });

    it('存在しない質問IDでエラーが発生すること', () => {
      // @ts-ignore - テストのため、privateプロパティにアクセス
      service.currentQuestionId = 'non_existent';
      expect(() => service.getCurrentQuestion()).toThrow(ChatbotError);
      expect(() => service.getCurrentQuestion()).toThrow('質問ID "non_existent" が見つかりません');
    });

    it('質問の選択肢が正しく取得できること', () => {
      const question = service.getCurrentQuestion();
      const options = question?.options;
      expect(options).toBeDefined();
      expect(options![0].id).toBe('q1_opt1');
      expect(options![0].text).toBe('製品について');
      expect(options![0].answer).toBe('製品についての詳細は製品カタログをご覧ください。');
      expect(options![0].nextQuestionId).toBe('q2');
    });
  });

  describe('選択肢の選択', () => {
    let service: ChatbotService;

    beforeEach(() => {
      service = new ChatbotService(validQuestions);
    });

    it('存在しない選択肢IDでエラーが発生すること', () => {
      expect(() => service.selectOption('non_existent')).toThrow(ChatbotError);
      expect(() => service.selectOption('non_existent')).toThrow('選択肢ID "non_existent" が見つかりません');
    });

    it('存在しない次の質問IDでエラーが発生すること', () => {
      // @ts-ignore - テストのため、privateプロパティにアクセス
      service.questions.get('q1')!.options[0].nextQuestionId = 'non_existent';
      expect(() => service.selectOption('q1_opt1')).toThrow(ChatbotError);
      expect(() => service.selectOption('q1_opt1')).toThrow('次の質問ID "non_existent" が見つかりません');
    });

    it('最後の質問で選択肢を選択した場合、次の質問がnullになること', () => {
      service.selectOption('q1_opt1'); // q2に移動
      service.selectOption('q2_opt1'); // 最後の質問
      // @ts-ignore - テストのため、privateプロパティにアクセス
      expect(service.currentQuestionId).toBeNull();
    });

    it('選択肢を選択すると正しい回答が返されること', () => {
      const answer = service.selectOption('q1_opt1');
      expect(answer).toBe('製品についての詳細は製品カタログをご覧ください。');
    });

    it('選択肢を選択すると次の質問に移動すること', () => {
      service.selectOption('q1_opt1');
      const nextQuestion = service.getCurrentQuestion();
      expect(nextQuestion?.id).toBe('q2');
    });

    it('最後の質問の選択肢を選択すると会話が終了すること', () => {
      service.selectOption('q1_opt1');
      service.selectOption('q2_opt1');
      expect(() => service.getCurrentQuestion()).toThrow(ChatbotError);
      expect(() => service.getCurrentQuestion()).toThrow('会話が終了しています');
    });

    it('会話終了後に選択肢を選択するとエラーが発生すること', () => {
      service.selectOption('q1_opt1');
      service.selectOption('q2_opt1');
      expect(() => service.selectOption('q1_opt1')).toThrow(ChatbotError);
      expect(() => service.selectOption('q1_opt1')).toThrow('会話が終了しています');
    });
  });

  describe('会話の状態管理', () => {
    let service: ChatbotService;

    beforeEach(() => {
      service = new ChatbotService(validQuestions);
    });

    it('会話履歴が正しく記録されること', () => {
      const answer1 = service.selectOption('q1_opt1');
      const answer2 = service.selectOption('q2_opt1');
      
      // @ts-ignore - テストのため、privateプロパティにアクセス
      const history = service.history;
      expect(history).toHaveLength(2);
      expect(history[0].answer).toBe(answer1);
      expect(history[1].answer).toBe(answer2);
    });

    it('会話をリセットすると初期状態に戻ること', () => {
      service.selectOption('q1_opt1');
      service.selectOption('q2_opt1');
      
      service.resetConversation();
      const question = service.getCurrentQuestion();
      expect(question?.id).toBe('q1');
      // @ts-ignore - テストのため、privateプロパティにアクセス
      expect(service.history).toHaveLength(0);
    });
  });
}); 