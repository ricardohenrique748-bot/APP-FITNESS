import { useEffect, useState } from 'react';
import { SystemBars, SystemBarsStyle } from '@capacitor/core';

export type ThemeMode = 'dark' | 'light';

const STORAGE_KEY = 'gofit_theme';

function readStoredTheme(): ThemeMode {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'light' ? 'light' : 'dark';
  } catch {
    return 'dark';
  }
}

function applyTheme(mode: ThemeMode) {
  document.documentElement.classList.toggle('light', mode === 'light');
  try {
    localStorage.setItem(STORAGE_KEY, mode);
  } catch {
    // localStorage unavailable — theme just won't persist across sessions.
  }

  // Capacitor's SystemBars defaults status/nav bar icon color to the
  // *device's* OS-wide light/dark setting, not our app's own theme — on a
  // device set to system Light mode this app (dark background) would get
  // dark status bar icons, making the clock/wifi/battery unreadable against
  // our dark header. Keep the icon color tied to our actual theme instead.
  SystemBars.setStyle({ style: mode === 'light' ? SystemBarsStyle.Light : SystemBarsStyle.Dark }).catch(() => {
    // No-op on web / unsupported platforms.
  });
}

export function useTheme(): [ThemeMode, (mode: ThemeMode) => void] {
  const [theme, setThemeState] = useState<ThemeMode>(() => readStoredTheme());

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  return [theme, setThemeState];
}
