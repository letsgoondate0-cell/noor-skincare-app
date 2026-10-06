import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useNoor } from '../../context/NoorContext';
import { ShieldCheck, Mail, Lock, User, ArrowRight, Eye, EyeOff } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { signIn, signUp, forgotPassword, showToast } = useNoor();
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (mode !== 'forgot' && (!password || password.length < 6)) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      if (mode === 'signup') {
        await signUp(name || email.split('@')[0], email, password);
        onClose();
      } else if (mode === 'signin') {
        await signIn(email, password);
        onClose();
      } else {
        await forgotPassword(email);
        setMode('signin');
      }
    } catch (err) {
      setErrorMessage('Authentication request could not be completed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        mode === 'signin'
          ? 'Sign In to NOOR'
          : mode === 'signup'
          ? 'Create Your NOOR Account'
          : 'Reset Password'
      }
      subtitle="One private cloud profile across iPhone, Android, and Web."
      maxWidth="sm"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMessage && (
          <div className="p-2.5 bg-neutral-100 border border-neutral-300 text-black text-xs">
            {errorMessage}
          </div>
        )}

        {mode === 'signup' && (
          <div>
            <label className="block text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-neutral-500 mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 stroke-[1.5]" />
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Elena Vance"
                className="w-full bg-white border border-neutral-300 rounded-none pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-black placeholder-neutral-400 focus:outline-none focus:border-black transition-colors"
              />
            </div>
          </div>
        )}

        <div>
          <label className="block text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-neutral-500 mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 stroke-[1.5]" />
            <input
              type="email"
              required
              autoCapitalize="none"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="elena@example.com"
              className="w-full bg-white border border-neutral-300 rounded-none pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-black placeholder-neutral-400 focus:outline-none focus:border-black transition-colors"
            />
          </div>
        </div>

        {mode !== 'forgot' && (
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-neutral-500">
                Password
              </label>
              {mode === 'signin' && (
                <button
                  type="button"
                  onClick={() => setMode('forgot')}
                  className="text-xs text-neutral-500 hover:text-black hover:underline cursor-pointer"
                >
                  Forgot password?
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 stroke-[1.5]" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-white border border-neutral-300 rounded-none pl-10 pr-10 py-2.5 text-xs sm:text-sm text-black placeholder-neutral-400 focus:outline-none focus:border-black transition-colors font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(p => !p)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        )}

        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            className="w-full"
            isLoading={loading}
            rightIcon={<ArrowRight className="w-4 h-4 stroke-[1.5]" />}
          >
            {mode === 'signin'
              ? 'Sign In'
              : mode === 'signup'
              ? 'Create Account'
              : 'Send Reset Link'}
          </Button>
        </div>

        <div className="flex items-center justify-center gap-2 pt-2 text-xs text-neutral-500">
          {mode === 'signin' ? (
            <>
              <span>Don't have an account?</span>
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
            </>
          ) : mode === 'signup' ? (
            <>
              <span>Already have an account?</span>
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
            </>
          ) : (
            <button
              type="button"
              onClick={() => {
                setMode('signin');
                setErrorMessage(null);
              }}
              className="text-black font-semibold hover:underline cursor-pointer"
            >
              Back to Sign In
            </button>
          )}
        </div>

        <div className="pt-4 border-t border-neutral-200 flex items-center gap-2 text-[11px] text-neutral-500">
          <ShieldCheck className="w-3.5 h-3.5 text-black shrink-0 stroke-[1.5]" />
          <span>Client-side encryption. Zero ad broker tracking.</span>
        </div>
      </form>
    </Modal>
  );
};
