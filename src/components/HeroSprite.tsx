import React from 'react';
import Svg, { Rect, G } from 'react-native-svg';
import { muscleColor, muscleShadow, colors } from '../theme';

// コードで描く16bit風ヒーロー。筋肉は部位カラー＋セル影で立体に。
// viewBox は 120 x 160。Hero.tsx の sprite 枠にフィットさせる。

const OUT = colors.outline;
const SKIN = colors.skin;
const SKIN_S = colors.skinShadow;
const HAIR = '#2a1a10';
const HAIR_HI = '#46301c';
const SHORTS = '#3A4A6A';
const SHORTS_HI = '#56689a';
const BOOT = '#6b4326';
const BOOT_S = '#4d2f18';
const HI = '#ffffff';

type R = { x: number; y: number; w: number; h: number; f: string; o?: number };

// 細い黒フチ付きの塊を描くヘルパー（pixel風のハードエッジ）
function Block({ x, y, w, h, f, o = 1 }: R) {
  return <Rect x={x} y={y} width={w} height={h} fill={f} opacity={o} stroke={OUT} strokeWidth={1.5} />;
}
// フチ無しの陰影/ハイライト用
function Fill({ x, y, w, h, f, o = 1 }: R) {
  return <Rect x={x} y={y} width={w} height={h} fill={f} opacity={o} />;
}

export default function HeroSprite({ view, width, height }: { view: 'front' | 'back'; width: number; height: number }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 120 160">
      {/* ── 脚 ── */}
      <Block x={50} y={120} w={14} h={30} f={muscleColor['脚']} />
      <Block x={64} y={120} w={14} h={30} f={muscleColor['脚']} />
      <Fill x={58} y={122} w={6} h={26} f={muscleShadow['脚']} />
      <Fill x={72} y={122} w={6} h={26} f={muscleShadow['脚']} />
      <Fill x={51} y={121} w={4} h={26} f={HI} o={0.18} />
      {/* ブーツ */}
      <Block x={48} y={148} w={17} h={10} f={BOOT} />
      <Block x={64} y={148} w={17} h={10} f={BOOT} />
      <Fill x={48} y={154} w={17} h={4} f={BOOT_S} />
      <Fill x={64} y={154} w={17} h={4} f={BOOT_S} />

      {/* ── トランクス ── */}
      <Block x={46} y={108} w={37} h={16} f={SHORTS} />
      <Fill x={46} y={108} w={37} h={4} f={SHORTS_HI} />
      <Fill x={63} y={112} w={3} h={12} f={OUT} o={0.4} />

      {/* ── 腕 ── */}
      <Block x={22} y={60} w={16} h={46} f={muscleColor['腕']} />
      <Block x={82} y={60} w={16} h={46} f={muscleColor['腕']} />
      <Fill x={33} y={62} w={5} h={42} f={muscleShadow['腕']} />
      <Fill x={93} y={62} w={5} h={42} f={muscleShadow['腕']} />
      <Fill x={23} y={62} w={4} h={20} f={HI} o={0.22} />  {/* 左二頭の張り */}
      <Fill x={83} y={62} w={4} h={20} f={HI} o={0.22} />
      {/* 前腕の肌 */}
      <Block x={22} y={96} w={16} h={12} f={SKIN} />
      <Block x={82} y={96} w={16} h={12} f={SKIN} />

      {/* ── 肩 ── */}
      <Block x={28} y={48} w={22} h={16} f={muscleColor['肩']} />
      <Block x={70} y={48} w={22} h={16} f={muscleColor['肩']} />
      <Fill x={28} y={48} w={22} h={4} f={HI} o={0.25} />
      <Fill x={70} y={48} w={22} h={4} f={HI} o={0.25} />
      <Fill x={44} y={50} w={6} h={12} f={muscleShadow['肩']} />
      <Fill x={86} y={50} w={6} h={12} f={muscleShadow['肩']} />

      {view === 'front' ? (
        <G>
          {/* 胸 */}
          <Block x={44} y={52} w={16} h={26} f={muscleColor['胸']} />
          <Block x={60} y={52} w={16} h={26} f={muscleColor['胸']} />
          <Fill x={44} y={52} w={16} h={4} f={HI} o={0.28} />
          <Fill x={60} y={52} w={16} h={4} f={HI} o={0.28} />
          <Fill x={54} y={56} w={6} h={22} f={muscleShadow['胸']} />
          <Fill x={70} y={56} w={6} h={22} f={muscleShadow['胸']} />
          {/* 腹 */}
          <Block x={50} y={78} w={20} h={30} f={muscleColor['腹']} />
          <Fill x={64} y={80} w={6} h={26} f={muscleShadow['腹']} />
          {/* 腹筋の溝 */}
          <Fill x={59} y={80} w={2} h={26} f={OUT} o={0.5} />
          <Fill x={51} y={88} w={18} h={1.6} f={OUT} o={0.5} />
          <Fill x={51} y={96} w={18} h={1.6} f={OUT} o={0.5} />
        </G>
      ) : (
        <G>
          {/* 背中（広背筋・僧帽筋） */}
          <Block x={44} y={52} w={32} h={56} f={muscleColor['背中']} />
          <Fill x={44} y={52} w={32} h={5} f={HI} o={0.22} />
          {/* 僧帽の山 */}
          <Fill x={54} y={52} w={12} h={10} f={muscleShadow['背中']} />
          {/* 背骨の溝 */}
          <Fill x={59} y={56} w={2} h={50} f={OUT} o={0.45} />
          {/* 広背筋の影 */}
          <Fill x={44} y={70} w={8} h={30} f={muscleShadow['背中']} o={0.8} />
          <Fill x={68} y={70} w={8} h={30} f={muscleShadow['背中']} o={0.8} />
        </G>
      )}

      {/* ── 首 ── */}
      <Block x={52} y={40} w={16} h={10} f={SKIN_S} />

      {/* ── 頭 ── */}
      <Block x={45} y={14} w={30} h={28} f={SKIN} />
      <Fill x={66} y={18} w={9} h={24} f={SKIN_S} o={0.6} />   {/* 顔の影 */}
      {/* 髪 */}
      <Block x={43} y={10} w={34} h={12} f={HAIR} />
      <Fill x={45} y={11} w={30} h={3} f={HAIR_HI} />
      <Fill x={45} y={22} w={6} h={6} f={HAIR} />               {/* もみあげ左 */}
      <Fill x={69} y={22} w={6} h={6} f={HAIR} />               {/* もみあげ右 */}
      {view === 'front' && (
        <G>
          {/* 目 */}
          <Fill x={52} y={28} w={4} h={5} f={OUT} />
          <Fill x={64} y={28} w={4} h={5} f={OUT} />
          {/* 口 */}
          <Fill x={56} y={37} w={8} h={2} f={SKIN_S} />
        </G>
      )}
    </Svg>
  );
}
