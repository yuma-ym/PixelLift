import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Exercise, Routine, WorkoutSession, SetRecord, MuscleGroup } from '../types';
import { seedExercises } from '../data/seed';

const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

interface State {
  exercises: Exercise[];
  routines: Routine[];
  sessions: WorkoutSession[];
  currentSessionId: string | null;
  seeded: boolean;

  // セットアップ
  seedIfNeeded: () => void;

  // 種目
  addExercise: (name: string, muscle: MuscleGroup, instructions: string) => void;
  exercisesByMuscle: (muscle: MuscleGroup) => Exercise[];
  getExercise: (id: string) => Exercise | undefined;

  // ルーティン
  addRoutine: (name: string, items: Routine['items']) => void;
  deleteRoutine: (id: string) => void;

  // ワークアウト
  startEmptySession: () => string;
  startSessionFromRoutine: (routineId: string) => string;
  startSessionForMuscle: (muscle: MuscleGroup) => string;
  getCurrentSession: () => WorkoutSession | undefined;
  addExerciseToSession: (sessionId: string, exerciseId: string) => void;
  addSet: (sessionId: string, exerciseId: string) => void;
  updateSet: (sessionId: string, setId: string, patch: Partial<SetRecord>) => void;
  deleteSet: (sessionId: string, setId: string) => void;
  removeExerciseFromSession: (sessionId: string, exerciseId: string) => void;
  finishSession: (sessionId: string) => void;
  discardSession: (sessionId: string) => void;
}

export const useStore = create<State>()(
  persist(
    (set, get) => ({
      exercises: [],
      routines: [],
      sessions: [],
      currentSessionId: null,
      seeded: false,

      seedIfNeeded: () => {
        if (get().seeded || get().exercises.length > 0) return;
        set({ exercises: seedExercises, seeded: true });
      },

      addExercise: (name, muscle, instructions) =>
        set((s) => ({
          exercises: [
            ...s.exercises,
            { id: uid(), name: name.trim(), muscle, instructions, isCustom: true },
          ],
        })),

      exercisesByMuscle: (muscle) => get().exercises.filter((e) => e.muscle === muscle),

      getExercise: (id) => get().exercises.find((e) => e.id === id),

      addRoutine: (name, items) =>
        set((s) => ({ routines: [...s.routines, { id: uid(), name: name.trim(), items }] })),

      deleteRoutine: (id) =>
        set((s) => ({ routines: s.routines.filter((r) => r.id !== id) })),

      startEmptySession: () => {
        const id = uid();
        const session: WorkoutSession = {
          id, name: 'ワークアウト', startedAt: Date.now(), endedAt: null, sets: [],
        };
        set((s) => ({ sessions: [session, ...s.sessions], currentSessionId: id }));
        return id;
      },

      startSessionForMuscle: (muscle) => {
        const id = uid();
        const session: WorkoutSession = {
          id, name: `${muscle}の日`, startedAt: Date.now(), endedAt: null, sets: [],
        };
        set((s) => ({ sessions: [session, ...s.sessions], currentSessionId: id }));
        return id;
      },

      startSessionFromRoutine: (routineId) => {
        const routine = get().routines.find((r) => r.id === routineId);
        const id = uid();
        const sets: SetRecord[] = [];
        routine?.items.forEach((item) => {
          for (let i = 1; i <= Math.max(1, item.targetSets); i++) {
            sets.push({
              id: uid(), exerciseId: item.exerciseId, setIndex: i,
              weight: 0, reps: item.targetReps, completed: false,
            });
          }
        });
        const session: WorkoutSession = {
          id, name: routine?.name ?? 'ワークアウト', startedAt: Date.now(), endedAt: null, sets,
        };
        set((s) => ({ sessions: [session, ...s.sessions], currentSessionId: id }));
        return id;
      },

      getCurrentSession: () =>
        get().sessions.find((s) => s.id === get().currentSessionId),

      addExerciseToSession: (sessionId, exerciseId) =>
        set((s) => ({
          sessions: s.sessions.map((sess) =>
            sess.id !== sessionId ? sess : {
              ...sess,
              sets: [
                ...sess.sets,
                { id: uid(), exerciseId, setIndex: 1, weight: 0, reps: 10, completed: false },
              ],
            }
          ),
        })),

      addSet: (sessionId, exerciseId) =>
        set((s) => ({
          sessions: s.sessions.map((sess) => {
            if (sess.id !== sessionId) return sess;
            const same = sess.sets.filter((x) => x.exerciseId === exerciseId);
            const last = same[same.length - 1];
            return {
              ...sess,
              sets: [
                ...sess.sets,
                {
                  id: uid(), exerciseId,
                  setIndex: (last?.setIndex ?? 0) + 1,
                  weight: last?.weight ?? 0,
                  reps: last?.reps ?? 10,
                  completed: false,
                },
              ],
            };
          }),
        })),

      updateSet: (sessionId, setId, patch) =>
        set((s) => ({
          sessions: s.sessions.map((sess) =>
            sess.id !== sessionId ? sess : {
              ...sess,
              sets: sess.sets.map((x) => (x.id === setId ? { ...x, ...patch } : x)),
            }
          ),
        })),

      deleteSet: (sessionId, setId) =>
        set((s) => ({
          sessions: s.sessions.map((sess) =>
            sess.id !== sessionId ? sess : { ...sess, sets: sess.sets.filter((x) => x.id !== setId) }
          ),
        })),

      removeExerciseFromSession: (sessionId, exerciseId) =>
        set((s) => ({
          sessions: s.sessions.map((sess) =>
            sess.id !== sessionId ? sess : { ...sess, sets: sess.sets.filter((x) => x.exerciseId !== exerciseId) }
          ),
        })),

      finishSession: (sessionId) =>
        set((s) => ({
          currentSessionId: null,
          sessions: s.sessions.map((sess) =>
            sess.id === sessionId ? { ...sess, endedAt: Date.now() } : sess
          ),
        })),

      discardSession: (sessionId) =>
        set((s) => ({
          currentSessionId: null,
          sessions: s.sessions.filter((sess) => sess.id !== sessionId),
        })),
    }),
    {
      name: 'pixel-lift-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({
        exercises: s.exercises,
        routines: s.routines,
        sessions: s.sessions,
        currentSessionId: s.currentSessionId,
        seeded: s.seeded,
      }),
    }
  )
);

// セッションの集計ヘルパー
export const sessionVolume = (s: WorkoutSession) =>
  s.sets.filter((x) => x.completed).reduce((t, x) => t + x.weight * x.reps, 0);

export const completedCount = (s: WorkoutSession) =>
  s.sets.filter((x) => x.completed).length;

export const formatVolume = (v: number) =>
  v >= 1000 ? `${(v / 1000).toFixed(1)}t` : `${Math.round(v)}kg`;
