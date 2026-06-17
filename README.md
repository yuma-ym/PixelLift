# PixelLift — ドットRPG風 筋トレアプリ

Windowsだけで開発でき、自分のiPhoneで動かせる筋トレ記録アプリです。
React Native + Expo（SDK 56）で作られています。

主人公の各部位がボタンになっていて、タップするとその筋肉の種目へ。
中央のダンベルでワークアウト開始。記録はすべて端末内にオフライン保存されます。

---

## 必要なもの

- Windows PC
- [Node.js](https://nodejs.org/)（LTS版）
- 自分のiPhone（テスト用。App Storeから「Expo Go」を入れておく）
- ※App Storeに配信するときだけ Apple Developer Program（年99ドル）が必要

Macは不要です。配信もクラウド（EAS）で行います。

---

## セットアップ（初回）

このフォルダ（pixel-lift）をPCの好きな場所に置き、PowerShell かコマンドプロンプトで開いて：

```bash
cd pixel-lift

# 1) 依存をインストール
npm install

# 2) バージョン整合を Expo に合わせてもらう（推奨）
npx expo install --fix
```

> `npm install` で警告が出ても、`npx expo install --fix` を実行すれば
> Expo SDK 56 に合ったバージョンへ自動調整されます。

---

## 自分のiPhoneで動かす（Macなし・無料）

```bash
npx expo start
```

ターミナルにQRコードが出ます。iPhoneの **Expo Go** アプリ（または初回はカメラ）で
QRを読み取ると、その場でアプリが起動します。コードを保存すると即リロードされます。

> PCとiPhoneを同じWi-Fiにつないでください。
> うまくいかない時は `npx expo start --tunnel` を試す。

---

## フォントについて

日本語対応のドットフォント **DotGothic16** を `@expo-google-fonts/dotgothic16`
から読み込んでいます（インストール時に同梱されるので追加作業は不要）。

---

## 主人公の絵を入れる

今はコードで組んだ簡易ボディで動きます。
外部AIで作ったキャラ絵（PNG）を差し込む手順は
`assets/HERO_SPRITE_GUIDE.md` を見てください（生成プロンプト例つき）。

---

## App Storeに配信する（収益化する段階）

Macなしでも、クラウドビルドで配信できます。

```bash
# EAS CLI を入れる
npm install -g eas-cli

# Expoアカウントでログイン（無料）
eas login

# iOSビルド（クラウドで実行。Apple Developer登録が必要）
eas build --platform ios

# App Store Connect へ提出
eas submit --platform ios
```

- Apple Developer Program（年99ドル≒約15,000円）への登録が必要
- 広告で収益化する場合は、配信前に広告SDK（例: `react-native-google-mobile-ads`）を追加

---

## フォルダ構成

```
pixel-lift/
├─ app/                      画面（expo-router のファイルベース）
│  ├─ _layout.tsx            フォント読込・ナビ設定
│  ├─ index.tsx             ★ホーム（主人公ボディマップ）
│  ├─ muscle/[group].tsx     部位ごとの種目一覧
│  ├─ workout.tsx            ワークアウト記録（記録中の画面）
│  ├─ routines.tsx           ルーティン作成・一覧
│  └─ history.tsx            きろく（履歴）
├─ src/
│  ├─ theme.ts               配色・フォント・部位カラー
│  ├─ types.ts               型定義
│  ├─ data/seed.ts           初期の種目ライブラリ
│  ├─ store/useStore.ts      状態管理＋端末保存（zustand + AsyncStorage）
│  └─ components/
│     ├─ Frame.tsx           金枠ウィンドウ等の共通部品
│     └─ Hero.tsx            主人公ボディマップ（差し替え対応）
└─ assets/
   └─ HERO_SPRITE_GUIDE.md   キャラ絵の入れ方とAIプロンプト
```

---

## 実装済みの機能

- ホーム：主人公の各部位＝ボタン（前/後ろ切替）、中央ダンベルで開始、今週の回数/挙上量
- 部位ごとの種目一覧、種目の追加（自作種目）
- ワークアウト記録：種目追加、セット（kg×回数）入力、完了チェック、経過タイマー
- ルーティン作成・保存・そこから開始
- きろく（履歴）：日付・セット数・挙上量、タップで内訳展開
- すべて端末内にオフライン保存（アプリを閉じても残る）

## 次の一手（任意）

- 主人公スプライトの差し込み（assets/HERO_SPRITE_GUIDE.md）
- 重量推移グラフ
- 広告 or 買い切りProの追加
