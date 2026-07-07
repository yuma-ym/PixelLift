import React, { useEffect, useRef } from 'react';
import { View, Pressable, ScrollView, StyleSheet, ViewStyle, Animated, Easing } from 'react-native';
import { colors, muscleColor } from '../theme';
import type { MuscleGroup } from '../theme';
import { PixelText } from './Frame';
import HeroSprite from './HeroSprite';
import { useState } from 'react';

const STAGE_W = 300;
const STAGE_H = 320;
const HALF_W = STAGE_W / 2;
const SPRITE_W = HALF_W - 16;
const SPRITE_H = STAGE_H - 30;
const SPRITE_LEFT = 8;
const SPRITE_TOP = 4;
// HeroSprite.tsx の <Svg viewBox="0 0 120 160"> と同じ座標系
const VB_W = 120;
const VB_H = 160;

const SUB_MUSCLES: Record<string, { name: string; desc: string }[]> = {
  '胸': [
    { name: '大胸筋（上部）', desc: 'インクラインプレス' },
    { name: '大胸筋（中部）', desc: 'ベンチプレス・フライ' },
    { name: '大胸筋（下部）', desc: 'デクライン・ディップス' },
  ],
  '背中': [
    { name: '広背筋', desc: 'ラットプル・懸垂' },
    { name: '僧帽筋', desc: 'シュラッグ・フェイスプル' },
    { name: '脊柱起立筋', desc: 'デッドリフト・バックEX' },
  ],
  '肩': [
    { name: '三角筋（前部）', desc: 'フロントレイズ' },
    { name: '三角筋（中部）', desc: 'サイドレイズ' },
    { name: '三角筋（後部）', desc: 'リアレイズ' },
  ],
  '腕': [
    { name: '上腕二頭筋', desc: 'カール系' },
    { name: '上腕三頭筋', desc: 'プッシュダウン・スカクラ' },
    { name: '前腕', desc: 'リストカール' },
  ],
  '腹': [
    { name: '腹直筋', desc: 'クランチ・レッグレイズ' },
    { name: '腹斜筋', desc: 'ツイスト・サイドベント' },
  ],
  '脚': [
    { name: '大腿四頭筋', desc: 'スクワット・レッグプレス' },
    { name: 'ハムストリングス', desc: 'レッグカール・RDL' },
    { name: '臀筋', desc: 'ヒップスラスト' },
    { name: 'ふくらはぎ', desc: 'カーフレイズ' },
  ],
};

type Props = {
  heat?: Record<MuscleGroup, number>;
};

export default function Hero({ heat }: Props) {
  const [detail, setDetail] = useState<MuscleGroup | null>(null);

  const bob = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(bob, { toValue: 1, duration: 1400, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(bob, { toValue: 0, duration: 1400, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [bob]);
  const translateY = bob.interpolate({ inputRange: [0, 1], outputRange: [0, -4] });

  return (
    <View style={{ alignItems: 'center' }}>
      <View style={styles.stage}>
        <View pointerEvents="none" style={styles.stageGlow} />
        <View pointerEvents="none" style={styles.stageVignette} />
        <View pointerEvents="none" style={styles.floor} />
        <View pointerEvents="none" style={[styles.floorLine, { bottom: 34 }]} />
        <View pointerEvents="none" style={[styles.floorLine, { bottom: 20, opacity: 0.25 }]} />
        <View pointerEvents="none" style={styles.spotlightL} />
        <View pointerEvents="none" style={styles.spotlightR} />

        {detail ? (
          <MuscleDetail group={detail} onBack={() => setDetail(null)} heat={heat} />
        ) : (
          <>
            <Animated.View style={[styles.bodyWrap, { transform: [{ translateY }] }]}>
              {/* Front */}
              <View style={[styles.spriteCol, { left: 0 }]}>
                <View pointerEvents="none" style={styles.shadowEllipse} />
                <View pointerEvents="none" style={styles.spriteInner}>
                  <HeroSprite view="front" width={SPRITE_W} height={SPRITE_H} heat={heat} />
                </View>
                <HitAreas view="front" onSelectMuscle={setDetail} />
              </View>

              {/* Divider */}
              <View pointerEvents="none" style={styles.divider} />

              {/* Back */}
              <View style={[styles.spriteCol, { left: HALF_W }]}>
                <View pointerEvents="none" style={styles.shadowEllipse} />
                <View pointerEvents="none" style={styles.spriteInner}>
                  <HeroSprite view="back" width={SPRITE_W} height={SPRITE_H} heat={heat} />
                </View>
                <HitAreas view="back" onSelectMuscle={setDetail} />
              </View>
            </Animated.View>
          </>
        )}
      </View>

      <PixelText size={11} color={colors.inkDim} style={{ marginTop: 10, textAlign: 'center' }} shadow>
        {detail ? '← 戻るでアバターへ' : '部位をタップ → 詳細へ'}
      </PixelText>
    </View>
  );
}

function MuscleDetail(
  { group, onBack, heat }:
  { group: MuscleGroup; onBack: () => void; heat?: Record<MuscleGroup, number> }
) {
  const subs = SUB_MUSCLES[group] ?? [];
  const days = heat?.[group];
  const daysLabel =
    days == null || days >= 999 ? '未トレーニング' :
    days === 0 ? '今日トレ済み' :
    `${days}日前`;

  return (
    <View style={styles.detailWrap}>
      <View style={styles.detailHeader}>
        <Pressable onPress={onBack} hitSlop={10}>
          <PixelText size={12} color={colors.frameHi}>← 戻る</PixelText>
        </Pressable>
        <PixelText size={11} color={colors.inkDim}>{daysLabel}</PixelText>
      </View>

      <View style={[styles.detailTitle, { borderColor: muscleColor[group] }]}>
        <PixelText size={16} color={muscleColor[group]}>{group}</PixelText>
      </View>

      <ScrollView style={styles.detailScroll} contentContainerStyle={{ gap: 6, paddingBottom: 8 }}>
        {subs.map((sub) => (
          <View key={sub.name} style={styles.detailRow}>
            <View style={[styles.detailBar, { backgroundColor: muscleColor[group] }]} />
            <View style={{ flex: 1 }}>
              <PixelText size={13}>{sub.name}</PixelText>
              <PixelText size={9} color={colors.inkDim}>{sub.desc}</PixelText>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

function HitAreas(
  { view, onSelectMuscle }:
  { view: 'front' | 'back'; onSelectMuscle: (m: MuscleGroup) => void }
) {
  // HeroSprite.tsx の各パーツの描画座標(viewBox単位)に合わせて実画面座標へ変換する。
  // SVGはアスペクト比を保って中央寄せで描かれる(letterbox)ため、単純な幅高さ比では合わない。
  const scale = Math.min(SPRITE_W / VB_W, SPRITE_H / VB_H);
  const renderedW = VB_W * scale;
  const renderedH = VB_H * scale;
  const padX = SPRITE_LEFT + (SPRITE_W - renderedW) / 2;
  const padY = SPRITE_TOP + (SPRITE_H - renderedH) / 2;
  const hit = (x: number, y: number, w: number, h: number, br = 5) => ({
    left: padX + x * scale, top: padY + y * scale,
    width: w * scale, height: h * scale, borderRadius: br,
  });

  return (
    <>
      <Part group="肩" onPress={onSelectMuscle} style={hit(28, 48, 22, 16)} />
      <Part group="肩" onPress={onSelectMuscle} style={hit(70, 48, 22, 16)} />

      <Part group="腕" onPress={onSelectMuscle} style={hit(22, 60, 16, 48)} />
      <Part group="腕" onPress={onSelectMuscle} style={hit(82, 60, 16, 48)} />

      {view === 'front' ? (
        <>
          <Part group="胸" onPress={onSelectMuscle} style={hit(44, 52, 32, 26)} />
          <Part group="腹" onPress={onSelectMuscle} style={hit(42, 78, 36, 46)} />
        </>
      ) : (
        <Part group="背中" onPress={onSelectMuscle} style={hit(44, 52, 32, 56)} />
      )}

      <Part group="脚" onPress={onSelectMuscle} style={hit(43, 120, 17, 38)} />
      <Part group="脚" onPress={onSelectMuscle} style={hit(60, 120, 17, 38)} />
    </>
  );
}

function Part(
  { group, onPress, style }:
  { group: MuscleGroup; onPress: (m: MuscleGroup) => void; style: ViewStyle }
) {
  return (
    <Pressable
      onPress={() => onPress(group)}
      style={({ pressed }) => [
        styles.abs,
        styles.part,
        style,
        { backgroundColor: muscleColor[group], opacity: pressed ? 0.4 : 0, borderWidth: 0 },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  stage: {
    width: STAGE_W, height: STAGE_H,
    backgroundColor: '#0e0a06',
    borderWidth: 3, borderColor: colors.frame, borderRadius: 7, overflow: 'hidden',
  },
  stageGlow: {
    position: 'absolute', top: 0, left: 0, right: 0, height: 120,
    backgroundColor: '#1a1308', opacity: 0.8,
  },
  stageVignette: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    borderWidth: 18, borderColor: 'rgba(0,0,0,0.35)', borderRadius: 4,
  },
  floor: {
    position: 'absolute', left: 0, right: 0, bottom: 0, height: 48,
    backgroundColor: '#080604', opacity: 0.7,
  },
  floorLine: {
    position: 'absolute', left: 10, right: 10, height: 1,
    backgroundColor: colors.frameShadow, opacity: 0.35,
  },
  spotlightL: {
    position: 'absolute', top: 40, left: 20, width: 100, height: 200,
    backgroundColor: '#2a1f0a', opacity: 0.25, borderRadius: 999,
    transform: [{ rotate: '-8deg' }, { scaleY: 1.8 }],
  },
  spotlightR: {
    position: 'absolute', top: 40, right: 20, width: 100, height: 200,
    backgroundColor: '#2a1f0a', opacity: 0.25, borderRadius: 999,
    transform: [{ rotate: '8deg' }, { scaleY: 1.8 }],
  },
  bodyWrap: { ...StyleSheet.absoluteFillObject },
  spriteCol: {
    position: 'absolute', top: 0, width: HALF_W, height: STAGE_H,
  },
  spriteInner: {
    position: 'absolute', left: 8, top: 4, width: SPRITE_W, height: SPRITE_H,
  },
  shadowEllipse: {
    position: 'absolute', bottom: 22, left: HALF_W / 2 - 28, width: 56, height: 10,
    backgroundColor: colors.shadow, opacity: 0.4, borderRadius: 999,
    transform: [{ scaleX: 1.3 }],
  },
  divider: {
    position: 'absolute', left: HALF_W - 1, top: 20, bottom: 20, width: 1,
    backgroundColor: colors.frame, opacity: 0.3,
  },
  abs: { position: 'absolute', zIndex: 5 },
  part: { borderWidth: 2, borderColor: colors.outline, overflow: 'hidden' },
  detailWrap: {
    ...StyleSheet.absoluteFillObject,
    padding: 12,
    backgroundColor: colors.stage,
    zIndex: 10,
  },
  detailHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: 10,
  },
  detailTitle: {
    borderLeftWidth: 4, paddingLeft: 8, paddingVertical: 2, marginBottom: 10,
  },
  detailScroll: { flex: 1 },
  detailRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: colors.win, borderWidth: 2, borderColor: colors.frame,
    borderRadius: 4, padding: 8,
  },
  detailBar: { width: 6, height: 28, borderRadius: 2 },
});
