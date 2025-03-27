import { fireEvent, render, screen } from '@testing-library/react';
import { ErrorBoundary } from '../ErrorBoundary';

// エラーを発生させるコンポーネント
const ErrorComponent = () => {
  throw new Error('テストエラー');
};

describe('ErrorBoundary', () => {
  const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

  afterEach(() => {
    consoleError.mockClear();
  });

  it('エラーが発生した場合、フォールバックUIが表示されること', () => {
    render(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>
    );

    expect(screen.getByTestId('error-boundary')).toBeInTheDocument();
    expect(screen.getByText('申し訳ありません')).toBeInTheDocument();
    expect(screen.getByText('チャットボットでエラーが発生しました。')).toBeInTheDocument();
    expect(screen.getByTestId('error-retry-button')).toBeInTheDocument();
  });

  it('エラーが発生した場合、エラーログが出力されること', () => {
    render(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>
    );

    expect(consoleError).toHaveBeenCalledWith(
      'エラーが発生しました:',
      expect.any(Error),
      expect.any(Object)
    );
  });

  it('再試行ボタンをクリックすると、エラー状態がリセットされること', () => {
    render(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>
    );

    const retryButton = screen.getByTestId('error-retry-button');
    fireEvent.click(retryButton);

    // エラー状態がリセットされ、子コンポーネントが再レンダリングされる
    expect(screen.queryByTestId('error-boundary')).not.toBeInTheDocument();
  });

  it('カスタムフォールバックUIが表示されること', () => {
    const customFallback = <div data-testid="custom-fallback">カスタムエラー表示</div>;

    render(
      <ErrorBoundary fallback={customFallback}>
        <ErrorComponent />
      </ErrorBoundary>
    );

    expect(screen.getByTestId('custom-fallback')).toBeInTheDocument();
    expect(screen.queryByTestId('error-boundary')).not.toBeInTheDocument();
  });

  it('エラーが発生していない場合、子コンポーネントが正常にレンダリングされること', () => {
    const NormalComponent = () => <div data-testid="normal-component">正常なコンポーネント</div>;

    render(
      <ErrorBoundary>
        <NormalComponent />
      </ErrorBoundary>
    );

    expect(screen.getByTestId('normal-component')).toBeInTheDocument();
    expect(screen.queryByTestId('error-boundary')).not.toBeInTheDocument();
  });
}); 