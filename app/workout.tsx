import { useEffect, useState } from 'react';
import { View, ScrollView, Pressable, TextInput, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Stack } from 'expo-router';
import { useStore, sessionVolume, completedCount, formatVolume } from '../src/store/useStore';
import { colors, muscleColor } from '../src/theme';
import type { MuscleGroup } from '../src/theme';
import { muscleGroups } from '../src/theme';
import { Win, PixelText, PixelButton } from '../src/components/Frame';
import type { SetRecord } from '../src/types';

export default function Workout() {
  const router = useRouter();
  const currentId = useStore((s) => s.currentSessionId);
  const session = useStore((s) => s.sessions.find((x) => x.id === currentId));
  const getExercise = useStore((s) => s.getExercise);
  const exercises = useStore((s) => s.exercises);
  const addSet = useStore((s) => s.addSet);
  const updateSet = useStore((s) => s.updateSet);
  const deleteSet = useStore((s) => s.deleteSet);
  const addExerciseToSession = useStore((s) => s.addExerciseToSession);
  const removeExerciseFromSession = useStore((s) => s.removeExerciseFromSession);
  const finishSession = useStore((s) => s.finishSession);
  const routines = useStore((s) => s.routines);
  const startFromRoutine = useStore((s) => s.startSessionFromRoutine);
  const startEmpty = useStore((s) => s.startEmptySession);

  const [now, setNow] = useState(Date.now());
  const [pickerMuscle, setPickerMuscle] = useState<MuscleGroup | null>(null);

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  // アクティブなセッションが無ければ、メニューを選んで開始する画面
  if (!session) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <Stack.Screen options={{ headerShown: false }} />
        <ScrollView contentContainerStyle={styles.scroll}>
          <Win style={styles.headerWin}>
            <Pressable onPress={() => router.back()} hitSlop={10}>
              <PixelText size={13} color={colors.frameHi}>← 戻る</PixelText>
            </Pressable>
            <PixelText size={13} color={colors.frameHi}>メニューを選ぶ</PixelText>
            <View style={{ width: 40 }} />
          </Win>

          {routines.length === 0 ? (
            <Win>
              <PixelText size={12} color={colors.inkDim} style={{ textAlign: 'center', marginBottom: 10 }}>
                メニューがまだありません。{'\n'}「メニュー」画面で作成してください。
              </PixelText>
              <PixelButton label="メニューを作る" onPress={() => router.push('/routines')} />
            </Win>
          ) : (
            routines.map((r) => (
              <Pressable key={r.id} onPress={() => startFromRoutine(r.id)}
                style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}>
                <Win>
                  <PixelText size={15} color={colors.frameHi}>{r.name}</PixelText>
                  <PixelText size={11} color={colors.inkDim} style={{ marginTop: 6 }}>
                    {r.items.map((it) => getExercise(it.exerciseId)?.name).filter(Boolean).join('・')}
                  </PixelText>
                </Win>
              </Pressable>
            ))
          )}

          <PixelButton label="メニューなしで始める" fill={colors.win} textColor={colors.ink} onPress={startEmpty} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  const elapsed = Math.floor((now - session.startedAt) / 1000);
  const mm = String(Math.floor(elapsed / 60)).padStart(2, '0');
  const ss = String(elapsed % 60).padStart(2, '0');

  // 種目ごとにまとめる（出現順）
  const order: string[] = [];
  const map: Record<string, SetRecord[]> = {};
  for (const set of session.sets) {
    if (!map[set.exerciseId]) { map[set.exerciseId] = []; order.push(set.exerciseId); }
    map[set.exerciseId].push(set);
  }

  const finish = () => { finishSession(session.id); router.back(); };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView contentContainerStyle={styles.scroll}>

        <Win style={styles.headerWin}>
          <Pressable onPress={finish} hitSlop={10}><PixelText size={13} color={colors.frameHi}>← 戻る</PixelText></Pressable>
          <PixelText size={13} color={colors.frameHi}>{session.name}</PixelText>
          <PixelText size={11} color={colors.inkDim}>{mm}:{ss}</PixelText>
        </Win>

        <Win style={styles.statWin}>
          <Stat value={`${completedCount(session)}`} label="完了セット" />
          <View style={styles.div} />
          <Stat value={formatVolume(sessionVolume(session))} label="挙上量" />
        </Win>

        {order.length === 0 && (
          <Win><PixelText size={12} color={colors.inkDim} style={{ textAlign: 'center' }}>
            下の「種目を追加」から種目を選ぼう。
          </PixelText></Win>
        )}

        {order.map((exId) => {
          const ex = getExercise(exId);
          const sets = map[exId];
          const mc = ex ? muscleColor[ex.muscle] : colors.frame;
          return (
            <Win key={exId}>
              <View style={styles.exHead}>
                <View style={[styles.exBar, { backgroundColor: mc }]} />
                <PixelText size={14} color={mc} style={{ flex: 1 }}>{ex?.name ?? '種目'}</PixelText>
                <Pressable onPress={() => removeExerciseFromSession(session.id, exId)}>
                  <PixelText size={13} color={colors.inkDim}>削除</PixelText>
                </Pressable>
              </View>

              <View style={styles.colHead}>
                <PixelText size={9} color={colors.inkDim} style={{ width: 28 }}>SET</PixelText>
                <PixelText size={9} color={colors.inkDim} style={styles.colFlex}>kg</PixelText>
                <PixelText size={9} color={colors.inkDim} style={styles.colFlex}>回数</PixelText>
                <View style={{ width: 56 }} />
              </View>

              {sets.map((set) => (
                <SetRow
                  key={set.id}
                  set={set}
                  onWeight={(v) => updateSet(session.id, set.id, { weight: v })}
                  onReps={(v) => updateSet(session.id, set.id, { reps: v })}
                  onToggle={() => updateSet(session.id, set.id, { completed: !set.completed })}
                  onDelete={() => deleteSet(session.id, set.id)}
                />
              ))}

              <Pressable onPress={() => addSet(session.id, exId)} style={styles.addSet}>
                <PixelText size={11} color={colors.frameHi}>＋ セット追加</PixelText>
              </Pressable>
            </Win>
          );
        })}

        {/* 種目を追加 */}
        <Win>
          <PixelText size={11} color={colors.inkDim} style={{ marginBottom: 6 }}>─ 種目を追加 ─</PixelText>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6 }}>
            {muscleGroups.map((g) => (
              <Pressable key={g} onPress={() => setPickerMuscle(pickerMuscle === g ? null : g)}
                style={[styles.chip, { backgroundColor: pickerMuscle === g ? muscleColor[g] : colors.win }]}>
                <PixelText size={11} color={pickerMuscle === g ? colors.outline : colors.ink}>{g}</PixelText>
              </Pressable>
            ))}
          </ScrollView>
          {pickerMuscle && (
            <View style={{ marginTop: 8, gap: 6 }}>
              {exercises.filter((e) => e.muscle === pickerMuscle).map((e) => (
                <Pressable key={e.id} onPress={() => { addExerciseToSession(session.id, e.id); setPickerMuscle(null); }}
                  style={({ pressed }) => [styles.pickRow, { opacity: pressed ? 0.6 : 1 }]}>
                  <PixelText size={13}>{e.name}</PixelText>
                  <PixelText size={14} color={colors.frameHi}>＋</PixelText>
                </Pressable>
              ))}
            </View>
          )}
        </Win>

      </ScrollView>
    </SafeAreaView>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      <PixelText size={16} color={colors.frameHi}>{value}</PixelText>
      <PixelText size={9} color={colors.inkDim}>{label}</PixelText>
    </View>
  );
}

function SetRow(
  { set, onWeight, onReps, onToggle, onDelete }:
  {
    set: SetRecord;
    onWeight: (v: number) => void; onReps: (v: number) => void;
    onToggle: () => void; onDelete: () => void;
  }
) {
  return (
    <View style={[styles.setRow, set.completed && styles.setRowDone]}>
      <PixelText size={12} color={colors.frameHi} style={{ width: 28 }}>{set.setIndex}</PixelText>
      <TextInput
        defaultValue={set.weight ? String(set.weight) : ''}
        onChangeText={(t) => onWeight(parseFloat(t) || 0)}
        keyboardType="decimal-pad" placeholder="0" placeholderTextColor={colors.inkDim}
        style={styles.field}
      />
      <TextInput
        defaultValue={set.reps ? String(set.reps) : ''}
        onChangeText={(t) => onReps(parseInt(t, 10) || 0)}
        keyboardType="number-pad" placeholder="0" placeholderTextColor={colors.inkDim}
        style={styles.field}
      />
      <Pressable onPress={onToggle} style={{ width: 28, alignItems: 'center' }}>
        <PixelText size={18} color={set.completed ? colors.success : colors.inkDim}>
          {set.completed ? '★' : '☆'}
        </PixelText>
      </Pressable>
      <Pressable onPress={onDelete} style={{ width: 28, alignItems: 'center' }}>
        <PixelText size={13} color={colors.danger}>✕</PixelText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  scroll: { padding: 14, gap: 10 },
  headerWin: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  statWin: { flexDirection: 'row', alignItems: 'center' },
  div: { width: 2, height: 30, backgroundColor: colors.outline },
  exHead: { flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 8 },
  exBar: { width: 8, height: 20, borderWidth: 2, borderColor: colors.outline },
  colHead: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  colFlex: { flex: 1, textAlign: 'center' },
  setRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 4 },
  setRowDone: { backgroundColor: 'rgba(111,207,82,0.12)' },
  field: {
    flex: 1, marginHorizontal: 4,
    fontFamily: 'DotGothic16_400Regular', fontSize: 14, color: colors.ink, textAlign: 'center',
    backgroundColor: '#06050D', borderWidth: 2, borderColor: colors.frame, borderRadius: 2, paddingVertical: 4,
  },
  addSet: {
    marginTop: 7, alignItems: 'center', paddingVertical: 5,
    borderWidth: 2, borderColor: colors.outline, borderRadius: 2,
  },
  chip: { borderWidth: 2, borderColor: colors.outline, borderRadius: 2, paddingHorizontal: 10, paddingVertical: 5 },
  pickRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    borderWidth: 2, borderColor: colors.frame, borderRadius: 3, paddingHorizontal: 9, paddingVertical: 7,
  },
});
