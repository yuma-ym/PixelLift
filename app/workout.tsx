import { useEffect, useState } from 'react';
import { View, ScrollView, Pressable, TextInput, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Stack } from 'expo-router';
import { useStore } from '../src/store/useStore';
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
  const [restStartAt, setRestStartAt] = useState<number | null>(null);
  const restDuration = useStore((s) => s.restDuration);
  const setRestDuration = useStore((s) => s.setRestDuration);

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

  // レストタイマー（セット完了で自動スタート。秒数は永続化された restDuration を使う）
  const startRest = () => setRestStartAt(Date.now());
  const restElapsed = restStartAt ? Math.floor((now - restStartAt) / 1000) : 0;
  const restRemain = restStartAt ? Math.max(0, restDuration - restElapsed) : restDuration;
  const restDone = restStartAt != null && restRemain === 0;
  const rmm = String(Math.floor(restRemain / 60)).padStart(2, '0');
  const rss = String(restRemain % 60).padStart(2, '0');

  const toggleSet = (s: SetRecord) => {
    const next = !s.completed;
    updateSet(session.id, s.id, { completed: next });
    if (next) startRest();
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView contentContainerStyle={styles.scroll}>

        <Win style={styles.headerWin}>
          <Pressable onPress={finish} hitSlop={10}><PixelText size={13} color={colors.frameHi}>← 戻る</PixelText></Pressable>
          <PixelText size={13} color={colors.frameHi}>{session.name}</PixelText>
          <PixelText size={11} color={colors.inkDim}>{mm}:{ss}</PixelText>
        </Win>

        <Win style={styles.restWin}>
          <PixelText size={11} color={colors.inkDim}>レストタイマー</PixelText>
          <View style={styles.restRow}>
            <Pressable onPress={() => setRestDuration(restDuration - 30)} style={styles.restAdj}>
              <PixelText size={15} color={colors.ink}>-30秒</PixelText>
            </Pressable>
            <PixelText size={32} color={restDone ? colors.success : colors.frameHi} shadow style={styles.restTime}>
              {restDone ? '休憩おわり' : `${rmm}:${rss}`}
            </PixelText>
            <Pressable onPress={() => setRestDuration(restDuration + 10)} style={styles.restAdj}>
              <PixelText size={15} color={colors.ink}>+10秒</PixelText>
            </Pressable>
          </View>
          <Pressable onPress={() => setRestStartAt(null)} hitSlop={8} style={styles.restReset}>
            <PixelText size={11} color={colors.inkDim}>リセット</PixelText>
          </Pressable>
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
                <PixelText size={9} color={colors.inkDim} style={{ width: 22 }}>SET</PixelText>
                <PixelText size={9} color={colors.inkDim} style={{ width: 62, textAlign: 'center' }}>kg</PixelText>
                <PixelText size={9} color={colors.inkDim} style={{ width: 56, textAlign: 'center' }}>回数</PixelText>
                <PixelText size={9} color={colors.inkDim} style={{ flex: 1, textAlign: 'center' }}>完了</PixelText>
                <View style={{ width: 26 }} />
              </View>

              {sets.map((set) => (
                <SetRow
                  key={set.id}
                  set={set}
                  onWeight={(v) => updateSet(session.id, set.id, { weight: v })}
                  onReps={(v) => updateSet(session.id, set.id, { reps: v })}
                  onToggle={() => toggleSet(set)}
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
      <PixelText size={13} color={colors.frameHi} style={{ width: 22 }}>{set.setIndex}</PixelText>
      <TextInput
        defaultValue={set.weight ? String(set.weight) : ''}
        onChangeText={(t) => onWeight(parseFloat(t) || 0)}
        keyboardType="decimal-pad" placeholder="0" placeholderTextColor={colors.inkDim}
        style={[styles.field, { width: 62 }]}
      />
      <TextInput
        defaultValue={set.reps ? String(set.reps) : ''}
        onChangeText={(t) => onReps(parseInt(t, 10) || 0)}
        keyboardType="number-pad" placeholder="0" placeholderTextColor={colors.inkDim}
        style={[styles.field, { width: 56 }]}
      />
      <Pressable onPress={onToggle} style={[styles.check, set.completed && styles.checkDone]}>
        <PixelText size={16} color={set.completed ? colors.outline : colors.inkDim}>
          {set.completed ? '✓ 完了' : '□ 未'}
        </PixelText>
      </Pressable>
      <Pressable onPress={onDelete} hitSlop={6} style={{ width: 26, alignItems: 'center' }}>
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
  restWin: { alignItems: 'center', gap: 6 },
  restRow: { flexDirection: 'row', alignItems: 'center', alignSelf: 'stretch', gap: 8 },
  restTime: { flex: 1, textAlign: 'center' },
  restAdj: {
    borderWidth: 2, borderColor: colors.frame, borderRadius: 4,
    paddingHorizontal: 12, paddingVertical: 10, backgroundColor: colors.win,
  },
  restReset: { paddingVertical: 2, paddingHorizontal: 10 },
  exHead: { flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 8 },
  exBar: { width: 8, height: 20, borderWidth: 2, borderColor: colors.outline },
  colHead: { flexDirection: 'row', alignItems: 'center', marginBottom: 4, gap: 6 },
  setRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 5, gap: 6 },
  setRowDone: { backgroundColor: 'rgba(111,207,82,0.12)' },
  field: {
    fontFamily: 'DotGothic16_400Regular', fontSize: 15, color: colors.ink, textAlign: 'center',
    backgroundColor: '#06050D', borderWidth: 2, borderColor: colors.frame, borderRadius: 2, paddingVertical: 5,
  },
  check: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    height: 38, borderWidth: 2, borderColor: colors.frame, borderRadius: 3, backgroundColor: colors.win,
  },
  checkDone: { backgroundColor: colors.success, borderColor: colors.outline },
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
