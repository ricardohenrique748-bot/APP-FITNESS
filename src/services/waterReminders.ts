import { useEffect, useState } from 'react';
import { LocalNotifications } from '@capacitor/local-notifications';

export interface WaterReminderSettings {
  enabled: boolean;
  intervalHours: 1 | 2 | 3;
}

const STORAGE_KEY = 'gofit_water_reminder';
const DEFAULT_SETTINGS: WaterReminderSettings = { enabled: false, intervalHours: 2 };

// Reminders only fire inside this window so the user isn't woken up at 3am.
const WINDOW_START_HOUR = 7;
const WINDOW_END_HOUR = 22;

// Fixed id range so re-scheduling can always find and clear every previously
// scheduled reminder, regardless of which interval was used before.
const BASE_NOTIFICATION_ID = 5001;
const MAX_REMINDERS_PER_DAY = WINDOW_END_HOUR - WINDOW_START_HOUR + 1;

export const DRINK_ACTION_TYPE_ID = 'WATER_REMINDER';
export const DRINK_ACTION_ID = 'drink';

function readStoredSettings(): WaterReminderSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw);
    return {
      enabled: Boolean(parsed.enabled),
      intervalHours: [1, 2, 3].includes(parsed.intervalHours) ? parsed.intervalHours : DEFAULT_SETTINGS.intervalHours
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

function storeSettings(settings: WaterReminderSettings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // localStorage unavailable — setting just won't persist across sessions.
  }
}

async function cancelAllReminders() {
  const ids = Array.from({ length: MAX_REMINDERS_PER_DAY }, (_, i) => ({ id: BASE_NOTIFICATION_ID + i }));
  await LocalNotifications.cancel({ notifications: ids });
}

async function scheduleReminders(intervalHours: number) {
  await cancelAllReminders();

  await LocalNotifications.registerActionTypes({
    types: [
      {
        id: DRINK_ACTION_TYPE_ID,
        actions: [{ id: DRINK_ACTION_ID, title: 'Já bebi 💧' }]
      }
    ]
  });

  const hours: number[] = [];
  for (let h = WINDOW_START_HOUR; h <= WINDOW_END_HOUR; h += intervalHours) {
    hours.push(h);
  }

  await LocalNotifications.schedule({
    notifications: hours.map((hour, idx) => ({
      id: BASE_NOTIFICATION_ID + idx,
      title: 'Hora de beber água 💧',
      body: 'Toque em "Já bebi" para registrar 250ml direto no seu progresso de hidratação.',
      actionTypeId: DRINK_ACTION_TYPE_ID,
      schedule: {
        // Leaving day/month/weekday unset makes this cron-like `on` fire
        // every day at this hour:minute — no separate `every` needed.
        on: { hour, minute: 0 },
        allowWhileIdle: true
      }
    }))
  });
}

/** Applies (or tears down) the native schedule to match the given settings. */
async function syncNativeSchedule(settings: WaterReminderSettings) {
  if (!settings.enabled) {
    await cancelAllReminders().catch(() => {});
    return;
  }

  const permission = await LocalNotifications.checkPermissions();
  if (permission.display !== 'granted') {
    const requested = await LocalNotifications.requestPermissions();
    if (requested.display !== 'granted') {
      // Permission denied — don't leave the toggle silently on with nothing scheduled.
      return;
    }
  }

  await scheduleReminders(settings.intervalHours).catch(() => {});
}

export function useWaterReminderSettings(): [WaterReminderSettings, (settings: WaterReminderSettings) => void] {
  const [settings, setSettingsState] = useState<WaterReminderSettings>(() => readStoredSettings());

  useEffect(() => {
    storeSettings(settings);
    syncNativeSchedule(settings);
  }, [settings.enabled, settings.intervalHours]);

  return [settings, setSettingsState];
}

/**
 * Listens for the "Já bebi" notification action so the caller can credit the
 * water intake in-app. Returns a cleanup function.
 */
export function onWaterReminderDrink(callback: () => void): () => void {
  const listenerPromise = LocalNotifications.addListener('localNotificationActionPerformed', (action) => {
    if (action.actionId === DRINK_ACTION_ID) {
      callback();
    }
  });

  return () => {
    listenerPromise.then((handle) => handle.remove()).catch(() => {});
  };
}
