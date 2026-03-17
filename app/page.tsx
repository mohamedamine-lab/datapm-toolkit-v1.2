'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, useInView, useMotionValue, useSpring } from 'framer-motion';

/* ── Logo ── */
const Logo = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 4C6 2.89543 6.89543 2 8 2H18L26 10V28C26 29.1046 25.1046 30 24 30H8C6.89543 30 6 29.1046 6 28V4Z" stroke="#C6F135" strokeWidth="1.5" fill="none"/>
    <path d="M18 2V10H26" stroke="#C6F135" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M11 16L15 20L21 14" stroke="#FF4D8D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="26" cy="22" r="5" fill="#0B0514" stroke="#C6F135" strokeWidth="1.5"/>
    <path d="M24 22H28M26 20V24" stroke="#C6F135" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

/* ── Magnetic button ── */
function MagneticButton({ children, className, href }: { children: React.ReactNode; className?: string; href: string }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 15 });
  const springY = useSpring(y, { stiffness: 150, damping: 15 });

  return (
    <motion.a
      ref={ref}
      href={href}
      style={{ x: springX, y: springY }}
      onMouseMove={(e) => {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        x.set((e.clientX - rect.left - rect.width / 2) * 0.15);
        y.set((e.clientY - rect.top - rect.height / 2) * 0.15);
      }}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      className={className}
    >
      {children}
    </motion.a>
  );
}

/* ── Animated counter ── */
function Counter({ target, suffix = '', prefix = '' }: { target: number; suffix?: string; prefix?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const duration = 1800;
    const steps = 50;
    const inc = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += inc;
      if (current >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(current));
    }, duration / steps);
    return () => clearInterval(timer);
  }, [isInView, target]);

  return <span ref={ref}>{prefix}{count}{suffix}</span>;
}

/* ── Floating particles ── */
function Particles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: i % 3 === 0 ? '#C6F135' : i % 3 === 1 ? '#FF4D8D' : '#3D2070',
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.6, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 3 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 3,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

/* ── Animated code block ── */
function TypewriterCode() {
  const lines = [
    { text: '## Executive Summary', color: '#C6F135', delay: 0 },
    { text: '', color: '', delay: 0.3 },
    { text: 'The Customer 360 Platform consolidates', color: '#B8A5D4', delay: 0.5 },
    { text: 'data from **Salesforce**, **Shopify**, and', color: '#B8A5D4', delay: 0.9 },
    { text: '**Zendesk** — targeting **15% retention**', color: '#B8A5D4', delay: 1.3 },
    { text: 'lift and **60% faster reporting**.', color: '#B8A5D4', delay: 1.7 },
    { text: '', color: '', delay: 2.0 },
    { text: '## Stakeholder RACI', color: '#C6F135', delay: 2.2 },
    { text: '| Stakeholder    | Role           | R | A |', color: '#6B5490', delay: 2.5 },
    { text: '| Sarah Chen     | VP Marketing   |   | ✓ |', color: '#B8A5D4', delay: 2.8 },
    { text: '| Tom Rivera     | Head of Sales  | ✓ |   |', color: '#B8A5D4', delay: 3.1 },
    { text: '| Priya Patel    | Data Eng Lead  | ✓ |   |', color: '#B8A5D4', delay: 3.4 },
  ];

  return (
    <div className="font-mono text-xs sm:text-sm leading-relaxed">
      {lines.map((line, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: line.delay, duration: 0.4, ease: 'easeOut' }}
          style={{ color: line.color }}
          className="whitespace-nowrap overflow-hidden"
        >
          {line.text.split(/(\*\*[^*]+\*\*)/).map((part, j) =>
            part.startsWith('**') ? (
              <span key={j} className="text-brand-text font-semibold">{part.replace(/\*\*/g, '')}</span>
            ) : (
              <span key={j}>{part}</span>
            )
          )}
          {line.text === '' && <br />}
        </motion.div>
      ))}
      <motion.span
        className="inline-block w-2 h-4 bg-brand-accent ml-0.5"
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.8, repeat: Infinity }}
      />
    </div>
  );
}

/* ── Artifact type cards ── */
const ARTIFACTS = [
  { icon: '📋', name: 'Project Charter', desc: 'Scope, RACI, risks, timeline, budget', gradient: 'from-[#C6F135]/20 to-transparent' },
  { icon: '📊', name: 'KPI Framework', desc: 'Strategic & operational metrics', gradient: 'from-[#FF4D8D]/20 to-transparent' },
  { icon: '🗄️', name: 'Data Spec', desc: 'Data model, field specs, quality rules', gradient: 'from-[#C6F135]/20 to-transparent' },
  { icon: '📽️', name: 'Stakeholder Deck', desc: 'Slide-by-slide with talking points', gradient: 'from-[#FF4D8D]/20 to-transparent' },
  { icon: '📖', name: 'Data Dictionary', desc: 'Field definitions, metadata, lineage', gradient: 'from-[#C6F135]/20 to-transparent' },
  { icon: '🔄', name: 'Migration Plan', desc: 'Step-by-step strategy & rollback', gradient: 'from-[#FF4D8D]/20 to-transparent' },
  { icon: '📝', name: 'Requirements Doc', desc: 'Functional & non-functional specs', gradient: 'from-[#C6F135]/20 to-transparent' },
];

const FEATURES = [
  {
    title: 'Domain-Specific AI',
    desc: 'Not generic prompts. Every template is engineered by senior Data PMs with real Fortune 500 experience.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    accent: '#C6F135',
  },
  {
    title: 'Pro DOCX Export',
    desc: 'One-click download. Formatted Word documents with headings, tables, bullets. Send to stakeholders as-is.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    accent: '#FF4D8D',
  },
  {
    title: 'Edit & Iterate',
    desc: 'Inline editor. Refine with AI. Regenerate sections. Your artifacts improve with every pass.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
    accent: '#C6F135',
  },
];

const TESTIMONIALS = [
  { quote: "Saved me 3 hours on a project charter last week. The RACI matrix alone was worth it.", name: 'Marie L.', role: 'Data PM @ Société Générale', avatar: '👩‍💼' },
  { quote: "Finally a tool that understands how data projects actually work. Not generic AI fluff.", name: 'Romain B.', role: 'BI Manager @ Carrefour', avatar: '👨‍💻' },
  { quote: "Generated our entire KPI framework in under a minute. My VP thought I worked all weekend.", name: 'Camille T.', role: 'Head of Data @ Scale-up', avatar: '👩‍🔬' },
];

/* ── Main Page ── */
export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.95]);

  useEffect(() => {
    document.title = 'DataPM — Ship data projects faster';
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-brand-base overflow-x-hidden">
      {/* ── Nav ── */}
      <nav className={`fixed top-0 left-0 right-0 px-5 py-3.5 z-50 transition-all duration-500 ${
        scrolled ? 'bg-brand-base/70 backdrop-blur-2xl border-b border-brand-border/40 shadow-2xl shadow-brand-base/50' : 'bg-transparent'
      }`}>
        <div className="flex items-center justify-between max-w-7xl mx-auto w-full">
          <Link href="/" className="flex items-center gap-2.5 group">
            <Logo />
            <span className="text-xl font-heading font-bold tracking-tight">
              <span className="text-brand-accent group-hover:text-brand-accent-bright transition-colors">Data</span>
              <span className="text-brand-text">PM</span>
            </span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-5">
            <a href="#artifacts" className="hidden md:inline text-sm text-brand-muted hover:text-brand-text transition">Artifacts</a>
            <a href="#features" className="hidden md:inline text-sm text-brand-muted hover:text-brand-text transition">Features</a>
            <a href="#pricing" className="hidden md:inline text-sm text-brand-muted hover:text-brand-text transition">Pricing</a>
            <Link href="/templates" className="hidden md:inline text-sm text-brand-muted hover:text-brand-text transition">Templates</Link>
            <Link href="/app"
              className="bg-brand-accent hover:bg-brand-accent-bright text-brand-base text-sm font-semibold px-5 py-2.5 rounded-xl transition-all duration-200 shadow-lg shadow-brand-accent/20 hover:shadow-brand-accent/40 hover:-translate-y-0.5 active:translate-y-0">
              Open App →
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        {/* ═══════════════════════════════════════════
            HERO — Jaw-dropping, asymmetric layout
        ═══════════════════════════════════════════ */}
        <section className="relative min-h-[100vh] flex items-center overflow-hidden noise-overlay scanlines">
          {/* Background layers */}
          <div className="absolute inset-0 animated-gradient" />
          <Particles />

          {/* Giant accent glow orbs */}
          <div className="absolute top-[10%] left-[15%] w-[600px] h-[600px] bg-brand-accent/[0.04] rounded-full blur-[200px]" />
          <div className="absolute bottom-[10%] right-[10%] w-[500px] h-[500px] bg-brand-rose/[0.04] rounded-full blur-[180px]" />
          <div className="absolute top-[60%] left-[50%] w-[300px] h-[300px] bg-[#3D2070]/30 rounded-full blur-[120px]" />

          {/* Grid pattern overlay */}
          <div className="absolute inset-0 grid-pattern opacity-[0.03]" />

          <motion.div style={{ opacity: heroOpacity, scale: heroScale }} className="relative z-10 w-full">
            <div className="max-w-7xl mx-auto px-5 pt-32 pb-20 grid lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-8 items-center">
              {/* Left: Copy */}
              <div>
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-surface/60 backdrop-blur-sm border border-brand-border/60 text-brand-accent text-xs font-medium mb-8"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-accent opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-accent" />
                  </span>
                  Built by Data PMs, for Data PMs
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="font-heading text-[2.75rem] sm:text-[3.5rem] lg:text-[4.25rem] font-extrabold tracking-[-0.03em] leading-[1.02] mb-7"
                >
                  Stop writing<br />
                  project docs{' '}
                  <span className="relative inline-block">
                    <span className="gradient-text">from scratch</span>
                    <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 8" fill="none">
                      <motion.path
                        d="M0 5C30 2 60 7 100 4C140 1 170 6 200 3"
                        stroke="#C6F135"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ delay: 0.8, duration: 0.8, ease: 'easeOut' }}
                      />
                    </svg>
                  </span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="text-lg sm:text-xl text-brand-muted leading-relaxed mb-10 max-w-xl"
                >
                  DataPM generates <span className="text-brand-text font-medium">professional project charters</span>,
                  KPI frameworks, data specs, and stakeholder decks —{' '}
                  <span className="text-brand-accent font-medium">in seconds, not hours.</span>
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.45 }}
                  className="flex flex-col sm:flex-row gap-3 mb-6"
                >
                  <MagneticButton
                    href="/app"
                    className="group bg-brand-accent hover:bg-brand-accent-bright text-brand-base font-bold px-8 py-4 rounded-2xl text-lg transition-all duration-200 shadow-xl shadow-brand-accent/25 hover:shadow-brand-accent/40 inline-flex items-center justify-center gap-2"
                  >
                    Try free
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </MagneticButton>
                  <a href="#demo"
                    className="border border-brand-border hover:border-brand-border-bright text-brand-muted hover:text-brand-text font-semibold px-8 py-4 rounded-2xl text-lg transition-all duration-200 text-center">
                    See it work ↓
                  </a>
                </motion.div>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="text-xs text-brand-tertiary flex items-center gap-4"
                >
                  <span className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5 text-brand-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    No account needed
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5 text-brand-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    5 free artifacts/month
                  </span>
                  <span className="flex items-center gap-1 hidden sm:flex">
                    <svg className="w-3.5 h-3.5 text-brand-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    DOCX export
                  </span>
                </motion.p>
              </div>

              {/* Right: Live product preview */}
              <motion.div
                initial={{ opacity: 0, x: 40, rotateY: -5 }}
                animate={{ opacity: 1, x: 0, rotateY: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="relative lg:mt-0 mt-4"
              >
                {/* Glow behind card */}
                <div className="absolute -inset-8 bg-gradient-to-br from-brand-accent/[0.08] via-transparent to-brand-rose/[0.06] rounded-[2rem] blur-2xl" />
                <div className="absolute -inset-1 bg-gradient-to-br from-brand-accent/20 via-brand-border/20 to-brand-rose/15 rounded-[1.5rem] p-px">
                  <div className="absolute inset-0 bg-brand-surface rounded-[1.5rem]" />
                </div>

                {/* Card */}
                <div className="relative bg-brand-surface/80 backdrop-blur-xl border border-brand-border/50 rounded-[1.5rem] overflow-hidden shadow-2xl">
                  {/* Title bar */}
                  <div className="bg-brand-base/60 backdrop-blur border-b border-brand-border/50 px-5 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-brand-rose/60" />
                        <div className="w-3 h-3 rounded-full bg-brand-warning/60" />
                        <div className="w-3 h-3 rounded-full bg-brand-success/60" />
                      </div>
                      <span className="text-[10px] text-brand-tertiary ml-2 font-mono">project-charter.md</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-brand-accent/10 text-brand-accent border border-brand-accent/20 font-medium">AI Generated</span>
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-brand-surface text-brand-muted border border-brand-border">1,247 words</span>
                    </div>
                  </div>

                  {/* Animated content */}
                  <div className="p-5 sm:p-6 max-h-[340px] overflow-hidden relative">
                    <TypewriterCode />
                    <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-brand-surface to-transparent" />
                  </div>

                  {/* Action bar */}
                  <div className="px-5 pb-5 flex items-center justify-between">
                    <div className="flex gap-1.5">
                      <span className="text-[10px] px-2.5 py-1 rounded-lg bg-brand-accent text-brand-base font-semibold">📄 DOCX</span>
                      <span className="text-[10px] px-2.5 py-1 rounded-lg bg-brand-elevated text-brand-muted border border-brand-border">📋 Copy</span>
                      <span className="text-[10px] px-2.5 py-1 rounded-lg bg-brand-elevated text-brand-muted border border-brand-border">✨ Refine</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="h-1 w-12 bg-brand-success rounded-full" />
                      <span className="text-[9px] text-brand-success font-medium">Excellent</span>
                    </div>
                  </div>
                </div>

                {/* Floating badge — generation time */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: 1.5, duration: 0.4, type: 'spring' }}
                  className="absolute -bottom-5 -left-5 bg-brand-surface border border-brand-border rounded-2xl px-4 py-3 shadow-xl flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-brand-accent/10 flex items-center justify-center text-brand-accent text-lg">⚡</div>
                  <div>
                    <p className="text-brand-text font-bold text-sm font-heading">12 seconds</p>
                    <p className="text-brand-tertiary text-[10px]">Average generation time</p>
                  </div>
                </motion.div>

                {/* Floating badge — quality */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: 1.8, duration: 0.4, type: 'spring' }}
                  className="absolute -top-4 -right-4 bg-brand-surface border border-brand-accent/30 rounded-2xl px-4 py-3 shadow-xl flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-brand-success/10 flex items-center justify-center text-brand-success text-lg">✓</div>
                  <div>
                    <p className="text-brand-text font-bold text-sm font-heading">PMO-Ready</p>
                    <p className="text-brand-tertiary text-[10px]">Send to stakeholders as-is</p>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
          >
            <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="w-6 h-10 rounded-full border-2 border-brand-border flex items-start justify-center p-1.5">
              <div className="w-1.5 h-2.5 rounded-full bg-brand-accent/60" />
            </motion.div>
          </motion.div>
        </section>

        {/* ═══════════════════════════════════════════
            SOCIAL PROOF BAR
        ═══════════════════════════════════════════ */}
        <section className="border-y border-brand-border/30 bg-brand-surface/30 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-5 py-8 flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
            {[
              { n: 500, s: '+', label: 'Artifacts generated' },
              { n: 7, s: '', label: 'Document types' },
              { n: 12, s: 's', label: 'Avg generation time' },
              { n: 4, s: '', label: 'Export formats' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-heading text-2xl sm:text-3xl font-extrabold text-brand-text">
                  <Counter target={stat.n} suffix={stat.s} />
                </p>
                <p className="text-xs text-brand-muted mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            LIVE DEMO — Try it now
        ═══════════════════════════════════════════ */}
        <DemoSection />

        {/* ═══════════════════════════════════════════
            ARTIFACT TYPES — Horizontal scroll
        ═══════════════════════════════════════════ */}
        <section id="artifacts" className="py-24 sm:py-32 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-brand-base via-brand-surface/20 to-brand-base" />
          <div className="relative max-w-7xl mx-auto px-5">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="mb-14">
              <p className="text-brand-accent text-sm font-medium mb-3 tracking-wide uppercase">7 Artifact Types</p>
              <h2 className="font-heading text-3xl sm:text-5xl font-extrabold tracking-tight text-brand-text mb-4">
                Every document a<br />Data PM needs
              </h2>
              <p className="text-brand-muted max-w-lg text-lg">From project kickoff to go-live. Each template is engineered with real-world PMO standards.</p>
            </motion.div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {ARTIFACTS.map((a, i) => (
                <motion.div
                  key={a.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                >
                  <Link href={`/app?type=${encodeURIComponent(a.name)}`}
                    className={`block bg-brand-surface border border-brand-border rounded-2xl p-5 hover:border-brand-accent/30 transition-all duration-200 group h-full relative overflow-hidden`}>
                    <div className={`absolute inset-0 bg-gradient-to-br ${a.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                    <div className="relative">
                      <span className="text-3xl mb-3 block">{a.icon}</span>
                      <h3 className="font-heading font-semibold text-brand-text text-sm mb-1">{a.name}</h3>
                      <p className="text-xs text-brand-muted leading-relaxed">{a.desc}</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            FEATURES — Big, bold sections
        ═══════════════════════════════════════════ */}
        <section id="features" className="py-24 sm:py-32 relative">
          <div className="max-w-7xl mx-auto px-5">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="text-center mb-20">
              <p className="text-brand-accent text-sm font-medium mb-3 tracking-wide uppercase">Why DataPM</p>
              <h2 className="font-heading text-3xl sm:text-5xl font-extrabold tracking-tight text-brand-text">
                Built for data teams,<br />not everyone
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {FEATURES.map((f, i) => (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="group relative"
                >
                  <div className="bg-brand-surface border border-brand-border rounded-3xl p-8 h-full hover:border-brand-accent/30 transition-all duration-300 relative overflow-hidden">
                    <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-[80px] transition-opacity duration-500 opacity-0 group-hover:opacity-100"
                      style={{ background: f.accent, opacity: 0.06 }} />
                    <div className="relative">
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-200 group-hover:scale-110"
                        style={{ background: `${f.accent}15`, color: f.accent }}>
                        {f.icon}
                      </div>
                      <h3 className="font-heading font-bold text-xl text-brand-text mb-3">{f.title}</h3>
                      <p className="text-brand-muted leading-relaxed">{f.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            HOW IT WORKS — 3 steps
        ═══════════════════════════════════════════ */}
        <section className="py-24 sm:py-32 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-brand-base via-brand-surface/20 to-brand-base" />
          <div className="relative max-w-5xl mx-auto px-5">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="text-center mb-20">
              <p className="text-brand-accent text-sm font-medium mb-3 tracking-wide uppercase">How it works</p>
              <h2 className="font-heading text-3xl sm:text-5xl font-extrabold tracking-tight text-brand-text">
                Three steps.<br />Thirty seconds.
              </h2>
            </motion.div>

            <div className="grid sm:grid-cols-3 gap-8 relative">
              {/* Connecting line */}
              <div className="hidden sm:block absolute top-10 left-[20%] right-[20%] h-px">
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="h-full bg-gradient-to-r from-brand-accent/40 via-brand-rose/30 to-brand-accent/40 origin-left"
                />
              </div>

              {[
                { step: '1', title: 'Describe', desc: 'Enter project name, stakeholders, goals, data sources, tech stack. More context = better output.', icon: '📝' },
                { step: '2', title: 'Choose', desc: 'Pick from 7 PMO artifact types. Each template is optimized for a specific document structure.', icon: '🎯' },
                { step: '3', title: 'Export', desc: 'Get a structured, professional document. Edit inline, refine with AI, download as DOCX or Markdown.', icon: '📄' },
              ].map((s, i) => (
                <motion.div
                  key={s.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, duration: 0.5 }}
                  className="text-center relative z-10"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.2 + 0.3, type: 'spring', stiffness: 200 }}
                    className="w-20 h-20 rounded-2xl bg-brand-surface border-2 border-brand-accent/20 flex items-center justify-center mx-auto mb-5 text-3xl"
                  >
                    {s.icon}
                  </motion.div>
                  <div className="text-[10px] font-bold text-brand-accent uppercase tracking-wider mb-2">Step {s.step}</div>
                  <h3 className="font-heading font-bold text-xl text-brand-text mb-2">{s.title}</h3>
                  <p className="text-sm text-brand-muted leading-relaxed">{s.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            TESTIMONIALS
        ═══════════════════════════════════════════ */}
        <section className="py-24 sm:py-32">
          <div className="max-w-7xl mx-auto px-5">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="text-center mb-14">
              <p className="text-brand-accent text-sm font-medium mb-3 tracking-wide uppercase">Social Proof</p>
              <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-brand-text">
                Loved by Data PMs
              </h2>
            </motion.div>
            <div className="grid sm:grid-cols-3 gap-5">
              {TESTIMONIALS.map((t, i) => (
                <motion.div
                  key={t.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-brand-surface border border-brand-border rounded-3xl p-7 relative group hover:border-brand-accent/20 transition-all duration-300"
                >
                  <div className="text-brand-accent/40 text-5xl font-serif leading-none mb-3">&ldquo;</div>
                  <p className="text-brand-muted leading-relaxed mb-6">{t.quote}</p>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{t.avatar}</span>
                    <div>
                      <p className="text-sm font-medium text-brand-text">{t.name}</p>
                      <p className="text-xs text-brand-tertiary">{t.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            PRICING — Clean, compelling
        ═══════════════════════════════════════════ */}
        <section id="pricing" className="py-24 sm:py-32 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-brand-base via-brand-surface/20 to-brand-base" />
          <div className="relative max-w-5xl mx-auto px-5">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="text-center mb-16">
              <p className="text-brand-accent text-sm font-medium mb-3 tracking-wide uppercase">Pricing</p>
              <h2 className="font-heading text-3xl sm:text-5xl font-extrabold tracking-tight text-brand-text mb-4">
                Simple, transparent pricing
              </h2>
              <p className="text-brand-muted text-lg">Start free. Upgrade when you ship more.</p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-5 max-w-4xl mx-auto">
              {/* Free */}
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="bg-brand-surface border border-brand-border rounded-3xl p-8 hover:border-brand-border-bright transition-all duration-200">
                <h3 className="font-heading font-bold text-xl text-brand-text mb-1">Free</h3>
                <p className="text-sm text-brand-muted mb-6">Get started</p>
                <div className="mb-8">
                  <span className="font-heading text-5xl font-extrabold text-brand-text">€0</span>
                  <span className="text-brand-tertiary text-sm ml-1">/forever</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {['5 artifacts/month', '4 artifact types', 'Markdown export', 'Basic prompts'].map(f => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-brand-muted">
                      <svg className="w-4 h-4 text-brand-accent flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/app" className="block w-full py-3.5 rounded-xl font-semibold text-sm text-center bg-brand-elevated hover:bg-brand-border text-brand-text border border-brand-border transition-all duration-200">
                  Start free →
                </Link>
              </motion.div>

              {/* Pro */}
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
                className="bg-brand-accent/[0.06] border border-brand-accent/40 rounded-3xl p-8 relative glow-accent-sm scale-[1.02]">
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-brand-accent text-brand-base text-xs font-bold px-4 py-1.5 rounded-full shadow-lg shadow-brand-accent/30">
                  Most Popular
                </div>
                <h3 className="font-heading font-bold text-xl text-brand-text mb-1">Pro</h3>
                <p className="text-sm text-brand-muted mb-6">For Data PMs who ship fast</p>
                <div className="mb-8">
                  <span className="font-heading text-5xl font-extrabold text-brand-text">€29</span>
                  <span className="text-brand-tertiary text-sm ml-1">/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {['Unlimited artifacts', 'All 7 artifact types', 'DOCX + Markdown export', 'Advanced PMO prompts', 'Refine & iterate', 'Generation history', 'Priority support'].map(f => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-brand-muted">
                      <svg className="w-4 h-4 text-brand-accent flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/app" className="block w-full py-3.5 rounded-xl font-bold text-sm text-center bg-brand-accent hover:bg-brand-accent-bright text-brand-base shadow-lg shadow-brand-accent/20 transition-all duration-200">
                  Get Pro →
                </Link>
              </motion.div>

              {/* Team */}
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
                className="bg-brand-surface border border-brand-border rounded-3xl p-8 hover:border-brand-border-bright transition-all duration-200">
                <h3 className="font-heading font-bold text-xl text-brand-text mb-1">Team</h3>
                <p className="text-sm text-brand-muted mb-6">For PMO teams</p>
                <div className="mb-8">
                  <span className="font-heading text-5xl font-extrabold text-brand-text">€79</span>
                  <span className="text-brand-tertiary text-sm ml-1">/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {['Everything in Pro', 'Up to 10 users', 'Custom templates', 'Shared library', 'Slack integration', 'SSO & admin', 'Dedicated support'].map(f => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-brand-muted">
                      <svg className="w-4 h-4 text-brand-accent flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <a href="#waitlist" className="block w-full py-3.5 rounded-xl font-semibold text-sm text-center bg-brand-elevated hover:bg-brand-border text-brand-text border border-brand-border transition-all duration-200">
                  Contact us →
                </a>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            WAITLIST / CTA
        ═══════════════════════════════════════════ */}
        <WaitlistSection />

        {/* ═══════════════════════════════════════════
            FINAL CTA — Full bleed
        ═══════════════════════════════════════════ */}
        <section className="py-24 sm:py-32 relative overflow-hidden">
          <div className="absolute inset-0 animated-gradient" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-brand-accent/[0.06] rounded-full blur-[200px]" />
          <Particles />
          <div className="relative max-w-3xl mx-auto px-5 text-center z-10">
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="font-heading text-4xl sm:text-6xl font-extrabold tracking-tight text-brand-text mb-6 leading-[1.05]">
              Your next project doc<br />is <span className="gradient-text">30 seconds</span> away
            </motion.h2>
            <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
              className="text-lg text-brand-muted mb-10">
              Stop spending hours on documents that should take minutes.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
              <MagneticButton
                href="/app"
                className="group inline-flex items-center gap-2 bg-brand-accent hover:bg-brand-accent-bright text-brand-base font-bold px-10 py-5 rounded-2xl text-xl transition-all duration-200 shadow-2xl shadow-brand-accent/30 hover:shadow-brand-accent/50"
              >
                Start generating
                <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </MagneticButton>
            </motion.div>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-brand-border/30 px-5 py-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2">
            <Logo />
            <span className="text-lg font-heading font-bold">
              <span className="text-brand-accent">Data</span><span className="text-brand-text">PM</span>
            </span>
          </Link>
          <div className="flex items-center gap-6 text-xs text-brand-muted">
            <a href="#artifacts" className="hover:text-brand-text transition">Artifacts</a>
            <a href="#features" className="hover:text-brand-text transition">Features</a>
            <a href="#pricing" className="hover:text-brand-text transition">Pricing</a>
            <Link href="/templates" className="hover:text-brand-text transition">Templates</Link>
            <Link href="/app" className="hover:text-brand-text transition">Open App</Link>
            <span className="text-brand-tertiary">© 2026 DataPM</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ═══════════════════════════════════════════
   DEMO SECTION — Interactive try-it widget
═══════════════════════════════════════════ */
function DemoSection() {
  const [demoName, setDemoName] = useState('');
  const [demoType, setDemoType] = useState('Project Charter');
  const [demoResult, setDemoResult] = useState('');
  const [demoLoading, setDemoLoading] = useState(false);

  const handleDemo = async () => {
    if (!demoName) return;
    setDemoLoading(true);
    setDemoResult('');
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectName: demoName,
          context: `Quick demo for ${demoName}. This is a data project that needs professional PMO documentation. Generate a concise, high-quality sample showing the key sections.`,
          artifactType: demoType,
        }),
      });
      const data = await res.json();
      if (data.content) {
        const clean = data.content.replace(/\n\n> ⚠️[\s\S]*$/, '');
        setDemoResult(clean);
      }
    } catch {
      setDemoResult('# Sample Output\n\nSomething went wrong — try the full app!');
    }
    setDemoLoading(false);
  };

  return (
    <section id="demo" className="py-24 sm:py-32 relative">
      <div className="max-w-4xl mx-auto px-5">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center mb-12">
          <p className="text-brand-accent text-sm font-medium mb-3 tracking-wide uppercase">Live Demo</p>
          <h2 className="font-heading text-3xl sm:text-5xl font-extrabold tracking-tight text-brand-text mb-4">
            Try it now — no signup
          </h2>
          <p className="text-brand-muted text-lg">Type a project name and see what DataPM generates.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="bg-brand-surface border border-brand-border rounded-3xl p-6 sm:p-8 relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-brand-accent/[0.05] rounded-full blur-[80px]" />
          <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-brand-rose/[0.04] rounded-full blur-[60px]" />

          <div className="relative">
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <input type="text" value={demoName} onChange={e => setDemoName(e.target.value)}
                placeholder="Your project name..."
                className="flex-1 px-4 py-3.5 rounded-xl bg-brand-base border border-brand-border text-brand-text placeholder-brand-tertiary focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent/30 transition-all" />
              <select value={demoType} onChange={e => setDemoType(e.target.value)}
                className="px-4 py-3.5 rounded-xl bg-brand-base border border-brand-border text-brand-text focus:outline-none focus:border-brand-accent transition appearance-none cursor-pointer">
                {ARTIFACTS.map(a => (
                  <option key={a.name} value={a.name}>{a.icon} {a.name}</option>
                ))}
              </select>
              <button onClick={handleDemo} disabled={!demoName || demoLoading}
                className="bg-brand-accent hover:bg-brand-accent-bright text-brand-base font-bold px-7 py-3.5 rounded-xl transition disabled:opacity-40 shadow-lg shadow-brand-accent/20 whitespace-nowrap">
                {demoLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
                    Generating...
                  </span>
                ) : 'Try it →'}
              </button>
            </div>

            {demoResult && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div className="bg-brand-base border border-brand-border rounded-xl p-5 max-h-[220px] overflow-hidden relative">
                  <pre className="text-sm text-brand-muted whitespace-pre-wrap font-mono leading-relaxed">
                    {demoResult.substring(0, 600)}
                  </pre>
                  <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-brand-base via-brand-base/90 to-transparent flex items-end justify-center pb-5">
                    <Link href={`/app?name=${encodeURIComponent(demoName)}&context=${encodeURIComponent(`Demo for ${demoName}`)}&type=${encodeURIComponent(demoType)}`}
                      className="bg-brand-accent hover:bg-brand-accent-bright text-brand-base font-bold px-6 py-2.5 rounded-xl transition text-sm shadow-lg shadow-brand-accent/20">
                      See full output →
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   WAITLIST SECTION
═══════════════════════════════════════════ */
function WaitlistSection() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await fetch('/api/waitlist', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) });
      setSubmitted(true);
    } catch { /* ok */ }
    setLoading(false);
  };

  return (
    <section id="waitlist" className="py-16">
      <div className="max-w-lg mx-auto px-5 text-center">
        <h2 className="font-heading text-2xl font-bold text-brand-text mb-2">Get updates on new features</h2>
        <p className="text-brand-muted text-sm mb-8">New artifact types, team features, and integrations coming soon.</p>
        {submitted ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-brand-accent/10 border border-brand-accent/20 rounded-2xl p-6">
            <p className="text-brand-accent font-medium text-lg mb-1">✓ You&apos;re on the list!</p>
            <p className="text-brand-muted text-sm">We&apos;ll notify you when new features ship.</p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input type="email" required placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-4 py-3.5 rounded-xl bg-brand-surface border border-brand-border text-brand-text placeholder-brand-tertiary focus:outline-none focus:border-brand-accent transition" />
            <button type="submit" disabled={loading}
              className="bg-brand-accent hover:bg-brand-accent-bright text-brand-base font-bold px-6 py-3.5 rounded-xl transition disabled:opacity-50 shadow-lg shadow-brand-accent/20">
              {loading ? '...' : 'Join'}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
