import { useState } from 'react';
import { View, ScrollView, Pressable, TextInput, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStore } from '../src/store/useStore';
import { colors, muscleColor, muscleGroups } from '../src/theme';
import type { MuscleGroup } from '../src/theme';
import type { RoutineItem } from '../src/types';
import { Win, PixelText, PixelButton } from '../src/components/Frame';

export default function Routines() {
  const routines = useStore((s) => s.routines);
  const exercises = useStore((s) => s.exercises);
  const getExercise = useStore((s) => s.getExercise);
  const addRoutine = useStore((s) => s.addRoutine);
  const updateRoutine = useStore((s) => s.updateRoutine);
  const deleteRoutine = useStore((s) => s.deleteRoutine);

  const [name, setName] = useState('');
  const [items, setItems] = useState<RoutineItem[]>([]);
  const [pickMuscle, setPickMuscle] = useState<MuscleGroup | null>(null);
  const [building, setBuilding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const addItem = (exerciseId: string) =>
    setItems((prev) => [...prev, { exerciseId, targetSets: 3 }]);

  const removeItem = (i: number) =>
    setItems((prev) => prev.filter((_, idx) => idx !== i));

  const updateItem = (i: number, patch: Partial<RoutineItem>) =>
    setItems((prev) => prev.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));

  const moveItem = (i: number, direction: 'up' | 'down') => {
    const j = direction === 'up' ? i - 1 : i + 1;
    setItems((prev) => {
      if (j < 0 || j >= prev.length) return prev;
      const next = [...prev];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  };

  const resetForm = () => {
    setName(''); setItems([]); setPickMuscle(null); setBuilding(false); setEditingId(null);
  };

  const save = () => {
    if (!name.trim() || items.length === 0) return;
    if (editingId) updateRoutine(editingId, name, items);
    else addRoutine(name, items);
    resetForm();
  };

  const startEdit = (id: string, rname: string, ritems: RoutineItem[]) => {
    setEditingId(id); setName(rname); setItems(ritems); setPickMuscle(null); setBuilding(true);
  };

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
            よく使う種目の組み合わせを「メニュー」として保存できます。
          </PixelText></Win>
        )}

        {routines.map((r) => (
          <Pressable key={r.id} onPress={() => startEdit(r.id, r.name, r.items)}
            style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}>
            <Win style={styles.routineWin}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <PixelText size={15} color={colors.frameHi}>{r.name}</PixelText>
                <Pressable onPress={(e) => { e.stopPropagation(); confirmDelete(r.id, r.name); }}>
                  <PixelText size={12} color={colors.danger}>削除</PixelText>
                </Pressable>
              </View>
              <PixelText size={11} color={colors.inkDim} style={{ marginVertical: 6 }}>
                {r.items.map((it) => getExercise(it.exerciseId)?.name).filter(Boolean).join('・')}
              </PixelText>
            </Win>
          </Pressable>
        ))}

        {!building ? (
          <PixelButton label="＋ メニューを作る" fill={colors.win} textColor={colors.ink} onPress={() => setBuilding(true)} />
        ) : (
          <Win>
            <PixelText size={11} color={colors.inkDim} style={{ marginBottom: 6 }}>
              {editingId ? '─ メニューを編集 ─' : '─ 新しいメニュー ─'}
            </PixelText>
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
                      <View style={styles.itemHead}>
                        <View style={{ marginRight: 8 }}>
                          <Pressable onPress={() => moveItem(i, 'up')} disabled={i === 0} hitSlop={4}>
                            <PixelText size={11} color={i === 0 ? colors.inkDim : colors.frameHi}>▲</PixelText>
                          </Pressable>
                          <Pressable onPress={() => moveItem(i, 'down')} disabled={i === items.length - 1} hitSlop={4}>
                            <PixelText size={11} color={i === items.length - 1 ? colors.inkDim : colors.frameHi}>▼</PixelText>
                          </Pressable>
                        </View>
                        <PixelText size={13} style={{ flex: 1 }}>{ex?.name}</PixelText>
                        <Pressable onPress={() => removeItem(i)} style={{ marginLeft: 8 }}>
                          <PixelText size={12} color={colors.danger}>✕</PixelText>
                        </Pressable>
                      </View>
                      <View style={styles.itemFields}>
                        <ExerciseTargetFields exerciseId={it.exerciseId} />
                        <ItemField
                          label="セット"
                          value={it.targetSets}
                          onChange={(v) => updateItem(i, { targetSets: Math.max(1, v) })}
                        />
                      </View>
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
              <PixelButton label="やめる" fill={colors.win} textColor={colors.ink} onPress={resetForm} />
            </View>
          </Win>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

function ItemField(
  { label, value, onChange }:
  { label: string; value: number; onChange: (v: number) => void }
) {
  return (
    <View style={styles.itemField}>
      <PixelText size={9} color={colors.inkDim}>{label}</PixelText>
      <TextInput
        value={value ? String(value) : ''}
        onChangeText={(t) => onChange(parseFloat(t) || 0)}
        keyboardType="decimal-pad" placeholder="0" placeholderTextColor={colors.inkDim}
        style={styles.itemFieldInput}
      />
    </View>
  );
}

// 種目共通のkg・回数。同じ種目を使う他のメニューにもここでの変更が反映される。
function ExerciseTargetFields({ exerciseId }: { exerciseId: string }) {
  const target = useStore((s) => s.exerciseTargets[exerciseId]);
  const setExerciseTarget = useStore((s) => s.setExerciseTarget);
  return (
    <>
      <ItemField
        label="kg"
        value={target?.weight ?? 0}
        onChange={(v) => setExerciseTarget(exerciseId, { weight: v })}
      />
      <ItemField
        label="回数"
        value={target?.reps ?? 10}
        onChange={(v) => setExerciseTarget(exerciseId, { reps: v })}
      />
    </>
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
    borderWidth: 2, borderColor: colors.outline, borderRadius: 3, paddingHorizontal: 8, paddingVertical: 6, gap: 6,
  },
  itemHead: { flexDirection: 'row', alignItems: 'center' },
  itemFields: { flexDirection: 'row', gap: 8 },
  itemField: { alignItems: 'center' },
  itemFieldInput: {
    fontFamily: 'DotGothic16_400Regular', fontSize: 13, color: colors.ink, textAlign: 'center',
    backgroundColor: colors.bg, borderWidth: 2, borderColor: colors.frame,
    borderRadius: 2, paddingVertical: 3, width: 52,
  },
  chip: { borderWidth: 2, borderColor: colors.outline, borderRadius: 2, paddingHorizontal: 10, paddingVertical: 5 },
  pickRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    borderWidth: 2, borderColor: colors.frame, borderRadius: 3, paddingHorizontal: 9, paddingVertical: 7,
  },
});
