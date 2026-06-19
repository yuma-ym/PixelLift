// レストタイマー用のローカル通知ラッパー。
// アプリを閉じていても/別画面でも、予約した時刻にOSがバナー＋音/バイブを出す。
// Web や権限が無い環境では安全に無視する。

import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

let configured = false;

export async function setupNotifications(): Promise<void> {
  if (Platform.OS === 'web') return;
  try {
    if (!configured) {
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowBanner: true,
          shouldShowList: true,
          shouldPlaySound: true,
          shouldSetBadge: false,
        }),
      });
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('rest', {
          name: 'レストタイマー',
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 300, 150, 300],
          sound: 'default',
        });
      }
      configured = true;
    }
    const current = await Notifications.getPermissionsAsync();
    if (current.status !== 'granted') {
      await Notifications.requestPermissionsAsync();
    }
  } catch {
    // Expo Go の制限などで失敗しても致命的でないため握りつぶす
  }
}

// 残り seconds 秒後に「休憩おわり」通知を予約（既存の予約は消す）
export async function scheduleRestDone(seconds: number): Promise<void> {
  if (Platform.OS === 'web' || seconds <= 0) return;
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '💪 休憩おわり！',
        body: '次のセットへ。さあ続きを。',
        sound: 'default',
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: Math.max(1, Math.round(seconds)),
        channelId: 'rest',
      },
    });
  } catch {
    // noop
  }
}

export async function cancelRestDone(): Promise<void> {
  if (Platform.OS === 'web') return;
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch {
    // noop
  }
}
