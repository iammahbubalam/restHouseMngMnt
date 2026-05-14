'use client';

import { signIn } from 'next-auth/react';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { LayoutDashboard, Lock, ShieldCheck, Loader } from 'lucide-react';

function LoginForm() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-bg-secondary p-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-accent-blue/10 rounded-3xl mx-auto flex items-center justify-center mb-6 border border-accent-blue/20 shadow-xl shadow-accent-blue/5">
            <LayoutDashboard size={40} className="text-accent-blue" />
          </div>
          <h1 className="text-3xl font-black text-text-primary tracking-tight mb-2">Rest House</h1>
          <p className="text-sm text-text-secondary font-medium uppercase tracking-widest text-[10px]">Management Portal</p>
        </div>

        <div className="premium-card p-8 shadow-2xl border-white/50">
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-accent-red/5 border border-accent-red/10 flex items-start gap-3">
              <div className="mt-0.5"><Lock size={16} className="text-accent-red" /></div>
              <p className="text-xs text-accent-red font-semibold leading-relaxed">
                {error === 'AccessDenied' 
                  ? 'Your email is not on the authorized list. Please contact the administrator.' 
                  : 'There was a problem signing you in. Please try again.'}
              </p>
            </div>
          )}

          <div className="space-y-6">
            <div className="text-center">
              <p className="text-sm text-text-secondary mb-8 leading-relaxed">
                Welcome back. Please authenticate with your official account to access the dashboard.
              </p>
              
              <button
                onClick={() => signIn('google', { callbackUrl: '/' })}
                className="group relative w-full flex items-center justify-center gap-3 py-4 bg-text-primary text-bg-primary rounded-2xl font-black text-sm transition-all duration-300 hover:shadow-2xl hover:shadow-text-primary/20 hover:-translate-y-1 active:translate-y-0"
              >
                <svg className="w-5 h-5 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </button>
            </div>
          </div>
        </div>
        
        <div className="mt-12 flex items-center justify-center gap-2 text-text-secondary/40">
          <ShieldCheck size={14} />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Authorized Access Only</span>
        </div>
      </div>
    </div>
  );
}

export default function Login() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-bg-secondary">
        <Loader className="w-8 h-8 text-accent-blue animate-spin" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
