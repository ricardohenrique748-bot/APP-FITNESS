import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';
import { supabase } from './supabaseClient';

// Must also be added as an Allowed Redirect URL in Supabase (Authentication -> URL Configuration)
// and registered as an intent-filter scheme in AndroidManifest.xml.
export const NATIVE_OAUTH_REDIRECT_URL = 'com.gofit.app://callback';

export function getOAuthRedirectUrl(): string {
  return Capacitor.isNativePlatform() ? NATIVE_OAUTH_REDIRECT_URL : window.location.origin;
}

function applySessionFromUrl(url: string) {
  const hashIndex = url.indexOf('#');
  if (hashIndex === -1) return;

  const params = new URLSearchParams(url.slice(hashIndex + 1));
  const access_token = params.get('access_token');
  const refresh_token = params.get('refresh_token');

  if (access_token && refresh_token) {
    supabase.auth.setSession({ access_token, refresh_token });
  }
}

// Call once at app startup. When the OAuth flow finishes in the system browser,
// Android reopens the app via the custom URL scheme carrying the session tokens.
export function setupNativeAuthListener() {
  if (!Capacitor.isNativePlatform()) return;

  App.addListener('appUrlOpen', ({ url }) => {
    if (url.startsWith(NATIVE_OAUTH_REDIRECT_URL)) {
      applySessionFromUrl(url);
    }
  });
}
