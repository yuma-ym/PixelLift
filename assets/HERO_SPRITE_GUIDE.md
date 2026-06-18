# 主人公スプライト & 画像アセットの差し込み方

アプリは今、コードで組んだ陰影付きピクセルボディで動きます。
画像生成AIで作ったキャラ絵を差し込むと、見た目がそのまま本物のドット絵に変わります。
**操作（筋肉タップ・ダンベル開始）はそのまま**で、絵だけ差し替わります。

---

## A. 主人公スプライト（最優先）

### 1. 画像を用意（画像生成AI）
- 透過PNG、正方形（**512×512** 推奨）、**背景は完全に透明**
- 正面 `hero-front.png`（必須）／ 背面 `hero-back.png`（背中ビューを使うなら）
- このフォルダ `assets/` に置く

### 2. 有効化（コード1か所）
`src/sprites.ts` を開き、`null` を `require` に書き換えるだけ：

```ts
export const heroSprites = {
  front: require('../assets/hero-front.png'),
  back:  require('../assets/hero-back.png'),   // 背面が無ければ null のままでOK
};
```

保存すると Hero.tsx が自動で「コード製ボディ → スプライト」に切替わり、
各筋肉ボタンは絵の上に重なる透明な当たり判定になります。

### 3. 位置の微調整（必要なら）
絵と筋肉ボタンの当たり位置がズレる場合、`src/components/Hero.tsx` の
`HitAreas` 内の各 `Part` の `left/top/width/height` を絵に合わせて調整。
スプライト自体の表示枠は同ファイル `styles.sprite` で調整。

---

## B. 画像生成AIプロンプト（コピペ用・英語推奨）

ChatGPT(DALL·E) / Midjourney / にじジャーニー / Stable Diffusion など。

### 主人公・正面（hero-front.png）
```
16-bit JRPG hero sprite, full body, front view, standing idle pose with arms
slightly away from the body, muscular male fitness trainer, short dark hair,
confident face, bare muscular torso with clearly defined muscle groups
(pectorals, deltoids, biceps, six-pack abs, quadriceps), blue gym shorts,
brown leather boots. Classic Dragon Quest / Final Fantasy SNES pixel-art style,
bold solid black outline, limited warm palette, flat cel shading with one light
source from top-left, crisp pixel edges, centered, FULLY TRANSPARENT background,
no shadow on ground, no text, no frame. Square image.
```

### 主人公・背面（hero-back.png）
```
Same 16-bit JRPG hero sprite, BACK view, full body, showing back muscles
(latissimus, trapezius, lower back), glutes and hamstrings, same blue gym shorts
and brown boots, short dark hair. Bold solid black outline, warm limited palette,
flat cel shading from top-left, crisp pixel edges, centered, FULLY TRANSPARENT
background, no text. Square image.
```

### 背景（任意・assets/bg-stage.png）※ステージ用の壁/床
```
16-bit JRPG dungeon room background, dark stone wall and tiled floor, torch
glow, cozy RPG atmosphere, top-down-ish front view, muted warm palette, pixel
art, no characters, no text. Tileable feel. (使うなら Hero.tsx の stage 背景に重ねる)
```

### アプリアイコン（任意・1024×1024, 不透明でOK）
```
App icon, 16-bit pixel-art muscular RPG hero holding a golden dumbbell, facing
front, bold black outline, dark background with subtle golden glow, centered,
no text, vibrant, crisp pixels. Square.
```

---

## C. コツ
- プロンプトに必ず入れる: **pixel art / 16-bit / bold black outline / transparent background**
- 透過が甘い時は remove.bg などで背景を抜いてから保存
- 解像度が高すぎると“ドット感”が消える → 生成後 **128〜256px** に縮小すると質感が出る
- 正面と背面は **同じ体格・同じ色・同じ光の向き** を指定して統一感を出す
- アイコン/スプラッシュを入れたら `app.json` の `icon` / `splash` も設定（配信時に必要）
