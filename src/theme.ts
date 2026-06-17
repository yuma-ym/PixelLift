// ドットRPG風のデザイントークン。色・フォント・余白を一元管理。

export const colors = {
  bg: '#0E0B07',          // 背景（暗い茶黒）
  stage: '#15110B',       // ステージ面
  win: '#14100A',         // ウィンドウ地（黒に近い茶）
  winLine: '#060400',     // 内側の影線
  frame: '#C9A24B',       // 金枠
  frameHi: '#E8C56A',     // 金のハイライト/アクセント
  ink: '#F2E9D0',         // 文字（クリーム）
  inkDim: '#B7A47A',      // 補助文字
  outline: '#0B0804',     // ドット輪郭（ほぼ黒）
  hp: '#E0483C',          // HP赤
  exp: '#3FA0E0',         // EXP青
  success: '#6FCF52',     // 緑（完了）
  danger: '#E0483C',      // 赤（削除/にげる）
} as const;

export type MuscleGroup =
  | '胸' | '背中' | '脚' | '肩' | '腕' | '腹' | '有酸素';

export const muscleGroups: MuscleGroup[] =
  ['胸', '背中', '肩', '腕', '腹', '脚', '有酸素'];

// 部位カラーMAP（ホームのボタンと連動）
export const muscleColor: Record<MuscleGroup, string> = {
  '胸':   '#E05A5A',
  '背中': '#4A90D9',
  '肩':   '#F2994A',
  '腕':   '#BB6BD9',
  '腹':   '#F2C94C',
  '脚':   '#6FCF52',
  '有酸素': '#56CCF2',
};

// ドット絵なので角丸は最小限、枠は太め
export const radius = 6;
export const borderWidth = 3;

// 同梱フォント名（app/_layout.tsx で読み込む）
export const FONT = 'DotGothic16_400Regular';
