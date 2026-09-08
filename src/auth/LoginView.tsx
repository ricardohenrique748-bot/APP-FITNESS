import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { getOAuthRedirectUrl } from '../services/nativeAuth';

type Mode = 'signin' | 'signup';

export const LoginView: React.FC = () => {
  const [mode, setMode] = useState<Mode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [signupMessage, setSignupMessage] = useState<string | null>(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const isValid = email.trim().length > 3 && password.length >= 6;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || isLoading) return;
    setIsLoading(true);
    setError(null);
    setSignupMessage(null);

    if (mode === 'signin') {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) {
        setError(traduzErro(signInError.message));
      }
      // On success, App.tsx's onAuthStateChange listener takes over.
    } else {
      const { data, error: signUpError } = await supabase.auth.signUp({ email, password });
      if (signUpError) {
        setError(traduzErro(signUpError.message));
      } else if (!data.session) {
        setSignupMessage('Conta criada! Verifique seu e-mail para confirmar o cadastro antes de entrar.');
      }
    }

    setIsLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setError(null);
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: getOAuthRedirectUrl() }
    });
    if (oauthError) {
      setError(traduzErro(oauthError.message));
      setIsGoogleLoading(false);
    }
    // On success the browser redirects to Google, so no further local state change here.
  };

  return (
    <div className="min-h-screen w-full bg-[#0c0e12] text-[#e2e2e8] flex flex-col items-center justify-center selection:bg-[#c5f400] selection:text-[#161e00]">
      <div className="w-full max-w-md min-h-screen flex flex-col justify-center relative bg-[#0c0e12] border-x border-[#282a2e]/40 shadow-2xl px-6 py-10">
        <div className="flex flex-col items-center gap-3 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-[#c5f400] flex items-center justify-center shadow-[0_0_24px_rgba(197,244,0,0.35)]">
            <span
              className="material-symbols-outlined text-[28px] text-[#161e00]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              bolt
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#c5f400]">GOFIT</span>
            <h1 className="text-[24px] font-extrabold text-white tracking-tight leading-tight">
              {mode === 'signin' ? 'Entrar na sua conta' : 'Criar sua conta'}
            </h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-bold text-[#c2c6d2] uppercase tracking-wider">E-mail</label>
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="voce@exemplo.com"
              className="h-12 rounded-xl bg-[#1e2024] border border-[#282a2e] px-4 text-[14px] text-white placeholder:text-[#5a5d63] focus:outline-none focus:border-[#c5f400] transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-bold text-[#c2c6d2] uppercase tracking-wider">Senha</label>
            <input
              type="password"
              autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              className="h-12 rounded-xl bg-[#1e2024] border border-[#282a2e] px-4 text-[14px] text-white placeholder:text-[#5a5d63] focus:outline-none focus:border-[#c5f400] transition-colors"
            />
          </div>

          {error && (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-[#93000a]/20 border border-[#93000a]/50 text-[#ffdad6] text-[12px] leading-relaxed">
              <span className="material-symbols-outlined text-[18px] shrink-0">error</span>
              <span>{error}</span>
            </div>
          )}

          {signupMessage && (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-[#c5f400]/10 border border-[#c5f400]/40 text-[#c5f400] text-[12px] leading-relaxed">
              <span className="material-symbols-outlined text-[18px] shrink-0">mail</span>
              <span>{signupMessage}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={!isValid || isLoading}
            className="w-full h-14 rounded-full bg-[#c5f400] text-[#161e00] font-extrabold text-[15px] flex items-center justify-center gap-2 active:scale-95 transition-all shadow-[0_0_24px_rgba(197,244,0,0.35)] disabled:opacity-40 disabled:active:scale-100 mt-2"
          >
            {isLoading ? (
              <span className="w-5 h-5 rounded-full border-2 border-[#161e00]/30 border-t-[#161e00] animate-spin" />
            ) : (
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                {mode === 'signin' ? 'login' : 'person_add'}
              </span>
            )}
            {mode === 'signin' ? 'Entrar' : 'Criar conta'}
          </button>
        </form>

        <div className="flex items-center gap-3 my-5">
          <div className="h-px flex-1 bg-[#282a2e]" />
          <span className="text-[11px] text-[#8e9379] uppercase tracking-wider font-semibold">ou</span>
          <div className="h-px flex-1 bg-[#282a2e]" />
        </div>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isGoogleLoading}
          className="w-full h-12 rounded-full bg-[#1e2024] border border-[#282a2e] hover:border-[#333539] hover:bg-[#282a2e] text-white font-bold text-[14px] flex items-center justify-center gap-2.5 active:scale-95 transition-all disabled:opacity-40 disabled:active:scale-100"
        >
          {isGoogleLoading ? (
            <span className="w-5 h-5 rounded-full border-2 border-white/20 border-t-white animate-spin" />
          ) : (
            <GoogleIcon />
          )}
          Continuar com Google
        </button>

        <button
          type="button"
          onClick={() => {
            setMode((prev) => (prev === 'signin' ? 'signup' : 'signin'));
            setError(null);
            setSignupMessage(null);
          }}
          className="text-[13px] text-[#c2c6d2] hover:text-white text-center mt-6 transition-colors"
        >
          {mode === 'signin' ? (
            <>
              Não tem conta? <span className="text-[#c5f400] font-bold">Criar agora</span>
            </>
          ) : (
            <>
              Já tem conta? <span className="text-[#c5f400] font-bold">Entrar</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.9c1.7-1.57 2.7-3.87 2.7-6.62z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.84.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.96v2.33A9 9 0 0 0 9 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.95 10.7A5.4 5.4 0 0 1 3.67 9c0-.59.1-1.17.28-1.7V4.97H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.03l2.99-2.33z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.32 0 2.51.46 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.97l2.99 2.33C4.66 5.17 6.65 3.58 9 3.58z"
      />
    </svg>
  );
}

function traduzErro(message: string): string {
  if (message.toLowerCase().includes('invalid login credentials')) {
    return 'E-mail ou senha incorretos.';
  }
  if (message.toLowerCase().includes('user already registered')) {
    return 'Já existe uma conta com esse e-mail. Tente entrar.';
  }
  if (message.toLowerCase().includes('password should be at least')) {
    return 'A senha precisa ter pelo menos 6 caracteres.';
  }
  if (message.toLowerCase().includes('provider is not enabled') || message.toLowerCase().includes('unsupported provider')) {
    return 'Login com Google ainda não foi habilitado no Supabase deste projeto.';
  }
  return message;
}
