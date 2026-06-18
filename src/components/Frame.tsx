import React from 'react';
import {
  View, Text, Pressable, StyleSheet, ViewStyle, TextStyle, StyleProp,
} from 'react-native';
import { colors, FONT, radius, borderWidth, muscleColor } from '../theme';
import type { MuscleGroup } from '../theme';

// ── ピクセル文字 ───────────────────────────────
// shadow を付けると DQ 風の黒フチ文字になる。
export function PixelText(
  { children, size = 14, color = colors.ink, style, shadow }:
  {
    children: React.ReactNode; size?: number; color?: string;
    style?: StyleProp<TextStyle>; shadow?: boolean;
  }
) {
  return (
    <Text
      style={[
        { fontFamily: FONT, fontSize: size, color },
        shadow && {
          textShadowColor: colors.outline,
          textShadowOffset: { width: 1.5, height: 1.5 },
          textShadowRadius: 0,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}

// ── 金枠ウィンドウ（二重枠＋四隅スタッド）──────────
export function Win(
  { children, style, tone = colors.win }:
  { children: React.ReactNode; style?: StyleProp<ViewStyle>; tone?: string }
) {
  return (
    <View style={[styles.winOuter]}>
      <View style={[styles.win, { backgroundColor: tone }, style]}>
        {/* 上面のハイライト帯（光が当たっている表現） */}
        <View pointerEvents="none" style={styles.winSheen} />
        {children}
      </View>
      {/* 四隅の飾りスタッド */}
      <View style={[styles.stud, { top: -3, left: -3 }]} />
      <View style={[styles.stud, { top: -3, right: -3 }]} />
      <View style={[styles.stud, { bottom: -3, left: -3 }]} />
      <View style={[styles.stud, { bottom: -3, right: -3 }]} />
    </View>
  );
}

// ── メインボタン（押すと沈むピクセル立体）──────────
export function PixelButton(
  { label, onPress, fill = colors.frame, textColor = colors.outline, icon, disabled }:
  {
    label: string; onPress: () => void; fill?: string; textColor?: string;
    icon?: React.ReactNode; disabled?: boolean;
  }
) {
  return (
    <Pressable onPress={onPress} disabled={disabled} style={{ opacity: disabled ? 0.5 : 1 }}>
      {({ pressed }) => (
        <View style={styles.btnWrap}>
          {/* 影の土台。押すと隠れて沈んだように見える */}
          {!pressed && <View style={styles.btnShadow} />}
          <View
            style={[
              styles.btn,
              { backgroundColor: fill, transform: [{ translateY: pressed ? 4 : 0 }] },
            ]}
          >
            {/* 上辺の明るいライン */}
            <View pointerEvents="none" style={styles.btnSheen} />
            <View style={styles.btnRow}>
              {icon}
              <PixelText size={15} color={textColor}>{label}</PixelText>
            </View>
          </View>
        </View>
      )}
    </Pressable>
  );
}

// ── HP/EXP風 ステータスバー ─────────────────────
export function StatBar(
  { label, value, max, fill, track }:
  { label: string; value: number; max: number; fill: string; track: string }
) {
  const pct = max <= 0 ? 0 : Math.max(0, Math.min(1, value / max));
  return (
    <View style={styles.barRow}>
      <PixelText size={11} color={colors.frameHi} style={{ width: 30 }}>{label}</PixelText>
      <View style={styles.barTrack}>
        <View style={[StyleSheet.absoluteFill, { backgroundColor: track }]} />
        <View style={[styles.barFill, { width: `${pct * 100}%`, backgroundColor: fill }]}>
          {/* バー上部のツヤ */}
          <View style={styles.barFillSheen} />
        </View>
      </View>
    </View>
  );
}

// ── 部位タグ ───────────────────────────────────
export function MuscleTag({ group }: { group: MuscleGroup }) {
  return (
    <View style={[styles.tag, { backgroundColor: muscleColor[group] }]}>
      <PixelText size={11} color={colors.outline}>{group}</PixelText>
    </View>
  );
}

// ── 区切り見出し ───────────────────────────────
export function SectionLabel({ text }: { text: string }) {
  return (
    <View style={styles.sectionRow}>
      <View style={styles.sectionLine} />
      <PixelText size={11} color={colors.inkDim}>{text}</PixelText>
      <View style={styles.sectionLine} />
    </View>
  );
}

const styles = StyleSheet.create({
  winOuter: { position: 'relative' },
  win: {
    borderWidth: borderWidth,
    borderColor: colors.frame,
    borderRadius: radius,
    padding: 12,
    // 内側の暗いフチで「窪み」を表現
    overflow: 'hidden',
  },
  winSheen: {
    position: 'absolute', top: 0, left: 0, right: 0, height: 10,
    backgroundColor: colors.winHi, opacity: 0.5,
  },
  stud: {
    position: 'absolute', width: 7, height: 7,
    backgroundColor: colors.frameHi,
    borderWidth: 1.5, borderColor: colors.outline,
  },
  btnWrap: { position: 'relative' },
  btnShadow: {
    position: 'absolute', left: 0, right: 0, top: 4, bottom: -4,
    backgroundColor: colors.shadow, borderRadius: radius, opacity: 0.55,
  },
  btn: {
    borderWidth: borderWidth,
    borderColor: colors.outline,
    borderRadius: radius,
    paddingVertical: 12,
    alignItems: 'center',
    overflow: 'hidden',
  },
  btnSheen: {
    position: 'absolute', top: 0, left: 0, right: 0, height: 6,
    backgroundColor: '#ffffff', opacity: 0.22,
  },
  btnRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  barRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginVertical: 2 },
  barTrack: {
    flex: 1, height: 14, borderWidth: 2, borderColor: colors.outline,
    borderRadius: 3, overflow: 'hidden', backgroundColor: colors.winLine,
  },
  barFill: { height: '100%', minWidth: 3 },
  barFillSheen: {
    position: 'absolute', top: 0, left: 0, right: 0, height: 4,
    backgroundColor: '#ffffff', opacity: 0.3,
  },
  tag: {
    borderWidth: 2,
    borderColor: colors.outline,
    borderRadius: 2,
    paddingHorizontal: 7,
    paddingVertical: 1,
  },
  sectionRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  sectionLine: { flex: 1, height: 2, backgroundColor: colors.frameShadow, opacity: 0.5 },
});
