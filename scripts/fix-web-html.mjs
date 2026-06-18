// expo export (web) 後の後処理。
// 生成バンドルは import.meta を含む ES モジュールだが、Expo SDK 54 の web テンプレートは
// <script ... defer> を type="module" 無しで出力するため、ブラウザが実行を拒否して
// 画面が真っ白になる。ここで type="module" を補ってデスクトップのブラウザで動くようにする。

import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const HTML = path.join(ROOT, 'dist', 'index.html');

let html = await readFile(HTML, 'utf8');
if (/<script[^>]*type=["']module["']/.test(html)) {
  console.log('ℹ️  既に type="module" 済み');
} else {
  html = html.replace(/<script(\s+src=)/, '<script type="module"$1');
  await writeFile(HTML, html);
  console.log('✅ dist/index.html の script に type="module" を付与');
}
