import { useState } from 'react';
import { View, ScrollView, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStore, sessionVolume, completedCount, formatVolume } from '../src/store/useStore';
import { colors, muscleColor } from '../src/theme';
import { Win, PixelText } from '../src/components/Frame';
import type { SetRecord } from '../src/types';

export default function History() {
  const sessions = useStore((s) => s.sessions);
  const getExercise = useStore((s) => s.getExercise);
  const finished = sessions
    .filter((s) => s.endedAt)
    .sort((a, b) => b.startedAt - a.startedAt);

  const [openId, setOpenId] = useState<string | null>(null);

  const fmtDate = (ms: number) => {
    const d = new Date(ms);
    const w = ['日', '月', '火', '水', '木', '金', '土'][d.getDay()];
    return `${d.getMonth() + 1}/${d.getDate()}(${w}) ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scroll}>

        {finished.length === 0 && (
          <Win><PixelText size={12} color={colors.inkDim} style={{ textAlign: 'center' }}>
            まだ記録がありません。{'\n'}最初の1回を刻もう。
          </PixelText></Win>
        )}

        {finished.map((s) => {
          const open = openId === s.id;
          // 種目ごとにまとめる
          const order: string[] = [];
          const map: Record<string, SetRecord[]> = {};
          for (const set of s.sets) {
            if (!map[set.exerciseId]) { map[set.exerciseId] = []; order.push(set.exerciseId); }
            map[set.exerciseId].push(set);
          }
          return (
            <Pressable key={s.id} onPress={() => setOpenId(open ? null : s.id)}>
              <Win>
                <View style={styles.row}>
                  <View style={{ flex: 1 }}>
                    <PixelText size={14} color={colors.frameHi}>{s.name}</PixelText>
                    <PixelText size={10} color={colors.inkDim} style={{ marginTop: 3 }}>{fmtDate(s.startedAt)}</PixelText>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <PixelText size={11}>{completedCount(s)} セット</PixelText>
                    <PixelText size={11} color={colors.frameHi}>{formatVolume(sessionVolume(s))}</PixelText>
                  </View>
                </View>

                {open && (
                  <View style={{ marginTop: 10, gap: 8 }}>
                    {order.map((exId) => {
                      const ex = getExercise(exId);
                      const mc = ex ? muscleColor[ex.muscle] : colors.frame;
                      return (
                        <View key={exId}>
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                            <View style={{ width: 6, height: 14, backgroundColor: mc }} />
                            <PixelText size={12} color={mc}>{ex?.name ?? '種目'}</PixelText>
                          </View>
                          {map[exId].map((set) => (
                            <PixelText key={set.id} size={11} color={colors.inkDim} style={{ marginLeft: 12 }}>
                              {set.setIndex}セット目  {set.weight}kg × {set.reps}回 {set.completed ? '★' : ''}
                            </PixelText>
                          ))}
                        </View>
                      );
                    })}
                  </View>
                )}
              </Win>
            </Pressable>
          );
        })}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: 16, gap: 12 },
  row: { flexDirection: 'row', alignItems: 'center' },
});
