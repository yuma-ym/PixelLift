import { View, ScrollView, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useStore, sessionVolume, formatVolume } from '../src/store/useStore';
import { colors } from '../src/theme';
import type { MuscleGroup } from '../src/theme';
import Hero from '../src/components/Hero';
import Starfield from '../src/components/Starfield';
import { Win, PixelText, PixelButton, StatBar } from '../src/components/Frame';

const WEEKLY_GOAL = 4; // 今週の目標回数（RPG風バーの満タン基準）

export default function Home() {
  const router = useRouter();
  const sessions = useStore((s) => s.sessions);
  const currentId = useStore((s) => s.currentSessionId);
  const startEmpty = useStore((s) => s.startEmptySession);

  const finished = sessions.filter((s) => s.endedAt);
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const thisWeek = finished.filter((s) => s.startedAt >= weekAgo);
  const weekVolume = thisWeek.reduce((t, s) => t + sessionVolume(s), 0);
  const totalVolume = finished.reduce((t, s) => t + sessionVolume(s), 0);

  // 累計挙上量から“称号”を決める（飾り。EXP等のゲーム機構は持たない）
  const rank = rankFor(totalVolume);

  const selectMuscle = (m: MuscleGroup) => router.push(`/muscle/${encodeURIComponent(m)}`);
  const startWorkout = () => {
    if (!currentId) startEmpty();
    router.push('/workout');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <Starfield />
      <ScrollView contentContainerStyle={styles.scroll}>

        {/* タイトル */}
        <View style={styles.titleRow}>
          <PixelText size={20} color={colors.frameHi} shadow>★ PIXELLIFT</PixelText>
          <View style={styles.rankPill}>
            <PixelText size={10} color={colors.outline}>{rank}</PixelText>
          </View>
        </View>

        {/* ステータスウィンドウ（HP/EXP風バー＋数値） */}
        <Win style={styles.statWin}>
          <View style={styles.barsCol}>
            <StatBar label="週" value={thisWeek.length} max={WEEKLY_GOAL} fill={colors.hp} track={colors.hpDark} />
            <StatBar label="量" value={weekVolume} max={Math.max(weekVolume, totalVolume / 4, 1)} fill={colors.exp} track={colors.expDark} />
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statNums}>
            <PixelText size={20} color={colors.frameHi} shadow>{thisWeek.length}</PixelText>
            <PixelText size={9} color={colors.inkDim}>こんしゅう</PixelText>
            <PixelText size={14} color={colors.ink} shadow style={{ marginTop: 4 }}>{formatVolume(weekVolume)}</PixelText>
            <PixelText size={9} color={colors.inkDim}>そうりょう</PixelText>
          </View>
        </Win>

        {currentId && (
          <View style={{ marginBottom: 4 }}>
            <PixelButton label="▶ 冒険を再開する" fill={colors.success} onPress={() => router.push('/workout')} />
          </View>
        )}

        <Hero onSelectMuscle={selectMuscle} onStartWorkout={startWorkout} />

        <View style={styles.navRow}>
          <NavButton label="ルーティン" onPress={() => router.push('/routines')} />
          <NavButton label="きろく" onPress={() => router.push('/history')} />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

function rankFor(totalVolume: number): string {
  if (totalVolume >= 500000) return '★ 鋼の勇者';
  if (totalVolume >= 200000) return '炎の戦士';
  if (totalVolume >= 50000) return '見習い戦士';
  if (totalVolume >= 5000) return '旅の若者';
  return '駆け出し';
}

function NavButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.navBtn, { opacity: pressed ? 0.6 : 1, transform: [{ translateY: pressed ? 2 : 0 }] }]}>
      <PixelText size={13} color={colors.ink} shadow>{label}</PixelText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: 16, gap: 14 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rankPill: {
    backgroundColor: colors.frame, borderWidth: 2, borderColor: colors.outline,
    borderRadius: 3, paddingHorizontal: 8, paddingVertical: 2,
  },
  statWin: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  barsCol: { flex: 1, justifyContent: 'center', gap: 4 },
  statDivider: { width: 2, height: 44, backgroundColor: colors.frameShadow, opacity: 0.5 },
  statNums: { alignItems: 'center', minWidth: 70 },
  navRow: { flexDirection: 'row', gap: 10, marginTop: 4 },
  navBtn: {
    flex: 1, alignItems: 'center', paddingVertical: 13,
    backgroundColor: colors.win, borderWidth: 3, borderColor: colors.frame, borderRadius: 6,
  },
});
