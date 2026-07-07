import { View, ScrollView, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useStore, muscleRecency } from '../src/store/useStore';
import { colors } from '../src/theme';
import Hero from '../src/components/Hero';
import Starfield from '../src/components/Starfield';
import { Win, PixelText, PixelButton } from '../src/components/Frame';

export default function Home() {
  const router = useRouter();
  const sessions = useStore((s) => s.sessions);
  const exercises = useStore((s) => s.exercises);
  const currentId = useStore((s) => s.currentSessionId);
  const heat = muscleRecency(sessions, exercises);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <Starfield />
      <ScrollView contentContainerStyle={styles.scroll}>

        {/* タイトル */}
        <View style={styles.titleRow}>
          <PixelText size={20} color={colors.frameHi} shadow>★ PIXELLIFT</PixelText>
        </View>

        {currentId ? (
          <PixelButton label="▶ 再開" fill={colors.success} onPress={() => router.push('/workout')} />
        ) : (
          <PixelButton label="ワークアウト開始" fill={colors.frame} onPress={() => router.push('/workout')} />
        )}

        <Hero heat={heat} />

        <NavButton label="メニュー" onPress={() => router.push('/routines')} />
        <NavButton label="きろく" onPress={() => router.push('/history')} />

      </ScrollView>
    </SafeAreaView>
  );
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
  navBtn: {
    flex: 1, alignItems: 'center', paddingVertical: 13,
    backgroundColor: colors.win, borderWidth: 3, borderColor: colors.frame, borderRadius: 6,
  },
});
