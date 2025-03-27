import { render, screen } from '@testing-library/react';
import { LoadingSpinner } from '../LoadingSpinner';

describe('LoadingSpinner', () => {
  it('デフォルトのサイズと色でレンダリングされること', () => {
    render(<LoadingSpinner />);
    const spinner = screen.getByTestId('loading-spinner');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveStyle({
      width: '30px',
      height: '30px',
      borderColor: '#007bff'
    });
  });

  it('サイズが正しく適用されること', () => {
    const sizes = ['small', 'medium', 'large'] as const;
    const expectedSizes = {
      small: '20px',
      medium: '30px',
      large: '40px'
    };

    sizes.forEach(size => {
      render(<LoadingSpinner size={size} />);
      const spinner = screen.getByTestId('loading-spinner');
      expect(spinner).toHaveStyle({
        width: expectedSizes[size],
        height: expectedSizes[size]
      });
    });
  });

  it('カスタムカラーが適用されること', () => {
    const customColor = '#ff0000';
    render(<LoadingSpinner color={customColor} />);
    const spinner = screen.getByTestId('loading-spinner');
    expect(spinner).toHaveStyle({
      borderColor: customColor
    });
  });

  it('アニメーションクラスが適用されていること', () => {
    render(<LoadingSpinner />);
    const spinner = screen.getByTestId('loading-spinner');
    expect(spinner).toHaveClass('chatbot-loading-spinner');
  });
}); 