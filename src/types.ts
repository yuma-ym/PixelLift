import type { MuscleGroup } from './theme';

export type { MuscleGroup };

export interface Exercise {
  id: string;
  name: string;
  muscle: MuscleGroup;
  instructions: string;
  isCustom: boolean;
}

export interface RoutineItem {
  exerciseId: string;
  targetSets: number;
}

// 種目ごとの目標重量・回数。同じ種目はどのメニューでも共通の値を使う。
export interface ExerciseTarget {
  weight: number;
  reps: number;
}

export interface Routine {
  id: string;
  name: string;
  items: RoutineItem[];
}

export interface SetRecord {
  id: string;
  exerciseId: string;
  setIndex: number;   // その種目で何セット目か (1始まり)
  weight: number;     // kg
  reps: number;
  completed: boolean;
}

export interface WorkoutSession {
  id: string;
  name: string;
  startedAt: number;  // epoch ms
  endedAt: number | null;
  sets: SetRecord[];
}
