'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAppState } from '@/state/useAppState';
import { demoUsers, planColors, roleDisplayNames, planToLevel, type UserProfile } from '@/lib/users';

type AuthMode = 'signin' | 'signup';
type AuthMethod = 'demo' | 'email' | 'google' | 'microsoft' | 'github';
type OAuthStep = 'select' | 'enter_email' | 'verify_code' | 'complete';

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('returnUrl') || '/dashboard';
  const providerParam = searchParams.get('provider') as 'google' | 'microsoft' | null;
  const modeParam = searchParams.get('mode');
  const { setCurrentUser } = useAppState();

  const [mode, setMode] = useState<AuthMode>((modeParam === 'register' ? 'signup' : 'signin'));
  const [authMethod, setAuthMethod] = useState<AuthMethod | null>(providerParam);
  const [oauthStep, setOauthStep] = useState<OAuthStep>(providerParam ? 'enter_email' : 'select');
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [oauthEmail, setOauthEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [error, setError] = useState('');
  const [codeSentTime, setCodeSentTime] = useState<number | null>(null);

  // Set initial state based on URL params
  useEffect(() => {
    if (providerParam) {
      setAuthMethod(providerParam);
      setOauthStep('enter_email');
    }
  }, [providerParam]);

  const handleDemoSignIn = () => {
    if (!selectedUser) return;
    setIsLoading(true);
    setTimeout(() => {
      setCurrentUser(selectedUser);
      router.push(returnUrl);
    }, 500);
  };

  const handleEmailAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (mode === 'signup' && !name) {
      setError('Please enter your name');
      return;
    }

    setIsLoading(true);

    // Simulate authentication - create a user profile
    setTimeout(() => {
      const newUser: UserProfile = {
        id: `user-${Date.now()}`,
        name: name || email.split('@')[0],
        email: email,
        role: 'User',
        plan: 'Free',
        level: 1,
        avatar: (name || email)[0].toUpperCase(),
        lastActive: new Date().toISOString(),
        registeredAt: new Date().toISOString(),
        authProvider: 'email',
      };
      setCurrentUser(newUser);
      router.push(returnUrl);
    }, 1000);
  };

  const handleSSOAuth = (provider: 'google' | 'microsoft' | 'github') => {
    setAuthMethod(provider);
    setOauthStep('enter_email');
    setError('');
  };

  // Generate a 6-digit verification code
  const generateVerificationCode = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  // Send verification code to email
  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault();

    if (!oauthEmail) {
      setError('Please enter your email address');
      return;
    }

    const emailDomain = oauthEmail.split('@')[1]?.toLowerCase();

    if (!emailDomain || !oauthEmail.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    // Validate email format based on provider
    const validDomains: Record<string, string[]> = {
      google: ['gmail.com', 'googlemail.com'],
      microsoft: ['outlook.com', 'hotmail.com', 'live.com', 'msn.com'],
      github: [], // Any email for GitHub
    };

    const providerKey = authMethod as string;
    const domainList = validDomains[providerKey] || [];

    // For Google/Microsoft, validate domain (allow any for demo purposes with warning)
    const isValidDomain = providerKey === 'github' || domainList.length === 0 ||
      domainList.some(d => emailDomain === d);

    if (!isValidDomain && providerKey !== 'github') {
      // Show warning but still proceed for demo
      console.log(`Note: ${oauthEmail} is not a typical ${authMethod} email, but proceeding for demo`);
    }

    // Generate and store verification code
    const code = generateVerificationCode();
    setGeneratedCode(code);
    setCodeSentTime(Date.now());
    setVerificationCode('');
    setError('');

    // In a real app, this would send an email via an API
    // For demo, we'll show the code in the console and a subtle hint
    console.log(`[DEMO] Verification code for ${oauthEmail}: ${code}`);

    // Move to verify_code step
    setOauthStep('verify_code');
  };

  // Resend verification code
  const handleResendCode = () => {
    const code = generateVerificationCode();
    setGeneratedCode(code);
    setCodeSentTime(Date.now());
    setVerificationCode('');
    setError('');
    console.log(`[DEMO] New verification code for ${oauthEmail}: ${code}`);
  };

  const handleOAuthVerify = (e: React.FormEvent) => {
    e.preventDefault();

    if (!verificationCode) {
      setError('Please enter the verification code');
      return;
    }

    // Check if code has expired (5 minutes)
    if (codeSentTime && Date.now() - codeSentTime > 5 * 60 * 1000) {
      setError('Verification code has expired. Please request a new one.');
      return;
    }

    // Validate the verification code
    if (verificationCode !== generatedCode) {
      setError('Invalid verification code. Please check and try again.');
      return;
    }

    setIsLoading(true);

    const provider = authMethod as 'google' | 'microsoft' | 'github';

    // Code verified - create user and sign in
    setTimeout(() => {
      const providerAvatars: Record<string, string> = {
        google: 'G',
        microsoft: 'M',
        github: 'GH',
      };

      const newUser: UserProfile = {
        id: `${provider}-${Date.now()}`,
        name: oauthEmail.split('@')[0] || 'User',
        email: oauthEmail,
        role: 'User',
        plan: 'Free',
        level: 1,
        avatar: providerAvatars[provider] || oauthEmail[0].toUpperCase(),
        lastActive: new Date().toISOString(),
        registeredAt: new Date().toISOString(),
        authProvider: provider,
      };
      setCurrentUser(newUser);
      setOauthStep('complete');
      router.push(returnUrl);
    }, 1000);
  };

  const cancelOAuth = () => {
    setAuthMethod(null);
    setOauthStep('select');
    setOauthEmail('');
    setVerificationCode('');
    setGeneratedCode('');
    setCodeSentTime(null);
    setError('');
    // Clear URL params
    router.replace('/signin');
  };

  // Go back from verify_code to enter_email
  const goBackToEmail = () => {
    setOauthStep('enter_email');
    setVerificationCode('');
    setError('');
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col">
      {/* Header */}
      <header className="p-6">
        <Link href="/" className="flex items-center gap-3 w-fit">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 via-purple-500 to-magenta-400 flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </div>
          <span className="text-xl font-bold text-[var(--text-primary)]">Lumina S</span>
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* OAuth Step 1: Enter Email */}
          {oauthStep === 'enter_email' && (authMethod === 'google' || authMethod === 'microsoft' || authMethod === 'github') ? (
            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-teal-400 via-purple-500 to-pink-400 flex items-center justify-center">
                  {authMethod === 'google' ? (
                    <svg className="w-8 h-8" viewBox="0 0 24 24">
                      <path fill="#fff" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#fff" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#fff" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#fff" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                  ) : authMethod === 'microsoft' ? (
                    <svg className="w-8 h-8" viewBox="0 0 24 24">
                      <path fill="#fff" d="M1 1h10v10H1z"/>
                      <path fill="#fff" d="M1 13h10v10H1z"/>
                      <path fill="#fff" d="M13 1h10v10H13z"/>
                      <path fill="#fff" d="M13 13h10v10H13z"/>
                    </svg>
                  ) : (
                    <svg className="w-8 h-8" fill="#fff" viewBox="0 0 24 24">
                      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z"/>
                    </svg>
                  )}
                </div>
                <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
                  {mode === 'signin' ? 'Sign In' : 'Register'} with {authMethod === 'google' ? 'Gmail' : authMethod === 'microsoft' ? 'Outlook' : 'GitHub'}
                </h1>
                <p className="text-[var(--text-muted)] text-sm">
                  Enter your email to receive a verification code
                </p>
              </div>

              <form onSubmit={handleSendCode} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={oauthEmail}
                    onChange={(e) => setOauthEmail(e.target.value)}
                    placeholder={authMethod === 'google' ? 'you@gmail.com' : authMethod === 'microsoft' ? 'you@outlook.com' : 'you@example.com'}
                    className="w-full px-4 py-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-teal-500 transition-colors"
                    autoFocus
                  />
                </div>

                {error && (
                  <p className="text-red-400 text-sm">{error}</p>
                )}

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl font-medium transition-all bg-teal-500 hover:bg-teal-400 text-white flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>Send Verification Code</span>
                </button>

                <button
                  type="button"
                  onClick={cancelOAuth}
                  className="w-full py-2.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] text-sm transition-colors"
                >
                  Cancel and go back
                </button>
              </form>
            </div>
          ) : oauthStep === 'verify_code' && (authMethod === 'google' || authMethod === 'microsoft' || authMethod === 'github') ? (
            /* OAuth Step 2: Enter Verification Code */
            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-green-400 via-teal-500 to-blue-500 flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
                  Verify Your Email
                </h1>
                <p className="text-[var(--text-muted)] text-sm">
                  We sent a 6-digit code to <span className="text-teal-400 font-medium">{oauthEmail}</span>
                </p>
                <p className="text-[var(--text-muted)] text-xs mt-2">
                  Check your inbox (and spam folder) for the verification code
                </p>
              </div>

              {/* Demo hint - In production this would be removed */}
              <div className="mb-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
                <p className="text-amber-400 text-xs text-center">
                  <strong>Demo Mode:</strong> Check browser console (F12) for the verification code
                </p>
              </div>

              <form onSubmit={handleOAuthVerify} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                    6-Digit Verification Code
                  </label>
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="Enter 6-digit code"
                    className="w-full px-4 py-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-teal-500 transition-colors text-center text-2xl font-mono tracking-[0.5em]"
                    maxLength={6}
                    autoFocus
                  />
                </div>

                {error && (
                  <p className="text-red-400 text-sm text-center">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={isLoading || verificationCode.length !== 6}
                  className={`w-full py-3.5 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                    isLoading
                      ? 'bg-teal-600 text-white'
                      : verificationCode.length === 6
                        ? 'bg-teal-500 hover:bg-teal-400 text-white'
                        : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Verify & {mode === 'signin' ? 'Sign In' : 'Create Account'}</span>
                    </>
                  )}
                </button>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={goBackToEmail}
                    className="text-[var(--text-muted)] hover:text-[var(--text-primary)] text-sm transition-colors flex items-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Change email
                  </button>
                  <button
                    type="button"
                    onClick={handleResendCode}
                    className="text-teal-500 hover:text-teal-400 text-sm transition-colors"
                  >
                    Resend code
                  </button>
                </div>

                <button
                  type="button"
                  onClick={cancelOAuth}
                  className="w-full py-2.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] text-sm transition-colors"
                >
                  Cancel and go back
                </button>
              </form>
            </div>
          ) : (
            <>
              {/* Mode Toggle */}
              <div className="flex mb-6 bg-[var(--bg-card)] rounded-xl p-1 border border-[var(--border-color)]">
                <button
                  onClick={() => { setMode('signin'); setAuthMethod(null); setError(''); }}
                  className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
                    mode === 'signin'
                      ? 'bg-teal-500 text-white'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => { setMode('signup'); setAuthMethod(null); setError(''); }}
                  className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
                    mode === 'signup'
                      ? 'bg-teal-500 text-white'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  Sign Up
                </button>
              </div>

              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
                  {mode === 'signin' ? 'Welcome Back' : 'Create Your Account'}
                </h1>
                <p className="text-[var(--text-muted)] text-sm">
                  {mode === 'signin'
                    ? 'Sign in to access your strategic workspace'
                    : 'Start your strategic intelligence journey'}
                </p>
              </div>

          {/* SSO Buttons */}
          <div className="space-y-3 mb-6">
            <button
              onClick={() => handleSSOAuth('google')}
              disabled={isLoading}
              className={`w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border transition-all ${
                isLoading && authMethod === 'google'
                  ? 'bg-[var(--bg-card-hover)] border-teal-500/50'
                  : 'border-[var(--border-color)] bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] hover:border-[var(--border-hover)]'
              } text-[var(--text-secondary)]`}
            >
              {isLoading && authMethod === 'google' ? (
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              )}
              <span className="font-medium">
                {isLoading && authMethod === 'google' ? 'Connecting...' : `Continue with Google`}
              </span>
            </button>

            <button
              onClick={() => handleSSOAuth('microsoft')}
              disabled={isLoading}
              className={`w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border transition-all ${
                isLoading && authMethod === 'microsoft'
                  ? 'bg-[var(--bg-card-hover)] border-teal-500/50'
                  : 'border-[var(--border-color)] bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] hover:border-[var(--border-hover)]'
              } text-[var(--text-secondary)]`}
            >
              {isLoading && authMethod === 'microsoft' ? (
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#F25022" d="M1 1h10v10H1z"/>
                  <path fill="#00A4EF" d="M1 13h10v10H1z"/>
                  <path fill="#7FBA00" d="M13 1h10v10H13z"/>
                  <path fill="#FFB900" d="M13 13h10v10H13z"/>
                </svg>
              )}
              <span className="font-medium">
                {isLoading && authMethod === 'microsoft' ? 'Connecting...' : `Continue with Microsoft`}
              </span>
            </button>

            <button
              onClick={() => handleSSOAuth('github')}
              disabled={isLoading}
              className={`w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border transition-all ${
                isLoading && authMethod === 'github'
                  ? 'bg-[var(--bg-card-hover)] border-teal-500/50'
                  : 'border-[var(--border-color)] bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] hover:border-[var(--border-hover)]'
              } text-[var(--text-secondary)]`}
            >
              {isLoading && authMethod === 'github' ? (
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z"/>
                </svg>
              )}
              <span className="font-medium">
                {isLoading && authMethod === 'github' ? 'Connecting...' : `Continue with GitHub`}
              </span>
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-[var(--border-color)]" />
            <span className="text-xs text-[var(--text-muted)]">or continue with email</span>
            <div className="flex-1 h-px bg-[var(--border-color)]" />
          </div>

          {/* Email Form */}
          <form onSubmit={handleEmailAuth} className="space-y-4 mb-6">
            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-teal-500 transition-colors"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-teal-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-teal-500 transition-colors"
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}

            <button
              type="submit"
              disabled={isLoading && authMethod === 'email'}
              className={`w-full py-3.5 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                isLoading && authMethod === 'email'
                  ? 'bg-teal-600 text-white'
                  : 'bg-teal-500 hover:bg-teal-400 text-white'
              }`}
              onClick={() => setAuthMethod('email')}
            >
              {isLoading && authMethod === 'email' ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>{mode === 'signin' ? 'Signing in...' : 'Creating account...'}</span>
                </>
              ) : (
                <span>{mode === 'signin' ? 'Sign In with Email' : 'Create Account'}</span>
              )}
            </button>
          </form>

          {/* Demo Account Section */}
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-4">
            <button
              onClick={() => setAuthMethod(authMethod === 'demo' ? null : 'demo')}
              className="w-full flex items-center justify-between text-left"
            >
              <div>
                <h3 className="text-sm font-medium text-[var(--text-primary)]">Demo Accounts</h3>
                <p className="text-xs text-[var(--text-muted)]">Try different plan levels</p>
              </div>
              <svg
                className={`w-5 h-5 text-[var(--text-muted)] transition-transform ${authMethod === 'demo' ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {authMethod === 'demo' && (
              <div className="mt-4 space-y-2">
                {demoUsers.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => setSelectedUser(user)}
                    className={`w-full text-left p-3 rounded-xl border transition-all ${
                      selectedUser?.id === user.id
                        ? 'bg-teal-500/10 border-teal-500/50 ring-1 ring-teal-500/30'
                        : 'bg-[var(--bg-secondary)] border-[var(--border-color)] hover:border-[var(--border-hover)]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center text-white font-semibold text-sm ${
                          selectedUser?.id === user.id ? 'bg-teal-500' : 'bg-[var(--bg-card-hover)]'
                        }`}
                      >
                        {user.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm text-[var(--text-primary)]">{user.name}</span>
                          <span className={`px-1.5 py-0.5 text-xs font-medium rounded ${planColors[user.plan].bg} ${planColors[user.plan].text} ${planColors[user.plan].border} border`}>
                            {user.plan}
                          </span>
                        </div>
                        <span className="text-xs text-[var(--text-muted)]">{roleDisplayNames[user.role]}</span>
                      </div>
                      {selectedUser?.id === user.id && (
                        <svg className="w-4 h-4 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </button>
                ))}

                <button
                  onClick={handleDemoSignIn}
                  disabled={!selectedUser || isLoading}
                  className={`w-full mt-3 py-3 rounded-xl font-medium transition-all ${
                    selectedUser && !isLoading
                      ? 'bg-purple-500 hover:bg-purple-400 text-white'
                      : 'bg-[var(--bg-card-hover)] text-[var(--text-muted)] cursor-not-allowed'
                  }`}
                >
                  {isLoading ? 'Signing in...' : 'Continue with Demo Account'}
                </button>
              </div>
            )}
          </div>

          {/* Footer Links */}
          <div className="mt-6 text-center text-sm">
            <Link href="/pricing" className="text-teal-500 hover:text-teal-400 font-medium">
              View Plans & Pricing
            </Link>
          </div>
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center">
        <p className="text-xs text-[var(--text-muted)]">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </footer>
    </div>
  );
}
