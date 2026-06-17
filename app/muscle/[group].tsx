import { useState } from 'react';
import { View, ScrollView, Pressable, TextInput, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useStore } from '../../src/store/useStore';
import { colors, muscleColor } from '../../src/theme';
import type { MuscleGroup } from '../../src/theme';
import { Win, PixelText, PixelButton, MuscleTag } from '../../src/components/Frame';

export default function MuscleScreen() {
  const params = useLocalSearchParams<{ group: string }>();
  const group = decodeURIComponent(params.group ?? '') as MuscleGroup;
  const router = useRouter();

  const exercises = useStore((s) => s.exercises).filter((e) => e.muscle === group);
  const currentId = useStore((s) => s.currentSessionId);
  const startForMuscle = useStore((s) => s.startSessionForMuscle);
  const addExerciseToSession = useStore((s) => s.addExerciseToSession);
  const addExercise = useStore((s) => s.addExercise);

  const [newName, setNewName] = useState('');

  const ensureSession = () => currentId ?? startForMuscle(group);

  const pickExercise = (exerciseId: string) => {
    const sid = ensureSession();
    addExerciseToSession(sid, exerciseId);
    router.push('/workout');
  };

  const addCustom = () => {
    if (!newName.trim()) return;
    addExercise(newName, group, '');
    setNewName('');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <Stack.Screen options={{ title: `${group} の種目` }} />
      <ScrollView contentContainerStyle={styles.scroll}>

        <View style={[styles.banner, { borderColor: muscleColor[group] }]}>
          <MuscleTag group={group} />
          <PixelText size={12} color={colors.inkDim} style={{ marginTop: 6 }}>
            種目をタップすると、その種目でワークアウトを始めます。
          </PixelText>
        </View>

        {exercises.map((e) => (
          <Pressable
            key={e.id}
            onPress={() => pickExercise(e.id)}
            style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
          >
            <Win style={styles.row}>
              <View style={[styles.bar, { backgroundColor: muscleColor[group] }]} />
              <View style={{ flex: 1 }}>
                <PixelText size={14}>{e.name}</PixelText>
                {!!e.instructions && (
                  <PixelText size={10} color={colors.inkDim} style={{ marginTop: 3 }}>
                    {e.instructions}
                  </PixelText>
                )}
              </View>
              <PixelText size={16} color={colors.frameHi}>＋</PixelText>
            </Win>
          </Pressable>
        ))}

        <Win style={{ marginTop: 10 }}>
          <PixelText size={11} color={colors.inkDim} style={{ marginBottom: 6 }}>─ 種目を追加 ─</PixelText>
          <TextInput
            value={newName}
            onChangeText={setNewName}
            placeholder="例: インクラインカール"
            placeholderTextColor={colors.inkDim}
            style={styles.input}
          />
          <View style={{ marginTop: 8 }}>
            <PixelButton label="この部位に追加" onPress={addCustom} disabled={!newName.trim()} />
          </View>
        </Win>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: 16, gap: 10 },
  banner: { borderLeftWidth: 4, paddingLeft: 10, paddingVertical: 4, marginBottom: 4 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  bar: { width: 8, height: 34, borderWidth: 2, borderColor: colors.outline },
  input: {
    fontFamily: 'DotGothic16_400Regular', fontSize: 14, color: colors.ink,
    backgroundColor: colors.bg, borderWidth: 2, borderColor: colors.frame,
    borderRadius: 3, paddingHorizontal: 8, paddingVertical: 6,
  },
});
