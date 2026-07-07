import React from 'react';
import Svg, { Rect, G } from 'react-native-svg';
import { colors } from '../theme';
import type { MuscleGroup } from '../theme';

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

const GRAY = '#6a6a6a';
const GRAY_S = '#4a4a4a';
const RED_FULL = '#e03030';
const RED_FULL_S = '#991818';

function heatColor(days: number | undefined): { fill: string; shadow: string } {
  if (days == null || days >= 4) return { fill: GRAY, shadow: GRAY_S };
  const t = Math.max(0, Math.min(1, 1 - days / 4));
  const lerp = (a: number, b: number) => Math.round(a + (b - a) * t);
  const gR = 0x6a, gG = 0x6a, gB = 0x6a;
  const rR = 0xe0, rG = 0x30, rB = 0x30;
  const sGR = 0x4a, sGG = 0x4a, sGB = 0x4a;
  const sRR = 0x99, sRG = 0x18, sRB = 0x18;
  const f = `rgb(${lerp(gR, rR)},${lerp(gG, rG)},${lerp(gB, rB)})`;
  const s = `rgb(${lerp(sGR, sRR)},${lerp(sGG, sRG)},${lerp(sGB, sRB)})`;
  return { fill: f, shadow: s };
}

type R = { x: number; y: number; w: number; h: number; f: string; o?: number };

function Block({ x, y, w, h, f, o = 1 }: R) {
  return <Rect x={x} y={y} width={w} height={h} fill={f} opacity={o} stroke={OUT} strokeWidth={1.5} />;
}
function Fill({ x, y, w, h, f, o = 1 }: R) {
  return <Rect x={x} y={y} width={w} height={h} fill={f} opacity={o} />;
}

type Props = {
  view: 'front' | 'back';
  width: number;
  height: number;
  heat?: Record<MuscleGroup, number>;
};

export default function HeroSprite({ view, width, height, heat }: Props) {
  const leg = heatColor(heat?.['脚']);
  const arm = heatColor(heat?.['腕']);
  const shoulder = heatColor(heat?.['肩']);
  const chest = heatColor(heat?.['胸']);
  const abs = heatColor(heat?.['腹']);
  const back = heatColor(heat?.['背中']);

  return (
    <Svg width={width} height={height} viewBox="0 0 120 160">
      {/* 脚 */}
      <Block x={46} y={120} w={14} h={30} f={leg.fill} />
      <Block x={60} y={120} w={14} h={30} f={leg.fill} />
      <Fill x={54} y={122} w={6} h={26} f={leg.shadow} />
      <Fill x={68} y={122} w={6} h={26} f={leg.shadow} />
      <Fill x={47} y={121} w={4} h={26} f={HI} o={0.18} />
      {/* ブーツ */}
      <Block x={43} y={148} w={17} h={10} f={BOOT} />
      <Block x={60} y={148} w={17} h={10} f={BOOT} />
      <Fill x={43} y={154} w={17} h={4} f={BOOT_S} />
      <Fill x={60} y={154} w={17} h={4} f={BOOT_S} />

      {/* トランクス */}
      <Block x={42} y={108} w={36} h={16} f={SHORTS} />
      <Fill x={42} y={108} w={36} h={4} f={SHORTS_HI} />
      <Fill x={59} y={112} w={2} h={12} f={OUT} o={0.4} />

      {/* 腕 */}
      <Block x={22} y={60} w={16} h={46} f={arm.fill} />
      <Block x={82} y={60} w={16} h={46} f={arm.fill} />
      <Fill x={33} y={62} w={5} h={42} f={arm.shadow} />
      <Fill x={93} y={62} w={5} h={42} f={arm.shadow} />
      <Fill x={23} y={62} w={4} h={20} f={HI} o={0.22} />
      <Fill x={83} y={62} w={4} h={20} f={HI} o={0.22} />
      {/* 前腕の肌 */}
      <Block x={22} y={96} w={16} h={12} f={SKIN} />
      <Block x={82} y={96} w={16} h={12} f={SKIN} />

      {/* 肩 */}
      <Block x={28} y={48} w={22} h={16} f={shoulder.fill} />
      <Block x={70} y={48} w={22} h={16} f={shoulder.fill} />
      <Fill x={28} y={48} w={22} h={4} f={HI} o={0.25} />
      <Fill x={70} y={48} w={22} h={4} f={HI} o={0.25} />
      <Fill x={44} y={50} w={6} h={12} f={shoulder.shadow} />
      <Fill x={86} y={50} w={6} h={12} f={shoulder.shadow} />

      {view === 'front' ? (
        <G>
          {/* 胸 */}
          <Block x={44} y={52} w={16} h={26} f={chest.fill} />
          <Block x={60} y={52} w={16} h={26} f={chest.fill} />
          <Fill x={44} y={52} w={16} h={4} f={HI} o={0.28} />
          <Fill x={60} y={52} w={16} h={4} f={HI} o={0.28} />
          <Fill x={54} y={56} w={6} h={22} f={chest.shadow} />
          <Fill x={70} y={56} w={6} h={22} f={chest.shadow} />
          {/* 腹 */}
          <Block x={50} y={78} w={20} h={30} f={abs.fill} />
          <Fill x={64} y={80} w={6} h={26} f={abs.shadow} />
          <Fill x={59} y={80} w={2} h={26} f={OUT} o={0.5} />
          <Fill x={51} y={88} w={18} h={1.6} f={OUT} o={0.5} />
          <Fill x={51} y={96} w={18} h={1.6} f={OUT} o={0.5} />
        </G>
      ) : (
        <G>
          {/* 背中 */}
          <Block x={44} y={52} w={32} h={56} f={back.fill} />
          <Fill x={44} y={52} w={32} h={5} f={HI} o={0.22} />
          <Fill x={54} y={52} w={12} h={10} f={back.shadow} />
          <Fill x={59} y={56} w={2} h={50} f={OUT} o={0.45} />
          <Fill x={44} y={70} w={8} h={30} f={back.shadow} o={0.8} />
          <Fill x={68} y={70} w={8} h={30} f={back.shadow} o={0.8} />
        </G>
      )}

      {/* 首 */}
      <Block x={52} y={40} w={16} h={10} f={SKIN_S} />

      {/* 頭 */}
      <Block x={45} y={14} w={30} h={28} f={SKIN} />
      <Fill x={66} y={18} w={9} h={24} f={SKIN_S} o={0.6} />
      {/* 髪 */}
      <Block x={43} y={10} w={34} h={12} f={HAIR} />
      <Fill x={45} y={11} w={30} h={3} f={HAIR_HI} />
      <Fill x={45} y={22} w={6} h={6} f={HAIR} />
      <Fill x={69} y={22} w={6} h={6} f={HAIR} />
      {view === 'front' && (
        <G>
          <Fill x={52} y={28} w={4} h={5} f={OUT} />
          <Fill x={64} y={28} w={4} h={5} f={OUT} />
          <Fill x={56} y={37} w={8} h={2} f={SKIN_S} />
        </G>
      )}
    </Svg>
  );
}
