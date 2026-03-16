'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';

const Logo = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 4C6 2.89543 6.89543 2 8 2H18L26 10V28C26 29.1046 25.1046 30 24 30H8C6.89543 30 6 29.1046 6 28V4Z" stroke="#C6F135" strokeWidth="1.5" fill="none"/>
    <path d="M18 2V10H26" stroke="#C6F135" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M11 16L15 20L21 14" stroke="#FF4D8D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="26" cy="22" r="5" fill="#0B0514" stroke="#C6F135" strokeWidth="1.5"/>
    <path d="M24 22H28M26 20V24" stroke="#C6F135" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const LogoMark = () => (
  <div className="flex items-center gap-2.5">
    <Logo />
    <span className="text-xl font-heading font-bold tracking-tight">
      <span className="text-brand-accent">Data</span><span className="text-brand-text">PM</span>
    </span>
  </div>
);

/* Data flow motif SVG for hero background */
const DataMotif = () => (
  <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
        <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#C6F135" strokeWidth="0.5"/>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#grid)"/>
    {/* Data flow lines */}
    <line x1="15%" y1="20%" x2="45%" y2="35%" stroke="#C6F135" strokeWidth="1" opacity="0.3"/>
    <line x1="45%" y1="35%" x2="75%" y2="25%" stroke="#FF4D8D" strokeWidth="1" opacity="0.3"/>
    <line x1="75%" y1="25%" x2="90%" y2="45%" stroke="#C6F135" strokeWidth="1" opacity="0.2"/>
    <line x1="10%" y1="60%" x2="40%" y2="70%" stroke="#FF4D8D" strokeWidth="1" opacity="0.2"/>
    <line x1="40%" y1="70%" x2="65%" y2="55%" stroke="#C6F135" strokeWidth="1" opacity="0.15"/>
    {/* Dots at intersections */}
    <circle cx="15%" cy="20%" r="3" fill="#C6F135" opacity="0.4"/>
    <circle cx="45%" cy="35%" r="3" fill="#C6F135" opacity="0.4"/>
    <circle cx="75%" cy="25%" r="3" fill="#FF4D8D" opacity="0.4"/>
    <circle cx="90%" cy="45%" r="2" fill="#C6F135" opacity="0.3"/>
    <circle cx="40%" cy="70%" r="2" fill="#FF4D8D" opacity="0.3"/>
    <circle cx="65%" cy="55%" r="2" fill="#C6F135" opacity="0.25"/>
  </svg>
);

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const } }),
};

const FEATURES = [
  {
    title: 'Domain-Specific AI',
    desc: 'Prompts engineered by senior Data PMs. Every output is structured, actionable, and stakeholder-ready.',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
  },
  {
    title: '7 Artifact Types',
    desc: 'Charters, KPI frameworks, data specs, decks, dictionaries, migration plans, and requirements docs.',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
  },
  {
    title: 'Pro DOCX Export',
    desc: 'Formatted Word documents with headings, bullets, and tables. No cleanup — just send to stakeholders.',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
  },
];

const PRICING = [
  { name: 'Free', price: '€0', period: 'forever', desc: 'Get started with essentials', features: ['3 generations/day', '4 artifact types', 'Markdown export', 'Basic prompts'], cta: 'Start Free', ctaLink: '/app', highlighted: false },
  { name: 'Pro', price: '€29', period: '/month', desc: 'For Data PMs who ship fast', features: ['Unlimited generations', 'All 7 artifact types', 'DOCX + Markdown export', 'Advanced PMO prompts', 'Refine & iterate', 'Generation history', 'Priority support'], cta: 'Get Started', ctaLink: '/app', highlighted: true },
  { name: 'Team', price: '€79', period: '/month', desc: 'For PMO teams & consultancies', features: ['Everything in Pro', 'Up to 10 users', 'Custom templates', 'Shared artifact library', 'Slack integration', 'SSO & admin controls', 'Dedicated support'], cta: 'Contact Us', ctaLink: '#waitlist', highlighted: false },
];

const STATS = [
  { value: 7, suffix: '', label: 'Artifact types' },
  { value: 30, suffix: 's', label: 'Average generation' },
  { value: 1200, suffix: '+', label: 'Words per output' },
];

function CountUp({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!started) return;
    const duration = 1500;
    const steps = 40;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(current));
    }, duration / steps);
    return () => clearInterval(timer);
  }, [started, target]);

  return (
    <motion.span
      onViewportEnter={() => setStarted(true)}
      viewport={{ once: true }}
    >
      {count}{suffix}
    </motion.span>
  );
}

export default function LandingPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 100]);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const handleWaitlist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await fetch('/api/waitlist', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) });
      setSubmitted(true);
    } catch { alert('Something went wrong.'); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-brand-base">
      {/* Nav — transparent → frosted glass */}
      <nav className={`fixed top-0 left-0 right-0 px-6 py-4 z-50 transition-all duration-300 ${
        scrolled ? 'bg-brand-base/80 backdrop-blur-xl border-b border-brand-border/50' : 'bg-transparent'
      }`}>
        <div className="flex items-center justify-between max-w-6xl mx-auto w-full">
          <Link href="/" aria-label="DataPM Home"><LogoMark /></Link>
          <div className="flex items-center gap-3 sm:gap-5">
            <a href="#features" className="hidden sm:inline text-sm text-brand-muted hover:text-brand-text transition">Features</a>
            <a href="#pricing" className="hidden sm:inline text-sm text-brand-muted hover:text-brand-text transition">Pricing</a>
            <Link href="/app" className="bg-brand-accent hover:bg-brand-accent-bright text-brand-base text-sm font-semibold px-5 py-2.5 rounded-lg transition shadow-lg shadow-brand-accent/20">
              Open App →
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        {/* Hero */}
        <section className="relative min-h-[100vh] flex items-center justify-center overflow-hidden noise-overlay scanlines">
          <motion.div className="absolute inset-0 animated-gradient" style={{ y: heroY }} />
          <DataMotif />
          {/* Glow halos */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-brand-accent/[0.06] rounded-full blur-[150px]" />
          <div className="absolute top-2/3 left-1/4 w-[400px] h-[400px] bg-brand-rose/[0.05] rounded-full blur-[120px]" />

          <div className="relative flex flex-col items-center justify-center px-6 text-center max-w-4xl mx-auto py-20 z-10">
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-surface/80 text-brand-accent text-xs font-medium mb-8 border border-brand-border">
              <span className="text-[10px]">✦</span> Built for Data PMs
            </motion.div>

            <motion.h1 variants={fadeUp} initial="hidden" animate="visible" custom={1}
              className="font-heading text-4xl sm:text-5xl lg:text-display font-extrabold tracking-tight leading-[1.05] mb-6">
              Stop writing project<br />docs <span className="gradient-text">from scratch</span>
            </motion.h1>

            <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={2}
              className="text-lg sm:text-xl text-brand-muted mb-10 max-w-2xl leading-relaxed">
              DataPM generates professional project charters, KPI frameworks, data specs and stakeholder decks — in seconds.
            </motion.p>

            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3}
              className="flex flex-col sm:flex-row gap-3 mb-6">
              <Link href="/app" className="bg-brand-accent hover:bg-brand-accent-bright text-brand-base font-semibold px-8 py-4 rounded-xl transition text-lg shadow-xl shadow-brand-accent/25 hover:shadow-brand-accent/40 hover:-translate-y-0.5">
                Try free →
              </Link>
              <a href="#sample" className="border border-brand-border hover:border-brand-border-bright text-brand-muted hover:text-brand-text font-semibold px-8 py-4 rounded-xl transition text-lg">
                See example ↓
              </a>
            </motion.div>

            <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={4}
              className="text-xs text-brand-tertiary">No account needed · Free during beta · 30 seconds</motion.p>

            {/* Hero visual — mock terminal */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.7, ease: "easeOut" }}
              className="mt-16 w-full max-w-2xl relative"
            >
              <div className="absolute -inset-4 bg-brand-accent/[0.06] rounded-3xl blur-2xl animate-glow-pulse" />
              {/* Rose glow on opposite corner */}
              <div className="absolute -bottom-4 -right-4 w-48 h-48 bg-brand-rose/[0.08] rounded-full blur-2xl" />
              <div className="relative bg-brand-surface border border-brand-border rounded-2xl overflow-hidden shadow-2xl">
                <div className="bg-brand-base border-b border-brand-border px-5 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-brand-rose/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-brand-accent/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-brand-success/60" />
                  </div>
                  <span className="text-xs text-brand-tertiary font-mono">project-charter.md</span>
                  <div className="w-16" />
                </div>
                <div className="p-6 text-left text-sm space-y-3">
                  <p className="text-brand-accent font-mono text-xs">## Executive Summary</p>
                  <p className="text-brand-muted text-sm leading-relaxed">The Customer 360 Platform consolidates data from <span className="text-brand-text font-medium">Salesforce</span>, <span className="text-brand-text font-medium">Shopify</span>, and <span className="text-brand-text font-medium">Zendesk</span> — targeting <span className="text-brand-accent font-medium">15% retention lift</span> and <span className="text-brand-rose font-medium">60% faster reporting</span>.</p>
                  <div className="border-t border-brand-border pt-3">
                    <p className="text-brand-accent font-mono text-xs mb-2">## Stakeholder RACI</p>
                    <div className="grid grid-cols-4 gap-px text-xs">
                      <div className="bg-brand-accent/10 px-2 py-1.5 text-brand-accent font-medium">Stakeholder</div>
                      <div className="bg-brand-accent/10 px-2 py-1.5 text-brand-accent font-medium">Role</div>
                      <div className="bg-brand-accent/10 px-2 py-1.5 text-brand-accent font-medium">R</div>
                      <div className="bg-brand-accent/10 px-2 py-1.5 text-brand-accent font-medium">A</div>
                      <div className="bg-brand-elevated px-2 py-1.5 text-brand-muted">Sarah Chen</div>
                      <div className="bg-brand-elevated px-2 py-1.5 text-brand-muted">VP Marketing</div>
                      <div className="bg-brand-elevated px-2 py-1.5 text-brand-muted"></div>
                      <div className="bg-brand-elevated px-2 py-1.5 text-brand-rose">✓</div>
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-brand-surface to-transparent" />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Stats */}
        <section className="max-w-4xl mx-auto px-6 py-16">
          <div className="grid grid-cols-3 gap-6 text-center">
            {STATS.map((s) => (
              <div key={s.label}>
                <p className="font-heading text-3xl sm:text-4xl font-extrabold text-brand-text">
                  <CountUp target={s.value} suffix={s.suffix} />
                </p>
                <p className="text-sm text-brand-muted mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section id="features" className="max-w-5xl mx-auto px-6 py-24">
          <div className="text-center mb-16">
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
              className="font-heading text-3xl sm:text-4xl font-bold mb-4 text-brand-text">
              Built for data teams,<br />not everyone
            </motion.h2>
            <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}
              className="text-brand-muted max-w-xl mx-auto">Every prompt is engineered for data project management.</motion.p>
          </div>
          <div className="grid sm:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => (
              <motion.div key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="bg-brand-surface border border-brand-border rounded-2xl p-6 hover:border-brand-accent/30 transition-all duration-200 group relative overflow-hidden"
              >
                {/* Subtle glow on hover */}
                <div className="absolute -top-12 -right-12 w-24 h-24 bg-brand-accent/0 group-hover:bg-brand-accent/[0.06] rounded-full blur-2xl transition-all duration-500" />
                <motion.div whileHover={{ rotate: 5 }} className="relative w-10 h-10 rounded-xl bg-brand-accent/10 text-brand-accent flex items-center justify-center mb-4 group-hover:bg-brand-accent/20 transition">
                  {f.icon}
                </motion.div>
                <h3 className="relative font-heading font-semibold text-lg mb-2 text-brand-text">{f.title}</h3>
                <p className="relative text-sm text-brand-muted leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="max-w-4xl mx-auto px-6 py-24">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-16">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-4 text-brand-text">Three steps. Thirty seconds.</h2>
          </motion.div>
          <div className="relative grid sm:grid-cols-3 gap-8 sm:gap-12">
            <div className="hidden sm:block absolute top-8 left-[20%] right-[20%] h-px bg-gradient-to-r from-brand-accent/30 via-brand-rose/20 to-brand-accent/30" />
            {[
              { step: '1', title: 'Describe Your Project', desc: 'Enter your project name, stakeholders, goals, and data sources.' },
              { step: '2', title: 'Pick an Artifact', desc: 'Choose from 7 PMO document types: charters, KPIs, specs, decks…' },
              { step: '3', title: 'Generate & Export', desc: 'Get a structured, professional document. Export as DOCX or Markdown.' },
            ].map((s, i) => (
              <motion.div key={s.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className="text-center relative z-10"
              >
                <div className="w-14 h-14 rounded-full bg-brand-accent/10 border-2 border-brand-accent/30 text-brand-accent font-heading font-bold text-xl flex items-center justify-center mx-auto mb-5">
                  {s.step}
                </div>
                <h3 className="font-heading font-semibold text-lg mb-2 text-brand-text">{s.title}</h3>
                <p className="text-sm text-brand-muted leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Sample Output */}
        <section id="sample" className="max-w-4xl mx-auto px-6 py-24">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-10">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-3 text-brand-text">See what you get</h2>
            <p className="text-brand-muted">Real output from DataPM — not placeholder text</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-brand-accent/15 via-transparent to-brand-rose/15 rounded-2xl blur-sm" />
            <div className="relative bg-brand-surface border border-brand-border rounded-2xl overflow-hidden">
              <div className="bg-brand-base border-b border-brand-border px-5 py-3 flex items-center justify-between">
                <div>
                  <p className="font-heading font-semibold text-sm text-brand-text">Customer 360 Data Platform</p>
                  <p className="text-xs text-brand-tertiary">Project Charter · 1,247 words · 18s</p>
                </div>
                <div className="hidden sm:flex gap-2">
                  <span className="text-xs px-3 py-1.5 rounded-lg bg-brand-accent text-brand-base font-medium">📄 DOCX</span>
                  <span className="text-xs px-3 py-1.5 rounded-lg bg-brand-elevated text-brand-muted border border-brand-border">📋 Copy</span>
                </div>
              </div>
              <div className="p-6 md:p-8 text-sm max-h-[380px] overflow-hidden relative">
                <div className="prose prose-invert prose-sm max-w-none prose-headings:font-heading prose-headings:text-brand-text prose-h2:text-lg prose-h2:mt-5 prose-h2:mb-3 prose-p:text-brand-muted prose-p:leading-relaxed prose-strong:text-brand-text prose-th:bg-brand-accent/10 prose-th:px-3 prose-th:py-2 prose-th:text-left prose-th:text-xs prose-th:border prose-th:border-brand-border prose-td:px-3 prose-td:py-2 prose-td:text-xs prose-td:border prose-td:border-brand-border">
                  <div dangerouslySetInnerHTML={{ __html: `
                    <h2>Executive Summary</h2>
                    <p>The Customer 360 Data Platform consolidates data from <strong>Salesforce CRM</strong> (50K+ contacts), <strong>Shopify</strong> (120K orders/year), <strong>Zendesk</strong> (8K tickets/month), and <strong>Google Analytics</strong> (2M monthly events). This initiative targets <strong>15% customer retention lift</strong> and <strong>60% faster reporting</strong> within 12 months.</p>
                    <h2>Stakeholder Map &amp; RACI</h2>
                    <table>
                      <thead><tr><th>Stakeholder</th><th>Role</th><th>R</th><th>A</th><th>C</th><th>I</th></tr></thead>
                      <tbody>
                        <tr><td>Sarah Chen</td><td>VP Marketing</td><td></td><td>✓</td><td>✓</td><td></td></tr>
                        <tr><td>Tom Rivera</td><td>Head of Sales</td><td>✓</td><td></td><td>✓</td><td></td></tr>
                        <tr><td>Priya Patel</td><td>Data Eng Lead</td><td>✓</td><td></td><td></td><td></td></tr>
                      </tbody>
                    </table>
                    <h2>Risk Register</h2>
                    <table>
                      <thead><tr><th>Risk</th><th>Prob.</th><th>Impact</th><th>Mitigation</th></tr></thead>
                      <tbody>
                        <tr><td>Customer ID mismatch across systems</td><td>High</td><td>High</td><td>Fuzzy matching + manual review for top 1K accounts</td></tr>
                        <tr><td>GDPR non-compliance for EU data</td><td>Med</td><td>Critical</td><td>Legal review at each phase; PII encryption at rest</td></tr>
                      </tbody>
                    </table>
                  ` }} />
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-brand-surface to-transparent" />
              </div>
              <div className="px-6 pb-6 pt-2 text-center">
                <Link href="/app" className="inline-flex items-center gap-2 bg-brand-accent hover:bg-brand-accent-bright text-brand-base font-semibold px-6 py-3 rounded-xl transition shadow-lg shadow-brand-accent/20 hover:-translate-y-0.5">
                  Generate yours →
                </Link>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="max-w-5xl mx-auto px-6 py-24">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-16">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-4 text-brand-text">Simple, transparent pricing</h2>
            <p className="text-brand-muted">Start free. Upgrade when you ship more.</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-5">
            {PRICING.map((plan, i) => (
              <motion.div key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className={`relative rounded-2xl p-8 border transition-all duration-200 ${
                  plan.highlighted
                    ? 'bg-brand-accent/[0.06] border-brand-accent/40 glow-accent-sm scale-[1.02]'
                    : 'bg-brand-surface border-brand-border hover:border-brand-border-bright'
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-accent text-brand-base text-xs font-semibold px-4 py-1 rounded-full shadow-lg shadow-brand-accent/30">Most Popular</div>
                )}
                <h3 className="font-heading font-bold text-xl mb-1 text-brand-text">{plan.name}</h3>
                <p className="text-sm text-brand-muted mb-6">{plan.desc}</p>
                <div className="mb-8">
                  <span className="font-heading text-4xl font-extrabold text-brand-text">{plan.price}</span>
                  <span className="text-brand-tertiary text-sm ml-1">{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-brand-muted">
                      <svg className="w-4 h-4 text-brand-accent flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href={plan.ctaLink} className={`block w-full py-3 rounded-xl font-semibold text-sm text-center transition ${
                  plan.highlighted
                    ? 'bg-brand-accent hover:bg-brand-accent-bright text-brand-base shadow-lg shadow-brand-accent/20'
                    : 'bg-brand-elevated hover:bg-brand-border text-brand-text border border-brand-border'
                }`}>{plan.cta}</Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Waitlist */}
        <section id="waitlist" className="max-w-lg mx-auto px-6 py-24 text-center">
          <h2 className="font-heading text-2xl font-bold mb-2 text-brand-text">Get updates on new features</h2>
          <p className="text-brand-muted text-sm mb-8">New artifact types, team features, and integrations coming soon.</p>
          {submitted ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="bg-brand-accent/10 border border-brand-accent/20 rounded-2xl p-6">
              <p className="text-brand-accent font-medium text-lg mb-1">✓ You&apos;re on the list!</p>
              <p className="text-brand-muted text-sm">We&apos;ll notify you when new features ship.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleWaitlist} className="flex gap-2">
              <input type="email" required placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-3 rounded-xl bg-brand-surface border border-brand-border text-brand-text placeholder-brand-tertiary focus:outline-none focus:border-brand-accent transition" />
              <button type="submit" disabled={loading}
                className="bg-brand-accent hover:bg-brand-accent-bright text-brand-base font-semibold px-6 py-3 rounded-xl transition disabled:opacity-50 shadow-lg shadow-brand-accent/20">
                {loading ? '...' : 'Join'}
              </button>
            </form>
          )}
        </section>
      </main>

      <footer className="border-t border-brand-border/50 px-6 py-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link href="/" aria-label="DataPM Home"><LogoMark /></Link>
          <div className="flex items-center gap-6 text-xs text-brand-muted">
            <a href="#features" className="hover:text-brand-text transition">Features</a>
            <a href="#pricing" className="hover:text-brand-text transition">Pricing</a>
            <Link href="/app" className="hover:text-brand-text transition">Open App</Link>
            <span>© 2026 DataPM</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
