import React, { useState } from 'react';
import { View, Pressable, StyleSheet, ViewStyle } from 'react-native';
import { colors, muscleColor } from '../theme';
import type { MuscleGroup } from '../theme';
import { PixelText } from './Frame';

// ── 主人公ボディマップ ───────────────────────────
// 各筋肉がそのままボタン。中央のダンベルでワークアウト開始。
// 本物のスプライト(PNG)が用意できたら HeroSprite を差し替えるだけ。
//   例) <Image source={require('../../assets/hero-front.png')}
//             style={StyleSheet.absoluteFill} resizeMode="contain" />
// を stage 内に置き、各 Part を transparent なヒットエリアにする。

const STAGE_W = 240;
const STAGE_H = 320;

type Props = {
  onSelectMuscle: (m: MuscleGroup) => void;
  onStartWorkout: () => void;
};

export default function Hero({ onSelectMuscle, onStartWorkout }: Props) {
  const [view, setView] = useState<'front' | 'back'>('front');

  return (
    <View style={{ alignItems: 'center' }}>
      <View style={styles.stage}>

        {/* 向き切り替え */}
        <Pressable
          onPress={() => setView((v) => (v === 'front' ? 'back' : 'front'))}
          style={styles.flip}
        >
          <PixelText size={11} color={colors.frameHi}>
            {view === 'front' ? '背中をみる ⟳' : '前をみる ⟳'}
          </PixelText>
        </Pressable>

        {/* 頭 */}
        <View style={[styles.abs, { left: 97, top: 10, width: 46, height: 14, backgroundColor: '#2a1a10', borderTopLeftRadius: 3, borderTopRightRadius: 3, borderWidth: 2, borderColor: colors.outline }]} />
        <View style={[styles.abs, { left: 99, top: 22, width: 42, height: 30, backgroundColor: '#e7ad7e', borderWidth: 2, borderColor: colors.outline, borderRadius: 2 }]} />
        <View style={[styles.abs, { left: 99, top: 22, width: 42, height: 8, backgroundColor: '#2a1a10' }]} />
        {view === 'front' && <>
          <View style={[styles.abs, { left: 108, top: 34, width: 5, height: 5, backgroundColor: colors.outline }]} />
          <View style={[styles.abs, { left: 127, top: 34, width: 5, height: 5, backgroundColor: colors.outline }]} />
        </>}
        {/* 首 */}
        <View style={[styles.abs, { left: 112, top: 52, width: 16, height: 8, backgroundColor: '#c98a55', borderWidth: 2, borderColor: colors.outline }]} />

        {/* 肩 */}
        <Part group="肩" onPress={onSelectMuscle} style={{ left: 46, top: 58, width: 42, height: 24, borderTopLeftRadius: 6, borderTopRightRadius: 6 }} />
        <Part group="肩" onPress={onSelectMuscle} style={{ left: 152, top: 58, width: 42, height: 24, borderTopLeftRadius: 6, borderTopRightRadius: 6 }} />

        {/* 腕 */}
        <Part group="腕" onPress={onSelectMuscle} style={{ left: 42, top: 82, width: 28, height: 78, borderRadius: 6 }} />
        <Part group="腕" onPress={onSelectMuscle} style={{ left: 170, top: 82, width: 28, height: 78, borderRadius: 6 }} />

        {view === 'front' ? (
          <>
            {/* 胸 */}
            <Part group="胸" onPress={onSelectMuscle} style={{ left: 74, top: 74, width: 43, height: 34, borderRadius: 6 }} />
            <Part group="胸" onPress={onSelectMuscle} style={{ left: 123, top: 74, width: 43, height: 34, borderRadius: 6 }} />
            {/* 腹 */}
            <Part group="腹" onPress={onSelectMuscle} style={{ left: 92, top: 110, width: 56, height: 54, borderRadius: 4 }} />
          </>
        ) : (
          // 背中（胸＋腹のエリアをまとめて1ボタン）
          <Part group="背中" onPress={onSelectMuscle} style={{ left: 74, top: 74, width: 92, height: 90, borderRadius: 6 }} />
        )}

        {/* トランクス */}
        <View style={[styles.abs, { left: 84, top: 164, width: 72, height: 28, backgroundColor: '#3A4A6A', borderWidth: 2, borderColor: colors.outline, borderRadius: 3 }]} />

        {/* 脚 */}
        <Part group="脚" onPress={onSelectMuscle} style={{ left: 86, top: 190, width: 30, height: 80, borderRadius: 4 }} />
        <Part group="脚" onPress={onSelectMuscle} style={{ left: 124, top: 190, width: 30, height: 80, borderRadius: 4 }} />

        {/* ブーツ */}
        <View style={[styles.abs, { left: 84, top: 270, width: 34, height: 18, backgroundColor: '#6b4326', borderWidth: 2, borderColor: colors.outline, borderRadius: 2 }]} />
        <View style={[styles.abs, { left: 122, top: 270, width: 34, height: 18, backgroundColor: '#6b4326', borderWidth: 2, borderColor: colors.outline, borderRadius: 2 }]} />

        {/* 中央のダンベル＝ワークアウト開始 */}
        <Pressable onPress={onStartWorkout} style={({ pressed }) => [styles.dumbbell, { opacity: pressed ? 0.7 : 1 }]}>
          <View style={styles.dbWeight} />
          <View style={styles.dbBar} />
          <View style={styles.dbWeight} />
        </Pressable>

        {/* 有酸素は小さなボタンで床に */}
        {view === 'front' && (
          <Pressable onPress={() => onSelectMuscle('有酸素')} style={styles.cardioBtn}>
            <PixelText size={10} color={colors.outline}>有酸素</PixelText>
          </Pressable>
        )}
      </View>

      <PixelText size={11} color={colors.inkDim} style={{ marginTop: 8, textAlign: 'center' }}>
        部位をタップ → 種目へ ／ 中央のダンベル → ワークアウト開始
      </PixelText>
    </View>
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
        { backgroundColor: muscleColor[group], opacity: pressed ? 0.6 : 1 },
      ]}
    />
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
  abs: { position: 'absolute' },
  part: { borderWidth: 2, borderColor: colors.outline },
  flip: {
    position: 'absolute', right: 6, top: 6, zIndex: 5,
    borderWidth: 2, borderColor: colors.frame, borderRadius: 3,
    paddingHorizontal: 6, paddingVertical: 2, backgroundColor: colors.win,
  },
  dumbbell: {
    position: 'absolute', left: 84, top: 128, width: 72, height: 30,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', zIndex: 4,
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
    position: 'absolute', left: 175, bottom: 10,
    backgroundColor: muscleColor['有酸素'],
    borderWidth: 2, borderColor: colors.outline, borderRadius: 3,
    paddingHorizontal: 7, paddingVertical: 3,
  },
});
