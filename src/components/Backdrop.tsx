import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import Svg, { Defs, LinearGradient, RadialGradient, Stop, Rect } from 'react-native-svg';
import { colors } from '../theme';

// 全画面共通の背景演出。
// 黄昏の紫→藍→既存の闇色へ落ちるグラデ、上部の松明の光暈、
// 四隅を落とすビネット、またたく星屑を重ねて「華やかさ」を出す。
export default function Backdrop({ sparkle = true }: { sparkle?: boolean }) {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
        <Defs>
          <LinearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={colors.bgGradientTop} stopOpacity={1} />
            <Stop offset="0.45" stopColor={colors.bgGradientMid} stopOpacity={1} />
            <Stop offset="1" stopColor={colors.bgGradientBottom} stopOpacity={1} />
          </LinearGradient>
          <RadialGradient id="torch" cx="50%" cy="0%" r="75%">
            <Stop offset="0" stopColor={colors.frameHi} stopOpacity={0.28} />
            <Stop offset="0.5" stopColor={colors.frameHi} stopOpacity={0.08} />
            <Stop offset="1" stopColor={colors.frameHi} stopOpacity={0} />
          </RadialGradient>
          <RadialGradient id="vignette" cx="50%" cy="45%" r="75%">
            <Stop offset="0" stopColor="#000000" stopOpacity={0} />
            <Stop offset="0.7" stopColor="#000000" stopOpacity={0} />
            <Stop offset="1" stopColor="#000000" stopOpacity={0.55} />
          </RadialGradient>
        </Defs>
        <Rect x={0} y={0} width="100%" height="100%" fill="url(#sky)" />
        <Rect x={0} y={0} width="100%" height="100%" fill="url(#torch)" />
        <Rect x={0} y={0} width="100%" height="100%" fill="url(#vignette)" />
      </Svg>
      {sparkle && <Sparkles />}
    </View>
  );
}

function Sparkles({ count = 34 }: { count?: number }) {
  const stars = useMemo(
    () =>
      Array.from({ length: count }).map(() => ({
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: Math.random() < 0.7 ? 2 : Math.random() < 0.9 ? 3 : 4,
        gold: Math.random() < 0.35,
        delay: Math.random() * 2200,
        dur: 1300 + Math.random() * 1600,
      })),
    [count]
  );

  return (
    <>
      {stars.map((s, i) => (
        <Twinkle key={i} {...s} />
      ))}
    </>
  );
}

function Twinkle(
  { left, top, size, gold, delay, dur }:
  { left: number; top: number; size: number; gold: boolean; delay: number; dur: number }
) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 1, duration: dur, delay, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0, duration: dur, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [anim, delay, dur]);

  const opacity = anim.interpolate({ inputRange: [0, 1], outputRange: [0.15, 0.9] });

  return (
    <Animated.View
      style={{
        position: 'absolute',
        left: `${left}%`,
        top: `${top}%`,
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: gold ? colors.frameHi : colors.ink,
        opacity,
      }}
    />
  );
}
