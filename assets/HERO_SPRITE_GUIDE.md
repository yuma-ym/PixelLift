# 主人公スプライトの差し込み方

アプリは今、コードで組んだ簡易ボディで動きます。外部AIで作ったキャラ絵を、ここに差し込めば本物の見た目になります。

## 1. 画像を用意する（外部AIで生成）

- 透過PNG、正方形（例 512×512 か 768×768）、背景は透明
- 正面（hero-front.png）。背中ビューも使うなら背面（hero-back.png）も
- このフォルダ（assets/）に置く

## 2. コードに差し込む

`src/components/Hero.tsx` の `stage` の中（頭などを描いている View 群の手前）に、次を1行入れる：

```tsx
import { Image } from 'react-native';

// stage の最初の子として：
<Image
  source={view === 'front'
    ? require('../../assets/hero-front.png')
    : require('../../assets/hero-back.png')}
  style={{ position: 'absolute', left: 20, top: 4, width: 200, height: 312 }}
  resizeMode="contain"
/>
```

その上で、各 `Part`（筋肉ボタン）の `backgroundColor` を透明にして、絵の上の“当たり判定”として使うと、見た目はスプライト・操作はそのまま、にできる：

```tsx
// Part コンポーネント内の backgroundColor を透明に
{ backgroundColor: 'transparent', opacity: pressed ? 0.35 : 0 }
```

（ボタン位置は絵に合わせて Hero.tsx の left/top/width/height を微調整）

## 3. AI画像生成プロンプト例（コピペ用）

英語の方が安定します。お好みのツール（ChatGPT/DALL·E、Midjourney、にじジャーニー 等）へ。

**正面（hero-front）**

```
16-bit JRPG hero sprite, full body, front view, standing T-pose-ish with arms
slightly away from body, muscular male trainer, short dark hair, wearing blue
gym shorts and brown boots, bare muscular torso, clear visible muscle groups
(chest, shoulders, biceps, abs, thighs), classic Dragon Quest / Final Fantasy
pixel art style, bold black outline, limited warm palette, flat shading,
centered, transparent background, no text. Pixel-perfect, crisp edges.
```

**背面（hero-back）** ※背中ビューを使う場合

```
Same 16-bit JRPG hero sprite, BACK view, showing back muscles (lats, traps),
glutes and hamstrings, same blue shorts and brown boots, bold black outline,
warm limited palette, flat shading, centered, transparent background, no text.
```

**ヒント**
- 「pixel art / 16-bit / transparent background / bold outline」を必ず入れる
- 生成後、背景が残る場合は透過処理（remove.bg 等）をしてからPNG保存
- 解像度が高すぎると“ドット感”が消えるので、生成後に 128〜256px へ縮小すると◎
