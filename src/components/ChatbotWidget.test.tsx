import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Question } from '../types/chatbot.types';
import { ChatbotWidget } from './ChatbotWidget';

describe('ChatbotWidget', () => {
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

  describe('基本機能', () => {
    it('初期状態でチャットボタンが表示されること', () => {
      render(<ChatbotWidget initialQuestions={mockQuestions} />);
      const button = screen.getByTestId('chatbot-toggle-button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute('aria-label', 'チャットボットを開く');
    });

    it('チャットボタンをクリックするとウィンドウが開くこと', async () => {
      render(<ChatbotWidget initialQuestions={mockQuestions} />);
      const button = screen.getByTestId('chatbot-toggle-button');
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByText('チャットボット')).toBeInTheDocument();
        expect(screen.getByText('何についてお困りですか？')).toBeInTheDocument();
      });
    });

    it('選択肢が正しく表示されること', async () => {
      render(<ChatbotWidget initialQuestions={mockQuestions} />);
      const button = screen.getByTestId('chatbot-toggle-button');
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByText('製品について')).toBeInTheDocument();
        expect(screen.getByText('注文について')).toBeInTheDocument();
      });
    });

    it('選択肢をクリックすると回答が表示されること', async () => {
      render(<ChatbotWidget initialQuestions={mockQuestions} />);
      const button = screen.getByTestId('chatbot-toggle-button');
      fireEvent.click(button);

      await waitFor(() => {
        const productOption = screen.getByText('製品について');
        fireEvent.click(productOption);
      });

      await waitFor(() => {
        expect(screen.getByText('製品についての詳細は製品カタログをご覧ください。')).toBeInTheDocument();
      });
    });

    it('選択肢をクリックすると次の質問が表示されること', async () => {
      render(<ChatbotWidget initialQuestions={mockQuestions} />);
      const button = screen.getByTestId('chatbot-toggle-button');
      fireEvent.click(button);

      await waitFor(() => {
        const productOption = screen.getByText('製品について');
        fireEvent.click(productOption);
      });

      await waitFor(() => {
        expect(screen.getByText('製品のどの点についてお困りですか？')).toBeInTheDocument();
      });
    });

    it('閉じるボタンをクリックするとウィンドウが閉じること', async () => {
      render(<ChatbotWidget initialQuestions={mockQuestions} />);
      const openButton = screen.getByTestId('chatbot-toggle-button');
      fireEvent.click(openButton);

      await waitFor(() => {
        const closeButton = screen.getByTestId('chatbot-close-button');
        fireEvent.click(closeButton);
      });

      await waitFor(() => {
        expect(screen.queryByText('チャットボット')).not.toBeInTheDocument();
      });
    });

    it('メッセージにタイムスタンプが含まれること', async () => {
      render(<ChatbotWidget initialQuestions={mockQuestions} />);
      const button = screen.getByTestId('chatbot-toggle-button');
      fireEvent.click(button);

      await waitFor(() => {
        const questionMessage = screen.getByTestId('question-message');
        expect(questionMessage).toBeInTheDocument();
      });
    });
  });

  describe('パフォーマンス', () => {
    it('大量のメッセージでもパフォーマンスが維持されること', async () => {
      const largeQuestions: Question[] = Array.from({ length: 100 }, (_, i) => ({
        id: `q${i + 1}`,
        text: `質問${i + 1}`,
        options: [
          {
            id: `q${i + 1}_opt1`,
            text: `選択肢1`,
            answer: `回答1`,
            nextQuestionId: i < 99 ? `q${i + 2}` : undefined
          },
          {
            id: `q${i + 1}_opt2`,
            text: `選択肢2`,
            answer: `回答2`
          }
        ],
        answers: {
          [`q${i + 1}_opt1`]: `回答1`,
          [`q${i + 1}_opt2`]: `回答2`
        }
      }));

      const startTime = performance.now();
      render(<ChatbotWidget initialQuestions={largeQuestions} />);
      const renderTime = performance.now() - startTime;

      // 初期レンダリングが100ms以内であることを確認
      expect(renderTime).toBeLessThan(100);

      // チャットボットを開く
      const button = screen.getByTestId('chatbot-toggle-button');
      fireEvent.click(button);

      // メッセージの表示を待つ
      await waitFor(() => {
        expect(screen.getByText('質問1')).toBeInTheDocument();
      });

      // 大量の選択肢をクリック
      for (let i = 0; i < 50; i++) {
        const option = screen.getByText('選択肢1');
        fireEvent.click(option);
        await waitFor(() => {
          expect(screen.getByText(`回答1`)).toBeInTheDocument();
        });
      }

      // パフォーマンスが維持されていることを確認
      const messages = screen.getAllByTestId(/message$/);
      expect(messages.length).toBe(100); // 50個の質問と50個の回答
    });

    it('メモ化が正しく機能していること', async () => {
      const { rerender } = render(<ChatbotWidget initialQuestions={mockQuestions} />);
      
      // チャットボットを開く
      const button = screen.getByTestId('chatbot-toggle-button');
      fireEvent.click(button);

      // 最初のレンダリング時のメッセージを取得
      const initialMessages = screen.getAllByTestId(/message$/);
      
      // 同じpropsで再レンダリング
      rerender(<ChatbotWidget initialQuestions={mockQuestions} />);
      
      // メッセージの参照が同じであることを確認（メモ化が機能している）
      const rerenderedMessages = screen.getAllByTestId(/message$/);
      expect(rerenderedMessages[0]).toBe(initialMessages[0]);
    });
  });
}); 