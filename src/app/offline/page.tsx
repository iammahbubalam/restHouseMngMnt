'use client';

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-bg-primary p-6">
      <div className="glass-card w-full max-w-sm p-8 rounded-3xl border border-border-subtle/50 text-center">
        <div className="w-16 h-16 bg-bg-card border border-border-subtle rounded-2xl mx-auto flex items-center justify-center mb-6">
          <span className="text-3xl">📡</span>
        </div>
        <h1 className="text-2xl font-bold text-text-primary mb-3">You're Offline</h1>
        <p className="text-text-secondary mb-6">
          Please check your internet connection and try again.
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="w-full py-3 rounded-xl font-bold bg-accent-green text-bg-primary hover:bg-accent-green/90 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
