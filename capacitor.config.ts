import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.gofit.app',
  appName: 'GoFit',
  webDir: 'dist',
  plugins: {
    // Matches the app's default dark theme so status/nav bar icons render
    // light (visible on our dark header) from the moment the app launches,
    // before src/services/theme.ts has a chance to sync it to the user's
    // actual saved theme.
    SystemBars: {
      style: 'DARK'
    }
  }
};

export default config;
