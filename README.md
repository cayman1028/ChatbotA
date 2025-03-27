# ChatbotA

定型回答型チャットボット

## 概要

このチャットボットは、定型的な質問に対して事前に用意された回答を提供するシンプルなチャットボットです。

## 機能

- 定型的な質問と回答の表示
- レスポンシブデザイン
- カスタマイズ可能な質問と回答
- ダークモード対応

## インストール方法

```bash
npm install
npm run dev
```

## 法人向け導入方法

### 1. スクリプトの読み込み

以下のスクリプトとCSSをHTMLファイルの`<head>`タグ内に追加してください：

```html
<!-- React と ReactDOM の読み込み -->
<script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>

<!-- チャットボットのスタイルとスクリプトの読み込み -->
<link rel="stylesheet" href="https://your-cdn-url/chatbot.css">
<script src="https://your-cdn-url/chatbot.umd.js"></script>
```

### 2. チャットボットの初期化

HTMLファイルの`<body>`タグ内に以下のコードを追加してください：

```html
<!-- チャットボットを表示する要素 -->
<div id="chatbot-container"></div>

<script>
  // チャットボットの設定
  const questions = [
    {
      id: 'q1',
      text: 'ご用件をお選びください',
      options: [
        { id: 'opt1', text: '商品について', nextQuestionId: 'q2' },
        { id: 'opt2', text: 'サービスについて', nextQuestionId: 'q3' },
        { id: 'opt3', text: 'その他のお問い合わせ', nextQuestionId: 'q4' }
      ],
      answers: {
        opt1: '商品についてのご質問ですね。',
        opt2: 'サービスについてのご質問ですね。',
        opt3: 'その他のお問い合わせですね。'
      }
    },
    // 他の質問を追加...
  ];

  // チャットボットの初期化
  window.ChatbotA.initialize('chatbot-container', questions);
</script>
```

### 3. カスタマイズ

質問と回答は`questions`配列を編集することでカスタマイズできます。各質問は以下の形式で定義します：

```javascript
{
  id: '質問のID',
  text: '質問文',
  options: [
    {
      id: '選択肢のID',
      text: '選択肢のテキスト',
      nextQuestionId: '次の質問のID（最後の質問の場合はnull）'
    }
  ],
  answers: {
    '選択肢のID': '選択肢に対する回答'
  }
}
```

## 開発者向け情報

### ビルド方法

```bash
npm run build
```

ビルドされたファイルは`dist`ディレクトリに出力されます：
- `chatbot.umd.js`: ブラウザ用のUMDバンドル
- `chatbot.es.js`: モジュール用のESバンドル
- `chatbot.css`: スタイルシート

### テスト実行

```bash
npm test
```

## ライセンス

Apache-2.0 License