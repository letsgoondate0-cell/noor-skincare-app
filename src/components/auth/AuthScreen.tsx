import React, { useState } from 'react';
import { BrandLogo } from '../common/BrandLogo';
import { useNoor } from '../../context/NoorContext';
import { SkinType } from '../../types';
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowLeft
} from 'lucide-react';

interface AuthScreenProps {
  initialMode?: 'signin' | 'signup' | 'forgot';
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ initialMode = 'signin' }) => {
  const { signIn, signUp, forgotPassword, showToast } = useNoor();

  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [skinType, setSkinType] = useState<SkinType>('Combination');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (mode !== 'forgot' && (!password || password.length < 6)) {
      setErrorMessage('Password must contain at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      if (mode === 'signin') {
        const success = await signIn(email, password);
        if (!success) {
          setErrorMessage('Unable to sign in. Please verify your credentials.');
        }
      } else if (mode === 'signup') {
        const success = await signUp(name || email.split('@')[0], email, password, skinType);
        if (!success) {
          setErrorMessage('Account creation failed. Please try again.');
        }
      } else if (mode === 'forgot') {
        await forgotPassword(email);
        setForgotSubmitted(true);
      }
    } catch (err) {
      setErrorMessage('An unexpected authentication error occurred.');
    } finally {
      setLoading(false);
    }
  };

  // Quick Demo Login Handler
  const handleDemoSignIn = async () => {
    setLoading(true);
    setEmail('elena@noor.app');
    setPassword('••••••••••••');
    setTimeout(async () => {
      await signIn('elena@noor.app', 'demo-password-123');
      setLoading(false);
    }, 350);
  };

  return (
    <div className="min-h-screen w-full bg-[#FAFAFA] text-[#0A0A0A] flex flex-col justify-between px-4 py-8 sm:py-12 sm:px-6 lg:px-8 selection:bg-black selection:text-white">
      {/* Top Header with Architectural Wordmark */}
      <header className="w-full max-w-md mx-auto flex flex-col items-center text-center pt-2 sm:pt-6">
        <BrandLogo size="lg" variant="grey" showSubtitle={false} className="mb-3" />
        <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.28em] text-neutral-500 font-medium">
          Personal Skincare Ecosystem
        </span>
      </header>

      {/* Main Authentication Container */}
      <main className="w-full max-w-md mx-auto my-auto py-8">
        <div className="bg-white border border-neutral-200 rounded-none shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6 sm:p-8">
          {/* Mode Switcher Tabs (Sign In vs Create Account) */}
          {mode !== 'forgot' ? (
            <div className="flex border-b border-neutral-200 mb-6 pb-0">
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  setErrorMessage(null);
                }}
                className={`flex-1 pb-3 text-xs sm:text-sm font-semibold tracking-wide transition-all border-b-2 -mb-[1px] cursor-pointer ${
                  mode === 'signin'
                    ? 'border-black text-black'
                    : 'border-transparent text-neutral-400 hover:text-neutral-700'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setErrorMessage(null);
                }}
                className={`flex-1 pb-3 text-xs sm:text-sm font-semibold tracking-wide transition-all border-b-2 -mb-[1px] cursor-pointer ${
                  mode === 'signup'
                    ? 'border-black text-black'
                    : 'border-transparent text-neutral-400 hover:text-neutral-700'
                }`}
              >
                Create Account
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 mb-6 pb-3 border-b border-neutral-200">
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  setForgotSubmitted(false);
                  setErrorMessage(null);
                }}
                className="p-1 -ml-1 text-neutral-400 hover:text-black transition-colors cursor-pointer"
                aria-label="Back to Sign In"
              >
                <ArrowLeft className="w-4 h-4 stroke-[1.5]" />
              </button>
              <h2 className="text-sm font-semibold tracking-tight text-black">
                Password Recovery
              </h2>
            </div>
          )}

          {/* Section Headline */}
          <div className="mb-6">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-black">
              {mode === 'signin'
                ? 'Welcome back'
                : mode === 'signup'
                ? 'Begin your private journey'
                : 'Reset your password'}
            </h1>
            <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
              {mode === 'signin'
                ? 'Access your unified routine, shelf inventory, and AI memory.'
                : mode === 'signup'
                ? 'One private cloud sanctuary across iPhone, Android, and Web.'
                : 'Enter your account email to receive cryptographic recovery instructions.'}
            </p>
          </div>

          {/* Error Message Notice */}
          {errorMessage && (
            <div className="mb-5 p-3 bg-neutral-100 border border-neutral-300 text-neutral-900 text-xs flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 bg-black rounded-none shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Forgot Password Success State */}
          {mode === 'forgot' && forgotSubmitted ? (
            <div className="space-y-4 py-2">
              <div className="p-4 bg-neutral-50 border border-neutral-200 space-y-2">
                <div className="flex items-center gap-2 text-black font-semibold text-xs">
                  <CheckCircle2 className="w-4 h-4 text-black stroke-[1.5]" />
                  <span>Recovery link sent</span>
                </div>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  We sent password reset instructions to <strong className="text-black font-mono">{email}</strong>. Please check your inbox and spam folder.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  setForgotSubmitted(false);
                }}
                className="w-full py-2.5 bg-black text-white text-xs font-semibold tracking-wider uppercase hover:bg-neutral-800 transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Return to Sign In</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Field (Only on Sign Up) */}
              {mode === 'signup' && (
                <div>
                  <label
                    htmlFor="auth-name"
                    className="block text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-500 font-bold mb-1.5"
                  >
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 stroke-[1.5]" />
                    <input
                      id="auth-name"
                      type="text"
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="e.g. Elena Vance"
                      className="w-full bg-white border border-neutral-300 rounded-none pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-black placeholder-neutral-400 focus:outline-none focus:border-black transition-colors"
                    />
                  </div>
                </div>
              )}

              {/* Email Field */}
              <div>
                <label
                  htmlFor="auth-email"
                  className="block text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-500 font-bold mb-1.5"
                >
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 stroke-[1.5]" />
                  <input
                    id="auth-email"
                    type="email"
                    required
                    autoCapitalize="none"
                    autoComplete="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="name@domain.com"
                    className="w-full bg-white border border-neutral-300 rounded-none pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-black placeholder-neutral-400 focus:outline-none focus:border-black transition-colors"
                  />
                </div>
              </div>

              {/* Password Field (Not on Forgot Password) */}
              {mode !== 'forgot' && (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label
                      htmlFor="auth-password"
                      className="block text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-500 font-bold"
                    >
                      Password
                    </label>
                    {mode === 'signin' && (
                      <button
                        type="button"
                        onClick={() => {
                          setMode('forgot');
                          setErrorMessage(null);
                        }}
                        className="text-[11px] text-neutral-500 hover:text-black hover:underline cursor-pointer transition-colors"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 stroke-[1.5]" />
                    <input
                      id="auth-password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-white border border-neutral-300 rounded-none pl-10 pr-10 py-2.5 text-xs sm:text-sm text-black placeholder-neutral-400 focus:outline-none focus:border-black transition-colors font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(prev => !prev)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 transition-colors cursor-pointer"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4 stroke-[1.5]" />
                      ) : (
                        <Eye className="w-4 h-4 stroke-[1.5]" />
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Skin Type Selection (Only on Sign Up) */}
              {mode === 'signup' && (
                <div>
                  <label
                    htmlFor="auth-skin-type"
                    className="block text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-500 font-bold mb-1.5"
                  >
                    Primary Skin Type
                  </label>
                  <select
                    id="auth-skin-type"
                    value={skinType}
                    onChange={e => setSkinType(e.target.value as SkinType)}
                    className="w-full bg-white border border-neutral-300 rounded-none px-3.5 py-2.5 text-xs sm:text-sm text-black focus:outline-none focus:border-black transition-colors cursor-pointer"
                  >
                    <option value="Combination">Combination (Oily T-zone, normal/dry cheeks)</option>
                    <option value="Dry">Dry (Tight, flaky, craves rich lipids)</option>
                    <option value="Oily">Oily (Excess shine, prone to congestion)</option>
                    <option value="Normal">Normal (Balanced moisture and sebum)</option>
                    <option value="Unsure">Unsure (Help me determine it)</option>
                  </select>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-black text-white text-xs sm:text-sm font-semibold tracking-wider uppercase hover:bg-neutral-800 active:bg-neutral-900 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="inline-flex items-center gap-2">
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Authenticating...</span>
                    </span>
                  ) : mode === 'signin' ? (
                    <>
                      <span>Sign In</span>
                      <ArrowRight className="w-4 h-4 stroke-[2]" />
                    </>
                  ) : mode === 'signup' ? (
                    <>
                      <span>Create Account</span>
                      <ArrowRight className="w-4 h-4 stroke-[2]" />
                    </>
                  ) : (
                    <>
                      <span>Send Recovery Link</span>
                      <ArrowRight className="w-4 h-4 stroke-[2]" />
                    </>
                  )}
                </button>
              </div>

              {/* Quick Toggle Link */}
              <div className="text-center pt-2">
                {mode === 'signin' ? (
                  <p className="text-xs text-neutral-500">
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setMode('signup');
                        setErrorMessage(null);
                      }}
                      className="text-black font-semibold hover:underline cursor-pointer"
                    >
                      Create Account
                    </button>
                  </p>
                ) : mode === 'signup' ? (
                  <p className="text-xs text-neutral-500">
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setMode('signin');
                        setErrorMessage(null);
                      }}
                      className="text-black font-semibold hover:underline cursor-pointer"
                    >
                      Sign In
                    </button>
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setMode('signin');
                      setErrorMessage(null);
                    }}
                    className="text-xs text-neutral-500 hover:text-black font-semibold hover:underline cursor-pointer"
                  >
                    Back to Sign In
                  </button>
                )}
              </div>
            </form>
          )}

          {/* Quick Demo Access Divider */}
          <div className="mt-8 pt-6 border-t border-neutral-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-400">
                Quick Evaluator Access
              </span>
              <span className="text-[10px] font-mono text-neutral-400">
                1-CLICK DEMO
              </span>
            </div>

            <button
              type="button"
              onClick={handleDemoSignIn}
              disabled={loading}
              className="w-full py-2.5 px-3 bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 text-black text-xs font-medium transition-all flex items-center justify-between group cursor-pointer disabled:opacity-50"
            >
              <div className="flex items-center gap-2.5 text-left">
                <div className="w-5 h-5 bg-black text-white flex items-center justify-center text-[10px] font-bold">
                  E
                </div>
                <div>
                  <div className="font-semibold text-black leading-tight">
                    Elena Vance
                  </div>
                  <div className="text-[10px] text-neutral-500 font-mono">
                    Combination • Barrier Focus • Sample Shelf & Routine
                  </div>
                </div>
              </div>
              <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-neutral-600 group-hover:text-black transition-colors">
                Explore →
              </span>
            </button>
          </div>
        </div>

        {/* Security / Privacy Footnote */}
        <div className="mt-6 flex items-center justify-center gap-2 text-[11px] text-neutral-500 font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-neutral-700 stroke-[1.5]" />
          <span>Client-side AES encryption • Zero ad telemetry</span>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-md mx-auto text-center pt-4 border-t border-neutral-200">
        <p className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">
          NOOR ECOSYSTEM • WEB • IOS • ANDROID
        </p>
      </footer>
    </div>
  );
};
