'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { GoogleIcon } from '@/components/GoogleIcon';
import {
  Lock,
  Mail,
  User,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  MapPin,
  ShieldCheck,
  Loader2
} from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/shop';

  const { login, register, loginWithGoogle, isAuthenticated, user } = useAuth();

  const [mode, setMode] = useState<'signin' | 'register'>('signin');
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Sign In state
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');

  // Register state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [showAddressFields, setShowAddressFields] = useState(false);
  const [regStreet, setRegStreet] = useState('');
  const [regCity, setRegCity] = useState('');
  const [regState, setRegState] = useState('');
  const [regPostal, setRegPostal] = useState('');

  // Status
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // If already authenticated, redirect
  if (isAuthenticated && user) {
    return (
      <div className="py-20 text-center max-w-md mx-auto px-6">
        <div className="w-16 h-16 rounded-full bg-olive/15 text-olive flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="font-headline-lg text-2xl font-bold text-on-surface mb-2">
          Welcome back, {user.name}
        </h2>
        <p className="text-xs sm:text-sm text-on-surface-variant mb-6">
          You are currently signed in with <span className="font-semibold text-primary">{user.email}</span>.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href={redirectPath}
            className="px-6 py-2.5 bg-primary hover:bg-primary-container text-white font-label-caps text-xs tracking-label-caps uppercase font-semibold rounded-lg shadow-subtle transition-colors"
          >
            Continue
          </Link>
          <Link
            href="/account"
            className="px-6 py-2.5 bg-surface-lowest border border-outline-variant/50 text-on-surface hover:bg-surface-high font-label-caps text-xs tracking-label-caps uppercase font-semibold rounded-lg transition-colors"
          >
            My Account
          </Link>
        </div>
      </div>
    );
  }

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const result = login(signInEmail, signInPassword);
    if (result.success) {
      setSuccessMsg('Signed in successfully.');
      router.push(redirectPath);
    } else {
      setErrorMsg(result.error || 'Failed to sign in.');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (regPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    const address = regStreet
      ? {
          street: regStreet,
          city: regCity,
          state: regState,
          postalCode: regPostal,
          country: 'United States',
        }
      : undefined;

    const result = register(regName, regEmail, regPassword, address);
    if (result.success) {
      setSuccessMsg('Account created successfully.');
      router.push(redirectPath);
    } else {
      setErrorMsg(result.error || 'Failed to register account.');
    }
  };

  const handleFillDemo = () => {
    setMode('signin');
    setSignInEmail('aria@esondha.com');
    setSignInPassword('password123');
    setErrorMsg(null);
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setErrorMsg(null);
    try {
      const result = await loginWithGoogle();
      if (result.success) {
        setSuccessMsg('Signed in with Google.');
        router.push(redirectPath);
      } else {
        setErrorMsg(result.error || 'Google sign-in failed.');
      }
    } catch {
      setErrorMsg('Failed to complete Google sign-in.');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Tab Switcher */}
      <div className="flex items-center bg-surface-low p-1 rounded-xl border border-outline-variant/30 mb-8">
        <button
          type="button"
          onClick={() => {
            setMode('signin');
            setErrorMsg(null);
          }}
          className={`btn-interactive flex-1 py-2.5 rounded-lg font-label-caps text-xs tracking-label-caps uppercase font-semibold transition-all active:scale-95 ${
            mode === 'signin'
              ? 'bg-primary text-white shadow-subtle'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => {
            setMode('register');
            setErrorMsg(null);
          }}
          className={`btn-interactive flex-1 py-2.5 rounded-lg font-label-caps text-xs tracking-label-caps uppercase font-semibold transition-all active:scale-95 ${
            mode === 'register'
              ? 'bg-primary text-white shadow-subtle'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          Create Account
        </button>
      </div>

      {/* Card Container */}
      <div className="bg-surface-lowest border border-on-surface/15 rounded-2xl p-6 sm:p-8 shadow-card">
        {/* Error / Success Alerts */}
        {errorMsg && (
          <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2.5 text-xs text-red-700">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="mb-5 p-3.5 bg-olive/15 border border-olive/30 rounded-lg flex items-center gap-2.5 text-xs text-olive">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Google Sign-In Option */}
        <div className="mb-5">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading}
            className="btn-interactive w-full py-2.5 px-4 bg-surface-lowest hover:bg-surface-low border border-outline-variant/60 text-on-surface font-semibold text-xs sm:text-sm rounded-xl shadow-xs transition-all flex items-center justify-center gap-3 cursor-pointer hover:border-primary/40 group active:scale-[0.98] disabled:opacity-60"
          >
            {isGoogleLoading ? (
              <Loader2 className="w-4 h-4 text-primary animate-spin" />
            ) : (
              <GoogleIcon className="w-4 h-4" />
            )}
            <span>
              {isGoogleLoading
                ? 'Connecting to Google...'
                : mode === 'signin'
                ? 'Continue with Google'
                : 'Sign up with Google'}
            </span>
          </button>

          <div className="relative flex items-center justify-center my-5">
            <div className="border-t border-outline-variant/30 w-full" />
            <span className="bg-surface-lowest px-3 font-label-caps text-[11px] tracking-label-caps uppercase text-outline shrink-0">
              or with atelier credentials
            </span>
            <div className="border-t border-outline-variant/30 w-full" />
          </div>
        </div>

        {mode === 'signin' ? (
          /* SIGN IN FORM */
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label
                htmlFor="signin-email"
                className="block font-label-caps text-xs tracking-label-caps uppercase font-semibold text-on-surface-variant mb-1.5"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-outline absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="signin-email"
                  type="email"
                  required
                  placeholder="aria@esondha.com"
                  value={signInEmail}
                  onChange={(e) => setSignInEmail(e.target.value)}
                  className="w-full bg-surface border border-outline-variant/50 rounded-lg pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-on-surface focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label
                  htmlFor="signin-password"
                  className="block font-label-caps text-xs tracking-label-caps uppercase font-semibold text-on-surface-variant"
                >
                  Password
                </label>
                <span className="text-[11px] text-outline cursor-pointer hover:text-primary">
                  Forgot?
                </span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-outline absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="signin-password"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={signInPassword}
                  onChange={(e) => setSignInPassword(e.target.value)}
                  className="w-full bg-surface border border-outline-variant/50 rounded-lg pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-on-surface focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn-interactive w-full mt-2 py-3 bg-primary hover:bg-primary-container text-white font-label-caps text-xs tracking-label-caps font-semibold uppercase rounded-lg shadow-subtle flex items-center justify-center gap-2 transition-colors cursor-pointer active:scale-[0.98]"
            >
              <span>Sign In to Account</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Demo One-Click Account */}
            <div className="pt-4 border-t border-outline-variant/20 mt-4 text-center">
              <span className="text-[11px] text-outline block mb-2">Want to test with a pre-configured account?</span>
              <button
                type="button"
                onClick={handleFillDemo}
                className="btn-interactive w-full py-2 bg-secondary-container/40 hover:bg-secondary-container text-on-secondary-fixed font-label-caps text-[11px] tracking-label-caps uppercase font-bold rounded-lg transition-colors border border-secondary-container flex items-center justify-center gap-1.5 active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <span>One-Click Demo Account (Aria)</span>
              </button>
            </div>
          </form>
        ) : (
          /* CREATE ACCOUNT / REGISTRATION FORM */
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label
                htmlFor="reg-name"
                className="block font-label-caps text-xs tracking-label-caps uppercase font-semibold text-on-surface-variant mb-1.5"
              >
                Full Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-outline absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="reg-name"
                  type="text"
                  required
                  placeholder="e.g. Maya Chen"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="w-full bg-surface border border-outline-variant/50 rounded-lg pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-on-surface focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="reg-email"
                className="block font-label-caps text-xs tracking-label-caps uppercase font-semibold text-on-surface-variant mb-1.5"
              >
                Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-outline absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="reg-email"
                  type="email"
                  required
                  placeholder="maya@example.com"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="w-full bg-surface border border-outline-variant/50 rounded-lg pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-on-surface focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="reg-password"
                className="block font-label-caps text-xs tracking-label-caps uppercase font-semibold text-on-surface-variant mb-1.5"
              >
                Create Password * (min 6 characters)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-outline absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="reg-password"
                  type="password"
                  required
                  minLength={6}
                  placeholder="••••••••"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className="w-full bg-surface border border-outline-variant/50 rounded-lg pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-on-surface focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            {/* Optional Shipping Address */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowAddressFields(!showAddressFields)}
                className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>
                  {showAddressFields ? 'Hide Shipping Address' : '+ Add Default Shipping Address (Optional)'}
                </span>
              </button>

              {showAddressFields && (
                <div className="mt-3 space-y-3 p-3.5 bg-surface-low rounded-lg border border-outline-variant/30 animate-in fade-in">
                  <div>
                    <label className="block text-[11px] font-label-caps uppercase text-on-surface-variant mb-1">
                      Street Address
                    </label>
                    <input
                      type="text"
                      placeholder="123 Serene Way, Apt 2"
                      value={regStreet}
                      onChange={(e) => setRegStreet(e.target.value)}
                      className="w-full bg-surface-lowest border border-outline-variant/50 rounded px-3 py-1.5 text-xs text-on-surface"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[11px] font-label-caps uppercase text-on-surface-variant mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        placeholder="Portland"
                        value={regCity}
                        onChange={(e) => setRegCity(e.target.value)}
                        className="w-full bg-surface-lowest border border-outline-variant/50 rounded px-3 py-1.5 text-xs text-on-surface"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-label-caps uppercase text-on-surface-variant mb-1">
                        State
                      </label>
                      <input
                        type="text"
                        placeholder="OR"
                        value={regState}
                        onChange={(e) => setRegState(e.target.value)}
                        className="w-full bg-surface-lowest border border-outline-variant/50 rounded px-3 py-1.5 text-xs text-on-surface"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-label-caps uppercase text-on-surface-variant mb-1">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        placeholder="97201"
                        value={regPostal}
                        onChange={(e) => setRegPostal(e.target.value)}
                        className="w-full bg-surface-lowest border border-outline-variant/50 rounded px-3 py-1.5 text-xs text-on-surface"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="btn-interactive w-full mt-2 py-3 bg-primary hover:bg-primary-container text-white font-label-caps text-xs tracking-label-caps font-semibold uppercase rounded-lg shadow-subtle flex items-center justify-center gap-2 transition-colors cursor-pointer active:scale-[0.98]"
            >
              <span>Create Account &amp; Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        <div className="mt-6 pt-4 border-t border-outline-variant/20 flex items-center justify-center gap-2 text-[11px] text-outline">
          <ShieldCheck className="w-3.5 h-3.5 text-primary" />
          <span>Encrypted slow-living member profile</span>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface">
      <Navbar />

      <main className="page-enter flex-1 max-w-7xl mx-auto px-6 py-12 md:py-16 flex flex-col items-center justify-center">
        <div className="text-center mb-8">
          <span className="font-label-caps text-xs tracking-label-caps text-secondary uppercase font-bold block mb-2">
            MEMBER ATELIER
          </span>
          <h1 className="font-display-lg text-3xl sm:text-4xl text-on-surface font-bold tracking-tight">
            E Sondha Account
          </h1>
          <p className="font-body-md text-xs sm:text-sm text-on-surface-variant mt-1.5 max-w-sm mx-auto">
            Access your curated orders, saved shipping details, and slow commerce rituals.
          </p>
        </div>

        <Suspense fallback={<div className="py-12 text-xs text-outline">Loading session...</div>}>
          <LoginForm />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
