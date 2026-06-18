import React, { useEffect, useRef, useState } from 'react';
import { View, Pressable, StyleSheet, ViewStyle, Animated, Easing, Image } from 'react-native';
import { colors, muscleColor, muscleShadow } from '../theme';
import type { MuscleGroup } from '../theme';
import { PixelText } from './Frame';
import { heroSprites } from '../sprites';
import HeroSprite from './HeroSprite';

// ── 主人公ボディマップ ───────────────────────────
// 各筋肉がそのままボタン。中央のダンベルでワークアウト開始。
// assets に PNG を置いて src/sprites.ts を設定すると、コード製ボディが
// 自動で本物スプライトに差し替わり、各 Part は透明の当たり判定になる。

const STAGE_W = 260;
const STAGE_H = 340;

type Props = {
  onSelectMuscle: (m: MuscleGroup) => void;
  onStartWorkout: () => void;
};

export default function Hero({ onSelectMuscle, onStartWorkout }: Props) {
  const [view, setView] = useState<'front' | 'back'>('front');
  const sprite = view === 'front' ? heroSprites.front : heroSprites.back;
  const hasSprite = !!sprite;
  const bg = heroSprites.stageBg;

  // アイドルの上下ゆれ
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

  // ダンベルの淡い明滅
  const glow = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(glow, { toValue: 1, duration: 900, useNativeDriver: true }),
        Animated.timing(glow, { toValue: 0, duration: 900, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [glow]);
  const glowOpacity = glow.interpolate({ inputRange: [0, 1], outputRange: [0.25, 0.75] });

  return (
    <View style={{ alignItems: 'center' }}>
      <View style={styles.stage}>
        {bg ? (
          <>
            {/* 生成した風景背景 */}
            <Image source={bg} style={StyleSheet.absoluteFill} resizeMode="cover" />
            {/* 下側を少し暗くして主人公を引き立てる */}
            <View pointerEvents="none" style={styles.bgVignette} />
          </>
        ) : (
          <>
            {/* 背景PNGが無い時はコード製の明かり＋床 */}
            <View pointerEvents="none" style={styles.stageGlow} />
            <View pointerEvents="none" style={styles.floor} />
            <View pointerEvents="none" style={[styles.floorLine, { bottom: 30 }]} />
            <View pointerEvents="none" style={[styles.floorLine, { bottom: 16 }]} />
          </>
        )}

        {/* 向き切り替え */}
        <Pressable
          onPress={() => setView((v) => (v === 'front' ? 'back' : 'front'))}
          style={styles.flip}
        >
          <PixelText size={11} color={colors.frameHi}>
            {view === 'front' ? '背中をみる ⟳' : '前をみる ⟳'}
          </PixelText>
        </Pressable>

        {/* 足元の影 */}
        <View pointerEvents="none" style={styles.bodyShadow} />

        <Animated.View style={[styles.bodyWrap, { transform: [{ translateY }] }]}>
          {hasSprite ? (
            <Image source={sprite!} style={styles.spriteImg} resizeMode="contain" />
          ) : (
            <View style={styles.spriteSvg}>
              <HeroSprite view={view} width={STAGE_W - 36} height={STAGE_H - 30} />
            </View>
          )}
          {/* 絵の上に重ねる透明な当たり判定 */}
          <HitAreas view={view} onSelectMuscle={onSelectMuscle} transparent />
        </Animated.View>

        {/* 中央のダンベル＝ワークアウト開始 */}
        <Pressable onPress={onStartWorkout} style={({ pressed }) => [styles.dumbbell, { opacity: pressed ? 0.7 : 1 }]}>
          <Animated.View pointerEvents="none" style={[styles.dbGlow, { opacity: glowOpacity }]} />
          <View style={styles.dbWeight} />
          <View style={styles.dbBar} />
          <View style={styles.dbWeight} />
        </Pressable>

        {/* 有酸素は床のボタン */}
        {view === 'front' && (
          <Pressable onPress={() => onSelectMuscle('有酸素')} style={({ pressed }) => [styles.cardioBtn, { opacity: pressed ? 0.7 : 1 }]}>
            <PixelText size={10} color={colors.outline}>有酸素</PixelText>
          </Pressable>
        )}
      </View>

      <PixelText size={11} color={colors.inkDim} style={{ marginTop: 10, textAlign: 'center' }} shadow>
        部位をタップ → 種目へ ／ 中央の輝くダンベル → ワークアウト開始
      </PixelText>
    </View>
  );
}

// ── 筋肉の当たり判定（SVG/PNGの上に重ねる透明ボタン）────
function HitAreas(
  { view, onSelectMuscle, transparent }:
  { view: 'front' | 'back'; onSelectMuscle: (m: MuscleGroup) => void; transparent?: boolean }
) {
  return (
    <>
      {/* 座標は HeroSprite(viewBox120x160) を stage に scale した位置に合わせてある */}
      {/* 肩 */}
      <Part group="肩" t={transparent} onPress={onSelectMuscle} style={{ left: 70, top: 97, width: 42, height: 31, borderTopLeftRadius: 8, borderTopRightRadius: 8 }} />
      <Part group="肩" t={transparent} onPress={onSelectMuscle} style={{ left: 149, top: 97, width: 42, height: 31, borderTopLeftRadius: 8, borderTopRightRadius: 8 }} />

      {/* 腕 */}
      <Part group="腕" t={transparent} onPress={onSelectMuscle} style={{ left: 59, top: 120, width: 30, height: 89, borderRadius: 7 }} />
      <Part group="腕" t={transparent} onPress={onSelectMuscle} style={{ left: 171, top: 120, width: 30, height: 89, borderRadius: 7 }} />

      {view === 'front' ? (
        <>
          {/* 胸 */}
          <Part group="胸" t={transparent} onPress={onSelectMuscle} style={{ left: 100, top: 105, width: 30, height: 50, borderRadius: 7 }} />
          <Part group="胸" t={transparent} onPress={onSelectMuscle} style={{ left: 130, top: 105, width: 30, height: 50, borderRadius: 7 }} />
          {/* 腹 */}
          <Part group="腹" t={transparent} onPress={onSelectMuscle} style={{ left: 111, top: 155, width: 38, height: 58, borderRadius: 5 }} />
        </>
      ) : (
        <Part group="背中" t={transparent} onPress={onSelectMuscle} style={{ left: 100, top: 105, width: 60, height: 108, borderRadius: 7 }} />
      )}

      {/* 脚 */}
      <Part group="脚" t={transparent} onPress={onSelectMuscle} style={{ left: 111, top: 237, width: 26, height: 58, borderRadius: 5 }} />
      <Part group="脚" t={transparent} onPress={onSelectMuscle} style={{ left: 137, top: 237, width: 26, height: 58, borderRadius: 5 }} />
    </>
  );
}

function Part(
  { group, onPress, style, t }:
  { group: MuscleGroup; onPress: (m: MuscleGroup) => void; style: ViewStyle; t?: boolean }
) {
  return (
    <Pressable
      onPress={() => onPress(group)}
      style={({ pressed }) => [
        styles.abs,
        styles.part,
        style,
        t
          ? { backgroundColor: muscleColor[group], opacity: pressed ? 0.4 : 0, borderWidth: 0 }
          : {
              backgroundColor: muscleColor[group],
              borderBottomColor: muscleShadow[group],
              borderRightColor: muscleShadow[group],
              opacity: pressed ? 0.6 : 1,
            },
      ]}
    >
      {/* 筋肉の上辺ハイライト（立体感） */}
      {!t && <View pointerEvents="none" style={styles.partSheen} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  stage: {
    width: STAGE_W,
    height: STAGE_H,
    backgroundColor: colors.stage,
    borderWidth: 3,
    borderColor: colors.frame,
    borderRadius: 7,
    overflow: 'hidden',
  },
  stageGlow: {
    position: 'absolute', top: 0, left: 0, right: 0, height: 90,
    backgroundColor: colors.stageGlow, opacity: 0.6,
  },
  bgVignette: {
    position: 'absolute', left: 0, right: 0, bottom: 0, height: 110,
    backgroundColor: colors.bgDeep, opacity: 0.45,
  },
  floor: {
    position: 'absolute', left: 0, right: 0, bottom: 0, height: 44,
    backgroundColor: colors.bgDeep, opacity: 0.55,
  },
  floorLine: {
    position: 'absolute', left: 0, right: 0, height: 2,
    backgroundColor: colors.outline, opacity: 0.4,
  },
  bodyWrap: { ...StyleSheet.absoluteFillObject },
  // PNGスプライト: ステージいっぱいに contain で中央最大表示
  spriteImg: { position: 'absolute', left: 6, right: 6, top: 6, bottom: 8 },
  // SVGボディ: 中央寄せ
  spriteSvg: { position: 'absolute', left: 18, top: 4, width: STAGE_W - 36, height: STAGE_H - 30 },
  bodyShadow: {
    position: 'absolute', left: 92, bottom: 22, width: 76, height: 12,
    backgroundColor: colors.shadow, opacity: 0.4, borderRadius: 999,
    transform: [{ scaleX: 1.4 }],
  },
  abs: { position: 'absolute' },
  part: { borderWidth: 2, borderColor: colors.outline, overflow: 'hidden' },
  partSheen: {
    position: 'absolute', top: 0, left: 0, right: 0, height: 5,
    backgroundColor: '#ffffff', opacity: 0.25,
  },
  flip: {
    position: 'absolute', right: 6, top: 6, zIndex: 5,
    borderWidth: 2, borderColor: colors.frame, borderRadius: 3,
    paddingHorizontal: 6, paddingVertical: 2, backgroundColor: colors.win,
  },
  dumbbell: {
    position: 'absolute', left: 94, top: 138, width: 72, height: 30,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', zIndex: 4,
  },
  dbGlow: {
    position: 'absolute', left: -10, right: -10, top: -10, bottom: -10,
    backgroundColor: colors.frameHi, borderRadius: 999,
  },
  dbWeight: {
    width: 14, height: 30, backgroundColor: colors.frameHi,
    borderWidth: 2, borderColor: colors.outline, borderRadius: 3,
  },
  dbBar: {
    flex: 1, height: 9, backgroundColor: colors.frame,
    borderTopWidth: 2, borderBottomWidth: 2, borderColor: colors.outline,
  },
  cardioBtn: {
    position: 'absolute', right: 12, bottom: 12, zIndex: 6,
    backgroundColor: muscleColor['有酸素'],
    borderWidth: 2, borderColor: colors.outline, borderRadius: 3,
    paddingHorizontal: 8, paddingVertical: 4,
  },
});
