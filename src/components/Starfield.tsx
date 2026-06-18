import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../theme';

// 背景に散らすドットの星。RPGの夜空/ダンジョン感を出す飾り。
// 乱数は初回マウント時に固定（チラつき防止）。
export default function Starfield({ count = 28 }: { count?: number }) {
  const stars = useMemo(
    () =>
      Array.from({ length: count }).map(() => ({
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: Math.random() < 0.8 ? 2 : 3,
        dim: Math.random() < 0.5,
      })),
    [count]
  );

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {stars.map((s, i) => (
        <View
          key={i}
          style={{
            position: 'absolute',
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            backgroundColor: s.dim ? colors.frameShadow : colors.frameHi,
            opacity: s.dim ? 0.35 : 0.7,
          }}
        />
      ))}
    </View>
  );
}
