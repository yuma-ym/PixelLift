# PixelLift — 開発引き継ぎノート（CLAUDE.md）

このファイルは、別ツール（Claudeデスクトップ/Cowork）で行った設計・実装の経緯を
Claude Code に引き継ぐためのものです。起動時にまずこれを読んでください。

## プロジェクト概要
- ドットRPG風（ドラクエ/FF風）の筋トレ記録アプリ。
- オーナーは個人開発者。目的は「自分用に使う」＋「将来App Storeで配信して収益化」。
- ゲーム要素（経験値など）は**無理に入れない**方針。RPGの見た目は飾りで、機能は実用重視。

## 重要な決定事項と理由
- **技術: React Native + Expo（SDK 56）** を採用。理由＝オーナーはWindowsのみでMacが無い。
  Expoなら Windowsで開発し、Expo Goで実機確認、EASでiOSビルド/配信までMac無しで完結できる。
  （当初SwiftUIで書き始めたが、Mac必須のため破棄して全面的にExpoへ移行した）
- **言語:** TypeScript。オーナーはコードは読める程度。実装は基本Claude側が書く。
- **保存:** 端末内オフライン（zustand + AsyncStorage）。サーバーなし。
- **デザイン:** 黒地×金枠のRPGウィンドウ、DotGothic16フォント、部位カラーで色分け。
- **ホーム画面の核:** 全身の主人公が立ち、**各筋肉がそのままボタン**（タップでその部位の種目へ）。
  **中央のダンベルがワークアウト開始**。コマンドメニュー方式はやめた。前/後ろ切替あり。
- **主人公スプライト:** Claudeは画像生成ができないため、**オーナーが外部AIで生成したPNGを差し込む**方針。
  今はコード製の簡易ボディがフォールバックで入っている。差し込み手順とAIプロンプトは
  `assets/HERO_SPRITE_GUIDE.md` にある。
- **収益化:** まず広告で開始予定。将来は買い切りPro（広告削除＋追加テーマ）も検討。未実装。
- **配信:** App Store公開時のみ Apple Developer Program（年99ドル）が必要。開発・実機テストは無料。

## 技術スタック / バージョン
- expo ~56, expo-router ~56, react 19.2.x, react-native 0.85.x
- zustand 5, @react-native-async-storage/async-storage
- @expo-google-fonts/dotgothic16（日本語対応ドットフォント）

## 現在の実装状況（done）
- ホーム `app/index.tsx`：主人公ボディマップ、今週の回数/挙上量、ルーティン/きろくへの導線。
- 部位別種目 `app/muscle/[group].tsx`：一覧＋自作種目追加。タップでその種目を入れてワークアウトへ。
- ワークアウト記録 `app/workout.tsx`：種目追加、セット(kg×回数)入力、完了★、経過タイマー、終了/破棄。
- ルーティン `app/routines.tsx`：作成・保存・一覧・そこから開始・削除。
- きろく `app/history.tsx`：日付/セット数/挙上量、タップで内訳展開。
- 状態管理 `src/store/useStore.ts`、初期種目 `src/data/seed.ts`、テーマ `src/theme.ts`。
- 共通UI `src/components/Frame.tsx`、主人公 `src/components/Hero.tsx`。
- 全ファイル構文チェック済み。ただし実機での動作確認はまだ（オーナー環境で未実行）。

## 既知の注意点 / 改善余地
- `app/(tabs)/` という空フォルダが残っている可能性。expo-routerでは無害だが、不要なので削除可。
- zustandのpersistハイドレーション完了前に `seedIfNeeded` が走るタイミング問題は軽微だが、
  気になるなら `onFinishHydration` でガードする。
- 主人公スプライト差し込み後、Hero.tsx の各Partの位置(left/top/width/height)を絵に合わせて微調整必要。

## 次の一手（TODO 候補・優先順は要相談）
1. まず動かす：`npm install` → `npx expo install --fix` → `npx expo start` → Expo Goで実機確認。出たエラーを修正。
2. 主人公スプライトの差し込み（`assets/HERO_SPRITE_GUIDE.md` の手順）。
3. 重量推移グラフ／部位別ボリュームなどの統計を履歴に追加。
4. 収益化：広告SDK（react-native-google-mobile-ads）か買い切りProの追加。
5. 配信準備：EAS build/submit、アイコン・スプラッシュ、bundleIdentifier（app.json）の設定。

## 開発コマンド
```
npm install
npx expo install --fix
npx expo start          # QRをExpo Goで読む（同一Wi-Fi。ダメなら --tunnel）
```

## オーナーとのやり取りの好み
- 説明は簡潔に、冗長を避ける。日本語でOK。
- できない事は正直に伝える（例：Claudeは画像生成不可）。
```
