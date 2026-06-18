// ───────────────────────────────────────────────────────────
//  主人公スプライト登録所
//  画像生成AIで作った透過PNGをここで有効化する。手順は
//  assets/HERO_SPRITE_GUIDE.md を参照。
//
//  使い方:
//   1. assets/ に hero-front.png（任意で hero-back.png）を置く
//   2. 下の null を require('...') に書き換える（コメント例の通り）
//  これだけで Hero.tsx が自動でコード製ボディ → 本物スプライトに切替わる。
// ───────────────────────────────────────────────────────────

import type { ImageSourcePropType } from 'react-native';

export const heroSprites: {
  front: ImageSourcePropType | null;
  back: ImageSourcePropType | null;
  stageBg: ImageSourcePropType | null;
  slime: ImageSourcePropType | null;
} = {
  // gen-sprites.mjs が null を require(...) に自動で書き換える。手動でも可。
  front: require('../assets/hero-front.png'),
  back: require('../assets/hero-back.png'),
  stageBg: require('../assets/stage-bg.png'),
  slime: null,
};
