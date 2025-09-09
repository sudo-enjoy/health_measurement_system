# 健康リスク評価システム (Health Risk Assessment System)

## 概要

このプロジェクトは、労働者の健康リスクを科学的に評価し、個別化された予防プログラムを提供するWebアプリケーションです。転倒リスクと腰痛リスクの2つの主要な健康リスクを包括的に評価し、AI（GPT-4o）を活用した詳細分析とPDFレポート生成機能を備えています。

## 主な機能

### ��� 健康リスク評価
- **転倒リスク評価**: バランス能力と転倒リスクを総合的に評価
- **腰痛リスク評価**: 体幹機能と腰痛リスクを多角的に評価
- **統合評価**: 両方のリスクを同時に評価

### ��� 評価項目

#### 転倒リスク評価
- **質問票評価**:
  - 過去1年間の転倒歴
  - バランス喪失経験
  - 転倒への不安
  - 歩行時の会話困難
  - 疲労時のつまずき
  - 危険な職場環境

- **身体機能テスト**:
  - 片脚立位テスト
  - 2ステップテスト
  - ファンクショナルリーチ
  - ディープスクワット
  - 4方向ステップテスト

#### 腰痛リスク評価
- **身体機能テスト**:
  - 前屈動作評価
  - スクワット深度評価
  - プランクチャレンジ
  - 壁姿勢評価（頭部・腰椎）

- **生物心理社会的要因**:
  - 生物学的要因（10項目）
  - 心理的要因（5項目）
  - 社会的要因（5項目）

### ��� AI分析機能
- **GPT-4o統合**: OpenAIのGPT-4oを使用した詳細分析
- **個別化推奨事項**: 即座・短期・長期の推奨事項
- **エクササイズプラン**: 毎日・週次の運動計画
- **ライフスタイル改善**: 職場・日常生活・予防策の提案
- **フォローアップ計画**: 次回評価・マイルストーン・注意症状

### ��� レポート生成
- **PDF出力**: 評価結果の詳細レポート
- **AI分析付きレポート**: GPT-4o分析を含む包括的レポート
- **エクササイズ指導**: 具体的な運動指示とイラスト

## 技術スタック

### フロントエンド
- **React 18.3.1**: ユーザーインターフェース
- **TypeScript**: 型安全性
- **Vite**: ビルドツール
- **Tailwind CSS**: スタイリング
- **React Router DOM**: ルーティング

### 主要ライブラリ
- **OpenAI API**: GPT-4oによるAI分析
- **jsPDF**: PDF生成
- **html2canvas**: 画面キャプチャ
- **Lucide React**: アイコン

### 開発ツール
- **ESLint**: コード品質管理
- **PostCSS**: CSS処理
- **Autoprefixer**: CSS互換性

## プロジェクト構造

```
health_measurement_system/
├── src/
│   ├── components/          # 再利用可能なUIコンポーネント
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── FormField.tsx
│   │   ├── Layout.tsx
│   │   └── ProgressBar.tsx
│   ├── contexts/           # React Context
│   │   └── AssessmentContext.tsx
│   ├── pages/              # ページコンポーネント
│   │   ├── Home.tsx
│   │   ├── UserInfo.tsx
│   │   ├── FallRiskQuestionnaire.tsx
│   │   ├── FallRiskPhysical.tsx
│   │   ├── LowBackPainPhysical.tsx
│   │   ├── BiopsychosocialFactors.tsx
│   │   └── Results.tsx
│   ├── types/              # TypeScript型定義
│   │   └── assessment.ts
│   ├── utils/              # ユーティリティ関数
│   │   ├── gptAnalysis.ts
│   │   ├── pdfGenerator.ts
│   │   └── riskCalculation.ts
│   ├── App.tsx
│   └── main.tsx
├── images/                 # 画像リソース
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

## セットアップ

### 前提条件
- Node.js (v16以上)
- npm または yarn

### インストール

1. リポジトリをクローン
```bash
git clone <repository-url>
cd health_measurement_system
```

2. 依存関係をインストール
```bash
npm install
```

3. 開発サーバーを起動
```bash
npm run dev
```

4. ブラウザで `http://localhost:5173` にアクセス

### ビルド
```bash
npm run build
```

### プレビュー
```bash
npm run preview
```

## 使用方法

### 1. 評価タイプの選択
- 転倒リスク評価
- 腰痛リスク評価
- 両方の評価

### 2. 基本情報入力
- 性別
- 年齢層
- 身長

### 3. 評価実施
- 質問票への回答
- 身体機能テストの実施

### 4. 結果確認
- リスクレベルの表示
- 推奨事項の確認
- エクササイズプランの確認

### 5. AI分析（オプション）
- GPT-4oによる詳細分析
- 個別化された推奨事項

### 6. レポート生成
- PDF形式でのダウンロード
- AI分析結果の含む包括的レポート

## 設定

### OpenAI API設定
`src/utils/gptAnalysis.ts` でOpenAI APIキーを設定してください：

```typescript
const openai = new OpenAI({
  apiKey: "your-openai-api-key-here",
  dangerouslyAllowBrowser: true
});
```

**注意**: 本番環境では、APIキーを環境変数として管理することを推奨します。

## 開発者

- **Hareta**: プロジェクト開発者
- **Ethans**: プロジェクト開発者

## ライセンス

このプロジェクトはプライベートプロジェクトです。

## 今後の拡張予定

- [ ] 多言語対応
- [ ] データベース連携
- [ ] ユーザー認証機能
- [ ] 評価履歴管理
- [ ] 管理者ダッシュボード
- [ ] モバイルアプリ対応

## サポート

技術的な問題や質問がある場合は、開発チームまでお問い合わせください。
