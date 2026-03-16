import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-brand-base px-6 text-center">
      <div className="text-6xl mb-6">📄</div>
      <h1 className="font-heading text-4xl font-bold text-brand-text mb-3">404</h1>
      <p className="text-brand-muted mb-8 max-w-md">
        This page doesn&apos;t exist — but your next project charter could.
      </p>
      <div className="flex gap-3">
        <Link href="/" className="bg-brand-accent hover:bg-brand-accent-bright text-white font-semibold px-6 py-3 rounded-xl transition shadow-lg shadow-brand-accent/20">
          Go Home
        </Link>
        <Link href="/app" className="border border-brand-border hover:border-brand-border-bright text-brand-muted hover:text-brand-text font-semibold px-6 py-3 rounded-xl transition">
          Open App
        </Link>
      </div>
    </div>
  );
}
