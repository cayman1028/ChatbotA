import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('エラーが発生しました:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div data-testid="error-boundary" className="error-boundary">
          <h2>申し訳ありません</h2>
          <p>チャットボットでエラーが発生しました。</p>
          <button
            data-testid="error-retry-button"
            onClick={() => {
              this.setState({ hasError: false, error: null });
            }}
          >
            再試行
          </button>
        </div>
      );
    }

    return this.props.children;
  }
} 