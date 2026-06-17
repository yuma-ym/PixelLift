import { useState } from 'react';
import { View, ScrollView, Pressable, TextInput, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useStore } from '../src/store/useStore';
import { colors, muscleColor, muscleGroups } from '../src/theme';
import type { MuscleGroup } from '../src/theme';
import type { RoutineItem } from '../src/types';
import { Win, PixelText, PixelButton } from '../src/components/Frame';

export default function Routines() {
  const router = useRouter();
  const routines = useStore((s) => s.routines);
  const exercises = useStore((s) => s.exercises);
  const getExercise = useStore((s) => s.getExercise);
  const addRoutine = useStore((s) => s.addRoutine);
  const deleteRoutine = useStore((s) => s.deleteRoutine);
  const startFromRoutine = useStore((s) => s.startSessionFromRoutine);

  const [name, setName] = useState('');
  const [items, setItems] = useState<RoutineItem[]>([]);
  const [pickMuscle, setPickMuscle] = useState<MuscleGroup | null>(null);
  const [building, setBuilding] = useState(false);

  const addItem = (exerciseId: string) =>
    setItems((prev) => [...prev, { exerciseId, targetSets: 3, targetReps: 10 }]);

  const removeItem = (i: number) =>
    setItems((prev) => prev.filter((_, idx) => idx !== i));

  const save = () => {
    if (!name.trim() || items.length === 0) return;
    addRoutine(name, items);
    setName(''); setItems([]); setPickMuscle(null); setBuilding(false);
  };

  const start = (id: string) => { startFromRoutine(id); router.push('/workout'); };

  const confirmDelete = (id: string, rname: string) =>
    Alert.alert('削除しますか？', rname, [
      { text: 'やめる', style: 'cancel' },
      { text: '削除', style: 'destructive', onPress: () => deleteRoutine(id) },
    ]);

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scroll}>

        {routines.length === 0 && !building && (
          <Win><PixelText size={12} color={colors.inkDim} style={{ textAlign: 'center' }}>
            よく使う種目の組み合わせを「ルーティン」として保存できます。
          </PixelText></Win>
        )}

        {routines.map((r) => (
          <Win key={r.id} style={styles.routineWin}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <PixelText size={15} color={colors.frameHi}>{r.name}</PixelText>
              <Pressable onPress={() => confirmDelete(r.id, r.name)}>
                <PixelText size={12} color={colors.danger}>削除</PixelText>
              </Pressable>
            </View>
            <PixelText size={11} color={colors.inkDim} style={{ marginVertical: 6 }}>
              {r.items.map((it) => getExercise(it.exerciseId)?.name).filter(Boolean).join('・')}
            </PixelText>
            <PixelButton label="このルーティンで開始" onPress={() => start(r.id)} />
          </Win>
        ))}

        {!building ? (
          <PixelButton label="＋ ルーティンを作る" fill={colors.win} textColor={colors.ink} onPress={() => setBuilding(true)} />
        ) : (
          <Win>
            <PixelText size={11} color={colors.inkDim} style={{ marginBottom: 6 }}>─ 新しいルーティン ─</PixelText>
            <TextInput
              value={name} onChangeText={setName}
              placeholder="例: Push Day" placeholderTextColor={colors.inkDim} style={styles.input}
            />

            {items.length > 0 && (
              <View style={{ marginTop: 10, gap: 5 }}>
                {items.map((it, i) => {
                  const ex = getExercise(it.exerciseId);
                  return (
                    <View key={`${it.exerciseId}-${i}`} style={styles.itemRow}>
                      <PixelText size={13} style={{ flex: 1 }}>{ex?.name}</PixelText>
                      <PixelText size={10} color={colors.inkDim}>{it.targetSets}×{it.targetReps}</PixelText>
                      <Pressable onPress={() => removeItem(i)} style={{ marginLeft: 8 }}>
                        <PixelText size={12} color={colors.danger}>✕</PixelText>
                      </Pressable>
                    </View>
                  );
                })}
              </View>
            )}

            <PixelText size={11} color={colors.inkDim} style={{ marginTop: 10, marginBottom: 6 }}>種目を選ぶ</PixelText>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6 }}>
              {muscleGroups.map((g) => (
                <Pressable key={g} onPress={() => setPickMuscle(pickMuscle === g ? null : g)}
                  style={[styles.chip, { backgroundColor: pickMuscle === g ? muscleColor[g] : colors.win }]}>
                  <PixelText size={11} color={pickMuscle === g ? colors.outline : colors.ink}>{g}</PixelText>
                </Pressable>
              ))}
            </ScrollView>
            {pickMuscle && (
              <View style={{ marginTop: 8, gap: 6 }}>
                {exercises.filter((e) => e.muscle === pickMuscle).map((e) => (
                  <Pressable key={e.id} onPress={() => addItem(e.id)}
                    style={({ pressed }) => [styles.pickRow, { opacity: pressed ? 0.6 : 1 }]}>
                    <PixelText size={13}>{e.name}</PixelText>
                    <PixelText size={14} color={colors.frameHi}>＋</PixelText>
                  </Pressable>
                ))}
              </View>
            )}

            <View style={{ marginTop: 12, gap: 8 }}>
              <PixelButton label="保存する" fill={colors.success} onPress={save}
                disabled={!name.trim() || items.length === 0} />
              <PixelButton label="やめる" fill={colors.win} textColor={colors.ink}
                onPress={() => { setBuilding(false); setName(''); setItems([]); setPickMuscle(null); }} />
            </View>
          </Win>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: 16, gap: 12 },
  routineWin: {},
  input: {
    fontFamily: 'DotGothic16_400Regular', fontSize: 14, color: colors.ink,
    backgroundColor: colors.bg, borderWidth: 2, borderColor: colors.frame,
    borderRadius: 3, paddingHorizontal: 8, paddingVertical: 6,
  },
  itemRow: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 2, borderColor: colors.outline, borderRadius: 3, paddingHorizontal: 8, paddingVertical: 6,
  },
  chip: { borderWidth: 2, borderColor: colors.outline, borderRadius: 2, paddingHorizontal: 10, paddingVertical: 5 },
  pickRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    borderWidth: 2, borderColor: colors.frame, borderRadius: 3, paddingHorizontal: 9, paddingVertical: 7,
  },
});
