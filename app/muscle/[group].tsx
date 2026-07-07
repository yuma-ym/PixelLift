import { View, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, Stack } from 'expo-router';
import { useStore, muscleRecency } from '../../src/store/useStore';
import { colors, muscleColor } from '../../src/theme';
import type { MuscleGroup } from '../../src/theme';
import { Win, PixelText, MuscleTag } from '../../src/components/Frame';
import Backdrop from '../../src/components/Backdrop';

const SUB_MUSCLES: Record<string, { name: string; desc: string }[]> = {
  '胸': [
    { name: '大胸筋（上部）', desc: 'インクラインプレス・インクラインフライ' },
    { name: '大胸筋（中部）', desc: 'ベンチプレス・ダンベルフライ' },
    { name: '大胸筋（下部）', desc: 'デクラインプレス・ディップス' },
  ],
  '背中': [
    { name: '広背筋', desc: 'ラットプルダウン・懸垂・ローイング' },
    { name: '僧帽筋', desc: 'シュラッグ・フェイスプル' },
    { name: '脊柱起立筋', desc: 'デッドリフト・バックエクステンション' },
  ],
  '肩': [
    { name: '三角筋（前部）', desc: 'フロントレイズ・ショルダープレス' },
    { name: '三角筋（中部）', desc: 'サイドレイズ・アップライトロウ' },
    { name: '三角筋（後部）', desc: 'リアレイズ・フェイスプル' },
  ],
  '腕': [
    { name: '上腕二頭筋', desc: 'バーベルカール・ダンベルカール' },
    { name: '上腕三頭筋', desc: 'トライセプスPD・スカルクラッシャー' },
    { name: '前腕', desc: 'リストカール・ハンマーカール' },
  ],
  '腹': [
    { name: '腹直筋', desc: 'クランチ・レッグレイズ・シットアップ' },
    { name: '腹斜筋', desc: 'サイドベント・ロシアンツイスト' },
  ],
  '脚': [
    { name: '大腿四頭筋', desc: 'スクワット・レッグプレス・レッグエクステンション' },
    { name: 'ハムストリングス', desc: 'レッグカール・RDL' },
    { name: '臀筋', desc: 'ヒップスラスト・ブルガリアンSQ' },
    { name: 'ふくらはぎ', desc: 'カーフレイズ' },
  ],
};

export default function MuscleScreen() {
  const params = useLocalSearchParams<{ group: string }>();
  const group = decodeURIComponent(params.group ?? '') as MuscleGroup;
  const sessions = useStore((s) => s.sessions);
  const exercises = useStore((s) => s.exercises);
  const heat = muscleRecency(sessions, exercises);
  const days = heat[group];
  const subs = SUB_MUSCLES[group] ?? [];

  const daysLabel =
    days == null || days >= 999 ? '未トレーニング' :
    days === 0 ? '今日トレーニング済み' :
    `${days}日前にトレーニング`;

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <Stack.Screen options={{ title: `${group}` }} />
      <Backdrop />
      <ScrollView contentContainerStyle={styles.scroll}>

        <View style={[styles.banner, { borderColor: muscleColor[group] }]}>
          <MuscleTag group={group} />
          <PixelText size={11} color={colors.inkDim} style={{ marginTop: 6 }}>
            {daysLabel}
          </PixelText>
        </View>

        <PixelText size={12} color={colors.frameHi} style={{ marginTop: 4, marginBottom: 2 }}>
          筋肉の構成
        </PixelText>

        {subs.map((sub) => (
          <Win key={sub.name} style={styles.row}>
            <View style={[styles.bar, { backgroundColor: muscleColor[group] }]} />
            <View style={{ flex: 1 }}>
              <PixelText size={14}>{sub.name}</PixelText>
              <PixelText size={10} color={colors.inkDim} style={{ marginTop: 3 }}>
                {sub.desc}
              </PixelText>
            </View>
          </Win>
        ))}

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
});
