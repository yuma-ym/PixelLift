import React from 'react';
import {
  View, Text, Pressable, StyleSheet, ViewStyle, TextStyle, StyleProp,
} from 'react-native';
import { colors, FONT, radius, borderWidth } from '../theme';
import type { MuscleGroup } from '../theme';
import { muscleColor } from '../theme';

// ── ピクセル文字 ───────────────────────────────
export function PixelText(
  { children, size = 14, color = colors.ink, style }:
  { children: React.ReactNode; size?: number; color?: string; style?: StyleProp<TextStyle> }
) {
  return (
    <Text style={[{ fontFamily: FONT, fontSize: size, color }, style]}>
      {children}
    </Text>
  );
}

// ── 金枠ウィンドウ ─────────────────────────────
export function Win(
  { children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }
) {
  return <View style={[styles.win, style]}>{children}</View>;
}

// ── メインボタン ───────────────────────────────
export function PixelButton(
  { label, onPress, fill = colors.frame, textColor = colors.outline, icon, disabled }:
  {
    label: string; onPress: () => void; fill?: string; textColor?: string;
    icon?: React.ReactNode; disabled?: boolean;
  }
) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.btn,
        { backgroundColor: fill, opacity: disabled ? 0.5 : 1, transform: [{ translateY: pressed ? 3 : 0 }] },
      ]}
    >
      <View style={styles.btnRow}>
        {icon}
        <PixelText size={15} color={textColor}>{label}</PixelText>
      </View>
    </Pressable>
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
  return <PixelText size={11} color={colors.inkDim} style={{ marginBottom: 4 }}>─ {text} ─</PixelText>;
}

const styles = StyleSheet.create({
  win: {
    backgroundColor: colors.win,
    borderWidth: borderWidth,
    borderColor: colors.frame,
    borderRadius: radius,
    padding: 10,
  },
  btn: {
    borderWidth: borderWidth,
    borderColor: colors.outline,
    borderRadius: radius,
    paddingVertical: 12,
    alignItems: 'center',
  },
  btnRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  tag: {
    borderWidth: 2,
    borderColor: colors.outline,
    borderRadius: 2,
    paddingHorizontal: 7,
    paddingVertical: 1,
  },
});
