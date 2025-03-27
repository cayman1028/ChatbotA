import React from 'react';
import { createRoot } from 'react-dom/client';
import { ChatbotWidget } from './components/ChatbotWidget';
import styles from './styles/chatbot.css?inline';
import { Question } from './types/chatbot.types';

// チャットボットの初期化関数
function initializeChatbot(containerId: string, questions: Question[]) {
  // スタイルの自動注入
  if (!document.getElementById('chatbot-styles')) {
    const style = document.createElement('style');
    style.id = 'chatbot-styles';
    style.textContent = styles;
    document.head.appendChild(style);
  }

  // コンポーネントのマウント
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Container with id "${containerId}" not found`);
    return;
  }

  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <ChatbotWidget initialQuestions={questions} />
    </React.StrictMode>
  );
}

// グローバルオブジェクトに初期化関数を公開
declare global {
  interface Window {
    ChatbotA: {
      initialize: (containerId: string, questions: Question[]) => void;
    };
  }
}

window.ChatbotA = {
  initialize: initializeChatbot
}; 