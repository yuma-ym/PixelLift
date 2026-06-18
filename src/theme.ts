// ドットRPG風のデザイントークン。色・フォント・余白を一元管理。

export const colors = {
  bg: '#0B0905',          // 背景（夜のダンジョン色）
  bgDeep: '#070502',      // さらに暗い最下層
  stage: '#15110B',       // ステージ面
  stageGlow: '#241a0f',   // ステージ上部の薄明かり
  win: '#181208',         // ウィンドウ地（黒に近い茶）
  winLine: '#060400',     // 内側の影線
  winHi: '#2a2012',       // ウィンドウ上部のハイライト面
  frame: '#C9A24B',       // 金枠
  frameHi: '#F2D27A',     // 金のハイライト/アクセント
  frameShadow: '#8a6a26', // 金枠の影側
  ink: '#F6EFD7',         // 文字（クリーム）
  inkDim: '#B7A47A',      // 補助文字
  outline: '#0B0804',     // ドット輪郭（ほぼ黒）
  shadow: '#000000',      // ピクセル影（ボタンの立体感）
  hp: '#E0483C',          // HP赤
  hpDark: '#7d211a',      // HP赤（バー下地）
  exp: '#3FA0E0',         // EXP青
  expDark: '#1c5680',     // EXP青（バー下地）
  success: '#6FCF52',     // 緑（完了）
  danger: '#E0483C',      // 赤（削除/にげる）
  skin: '#e7ad7e',        // 肌
  skinShadow: '#c98a55',  // 肌の影
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

// 各部位カラーの「影側」（陰影づけ用に少し暗く）
export const muscleShadow: Record<MuscleGroup, string> = {
  '胸':   '#9e3636',
  '背中': '#2f5e94',
  '肩':   '#a8632c',
  '腕':   '#7d3f97',
  '腹':   '#a8852c',
  '脚':   '#479437',
  '有酸素': '#2f8aa8',
};

// ドット絵なので角丸は最小限、枠は太め
export const radius = 6;
export const borderWidth = 3;

// 同梱フォント名（app/_layout.tsx で読み込む）
export const FONT = 'DotGothic16_400Regular';
