import { View, ScrollView, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useStore, sessionVolume, formatVolume } from '../src/store/useStore';
import { colors } from '../src/theme';
import type { MuscleGroup } from '../src/theme';
import Hero from '../src/components/Hero';
import { Win, PixelText, PixelButton } from '../src/components/Frame';

export default function Home() {
  const router = useRouter();
  const sessions = useStore((s) => s.sessions);
  const currentId = useStore((s) => s.currentSessionId);
  const startEmpty = useStore((s) => s.startEmptySession);
  const startForMuscle = useStore((s) => s.startSessionForMuscle);

  const finished = sessions.filter((s) => s.endedAt);
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const thisWeek = finished.filter((s) => s.startedAt >= weekAgo);
  const weekVolume = thisWeek.reduce((t, s) => t + sessionVolume(s), 0);

  const selectMuscle = (m: MuscleGroup) => router.push(`/muscle/${encodeURIComponent(m)}`);

  const startWorkout = () => {
    if (!currentId) startEmpty();
    router.push('/workout');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.scroll}>

        <View style={styles.titleRow}>
          <PixelText size={16} color={colors.frameHi}>★ PIXELLIFT</PixelText>
          <PixelText size={11} color={colors.inkDim}>トレーニー</PixelText>
        </View>

        <Win style={styles.statWin}>
          <View style={styles.statCell}>
            <PixelText size={18} color={colors.frameHi}>{thisWeek.length}</PixelText>
            <PixelText size={10} color={colors.inkDim}>こんしゅう</PixelText>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCell}>
            <PixelText size={18} color={colors.frameHi}>{formatVolume(weekVolume)}</PixelText>
            <PixelText size={10} color={colors.inkDim}>そうりょう</PixelText>
          </View>
        </Win>

        {currentId && (
          <View style={{ marginBottom: 12 }}>
            <PixelButton
              label="冒険を再開する"
              fill={colors.success}
              onPress={() => router.push('/workout')}
            />
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

function NavButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.navBtn, { opacity: pressed ? 0.6 : 1 }]}>
      <PixelText size={13} color={colors.ink}>{label}</PixelText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: 16, gap: 12 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statWin: { flexDirection: 'row', alignItems: 'center' },
  statCell: { flex: 1, alignItems: 'center' },
  statDivider: { width: 2, height: 34, backgroundColor: colors.outline },
  navRow: { flexDirection: 'row', gap: 10, marginTop: 14 },
  navBtn: {
    flex: 1, alignItems: 'center', paddingVertical: 12,
    backgroundColor: colors.win, borderWidth: 3, borderColor: colors.frame, borderRadius: 6,
  },
});
