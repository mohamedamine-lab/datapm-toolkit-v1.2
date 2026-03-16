'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion, AnimatePresence } from 'framer-motion';

const Logo = () => (
  <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 4C6 2.89543 6.89543 2 8 2H18L26 10V28C26 29.1046 25.1046 30 24 30H8C6.89543 30 6 29.1046 6 28V4Z" stroke="#C6F135" strokeWidth="1.5" fill="none"/>
    <path d="M18 2V10H26" stroke="#C6F135" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M11 16L15 20L21 14" stroke="#FF4D8D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="26" cy="22" r="5" fill="#0B0514" stroke="#C6F135" strokeWidth="1.5"/>
    <path d="M24 22H28M26 20V24" stroke="#C6F135" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const ARTIFACT_TYPES = [
  { id: 'project-charter', name: 'Project Charter', icon: '📋', desc: 'Full charter with scope, RACI, risks' },
  { id: 'kpi-framework', name: 'KPI Framework', icon: '📊', desc: 'Strategic & operational KPIs' },
  { id: 'data-specification', name: 'Data Specification', icon: '🗄️', desc: 'Data model, field specs, quality rules' },
  { id: 'stakeholder-deck', name: 'Stakeholder Deck Outline', icon: '📽️', desc: 'Slide-by-slide deck with talking points' },
  { id: 'data-dictionary', name: 'Data Dictionary', icon: '📖', desc: 'Field definitions & metadata' },
  { id: 'migration-plan', name: 'Migration Plan', icon: '🔄', desc: 'Step-by-step migration strategy' },
  { id: 'requirements-doc', name: 'Requirements Document', icon: '📝', desc: 'Functional & non-functional requirements' },
];

const EXAMPLES = [
  { name: 'Customer 360 Platform', context: 'Building a unified customer data platform consolidating data from Salesforce CRM, Shopify e-commerce, Zendesk support tickets, and Google Analytics. Goal: single source of truth for customer interactions across 50K+ customers. Stakeholders: VP Marketing (Sarah Chen), Head of Sales (Tom Rivera), CTO (Alex Kim), Data Engineering Lead (Priya Patel). Timeline: 6 months starting Q2 2026. Tech stack: Snowflake, dbt, Fivetran, Looker. Budget: $200K.', artifact: 'Project Charter' },
  { name: 'E-Commerce Analytics', context: 'Creating a comprehensive analytics dashboard for RetailCo doing $50M ARR with 200K monthly customers. Data sources: Shopify, Google Ads ($500K/month), Facebook Ads ($200K/month), Stripe. Key stakeholders: CEO, Head of Growth, Finance Director. Target: reduce time-to-insight from 3 days to real-time. Using Looker on BigQuery.', artifact: 'KPI Framework' },
  { name: 'Legacy ERP Migration', context: 'Migrating from on-premise SAP ERP (ECC 6.0) to Oracle Cloud ERP. 15 years of data (~500GB across 400 tables). 200 active users. Zero tolerance for data loss (SOX compliance). Maximum cutover window: 72 hours. Budget: $500K for migration. Go-live: January 2027.', artifact: 'Migration Plan' },
];

interface HistoryEntry {
  id: string;
  projectName: string;
  artifactType: string;
  content: string;
  context: string;
  timestamp: string;
  wordCount: number;
}

export default function AppPage() {
  const [projectName, setProjectName] = useState('');
  const [context, setContext] = useState('');
  const [artifactType, setArtifactType] = useState('Project Charter');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [error, setError] = useState('');
  const [generationTime, setGenerationTime] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('datapm-history-v2');
    if (saved) { try { setHistory(JSON.parse(saved)); } catch {} }
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') { e.preventDefault(); formRef.current?.requestSubmit(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const saveToHistory = (entry: HistoryEntry) => {
    const updated = [entry, ...history].slice(0, 50);
    setHistory(updated);
    localStorage.setItem('datapm-history-v2', JSON.stringify(updated));
  };

  const loadExample = (ex: typeof EXAMPLES[0]) => {
    setProjectName(ex.name);
    setContext(ex.context);
    setArtifactType(ex.artifact);
    setResult('');
    setError('');
  };

  const handleGenerate = useCallback(async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!projectName || !context) return;
    if (context.length < 50) { setError('Provide at least 50 characters of context.'); return; }
    setLoading(true);
    setResult('');
    setError('');
    setShowSuccess(false);
    setIsDemo(false);
    const startTime = Date.now();
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectName, context, artifactType }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      if (data.metadata?.demo) setIsDemo(true);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 1500);
      const cleanContent = data.content.replace(/\n\n> ⚠️[\s\S]*$/, '');
      setResult(cleanContent);
      setGenerationTime(Math.round((Date.now() - startTime) / 1000));
      const wc = cleanContent.split(/\s+/).length;
      saveToHistory({ id: Date.now().toString(), projectName, artifactType, content: cleanContent, context, timestamp: new Date().toISOString(), wordCount: wc });
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth' }), 200);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Generation failed');
    }
    setLoading(false);
  }, [projectName, context, artifactType, history]);

  const handleRefine = async () => {
    if (!result) return;
    setLoading(true);
    setError('');
    const startTime = Date.now();
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectName, context: `${context}\n\nPREVIOUS OUTPUT TO IMPROVE:\n${result.substring(0, 2000)}\n\nINSTRUCTIONS: Improve the previous output. More specific, actionable, detailed.`, artifactType }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data.content);
      setGenerationTime(Math.round((Date.now() - startTime) / 1000));
    } catch (err: unknown) { setError(err instanceof Error ? err.message : 'Refinement failed'); }
    setLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadDocx = async () => {
    const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } = await import('docx');
    const lines = result.split('\n');
    const children: InstanceType<typeof Paragraph>[] = [];
    children.push(new Paragraph({ children: [new TextRun({ text: projectName, font: 'Calibri', size: 52, bold: true, color: '0F172A' })], alignment: AlignmentType.CENTER, spacing: { before: 1200, after: 200 } }));
    children.push(new Paragraph({ children: [new TextRun({ text: artifactType, font: 'Calibri', size: 32, color: 'C6F135' })], alignment: AlignmentType.CENTER, spacing: { after: 800 } }));
    children.push(new Paragraph({ text: '', pageBreakBefore: true }));
    for (const line of lines) {
      if (line.startsWith('# ')) children.push(new Paragraph({ text: line.replace('# ', ''), heading: HeadingLevel.HEADING_1, spacing: { before: 360, after: 160 } }));
      else if (line.startsWith('## ')) children.push(new Paragraph({ text: line.replace('## ', ''), heading: HeadingLevel.HEADING_2, spacing: { before: 280, after: 120 } }));
      else if (line.startsWith('### ')) children.push(new Paragraph({ text: line.replace('### ', ''), heading: HeadingLevel.HEADING_3, spacing: { before: 200, after: 80 } }));
      else if (line.startsWith('- ') || line.startsWith('* ')) children.push(new Paragraph({ children: [new TextRun({ text: line.replace(/^[-*] /, ''), font: 'Calibri', size: 22 })], bullet: { level: 0 }, spacing: { after: 60 } }));
      else if (line.startsWith('|') && !line.match(/^[\s|:-]+$/)) {
        const cells = line.split('|').filter(c => c.trim());
        if (cells.length > 0) children.push(new Paragraph({ children: [new TextRun({ text: cells.map(c => c.trim()).join('  │  '), font: 'Consolas', size: 18 })], spacing: { after: 20 }, indent: { left: 200 } }));
      }
      else if (line.trim() === '') children.push(new Paragraph({ text: '', spacing: { after: 60 } }));
      else {
        const parts = line.split(/(\*\*[^*]+\*\*)/);
        const runs = parts.map(part => part.startsWith('**') && part.endsWith('**')
          ? new TextRun({ text: part.replace(/\*\*/g, ''), bold: true, font: 'Calibri', size: 22 })
          : new TextRun({ text: part, font: 'Calibri', size: 22 }));
        children.push(new Paragraph({ children: runs, spacing: { after: 80 } }));
      }
    }
    const doc = new Document({ sections: [{ properties: { page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } }, children }] });
    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `${projectName.replace(/\s+/g, '_')}_${artifactType.replace(/\s+/g, '_')}.docx`; a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadMarkdown = () => {
    const header = `---\ntitle: "${projectName}"\ntype: "${artifactType}"\ngenerated: "${new Date().toISOString()}"\ntool: DataPM Toolkit\n---\n\n`;
    const blob = new Blob([header + result], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `${projectName.replace(/\s+/g, '_')}_${artifactType.replace(/\s+/g, '_')}.md`; a.click();
    URL.revokeObjectURL(url);
  };

  const loadFromHistory = (entry: HistoryEntry) => {
    setProjectName(entry.projectName);
    setArtifactType(entry.artifactType);
    setContext(entry.context || '');
    setResult(entry.content);
    setShowHistory(false);
    setError('');
  };

  const [isDemo, setIsDemo] = useState(false);

  const wordCount = result ? result.split(/\s+/).length : 0;
  const contextQuality = context.length < 50 ? 'low' : context.length < 200 ? 'medium' : 'high';

  return (
    <div className="min-h-screen flex flex-col bg-brand-base">
      {/* Nav */}
      <nav className="border-b border-brand-border/50 px-6 py-3 bg-brand-base/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center justify-between max-w-5xl mx-auto w-full">
          <Link href="/" className="flex items-center gap-2">
            <Logo />
            <span className="text-lg font-heading font-bold tracking-tight">
              <span className="text-brand-accent">Data</span><span className="text-brand-text">PM</span>
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <button onClick={() => setShowHistory(!showHistory)} aria-label="Toggle generation history" className="text-sm text-brand-muted hover:text-brand-text transition flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              History ({history.length})
            </button>
            <span className="text-xs text-brand-tertiary bg-brand-surface px-2.5 py-1 rounded-full border border-brand-border">v1.1</span>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-8">
        {/* History */}
        <AnimatePresence>
          {showHistory && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              className="mb-8 bg-brand-surface border border-brand-border rounded-2xl p-5 overflow-hidden">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-heading font-semibold text-sm text-brand-text">Recent Generations</h3>
                {history.length > 0 && (
                  <button onClick={() => { setHistory([]); localStorage.removeItem('datapm-history-v2'); }} className="text-xs text-brand-error hover:text-red-300">Clear all</button>
                )}
              </div>
              {history.length === 0 ? (
                <p className="text-sm text-brand-muted">No history yet.</p>
              ) : (
                <div className="space-y-1 max-h-60 overflow-y-auto">
                  {history.map((h) => (
                    <button key={h.id} onClick={() => loadFromHistory(h)} className="w-full text-left px-3 py-2 rounded-xl hover:bg-brand-elevated transition text-sm flex items-center justify-between">
                      <span><span className="text-brand-text">{h.projectName}</span> <span className="text-brand-tertiary">— {h.artifactType}</span></span>
                      <span className="text-brand-tertiary text-xs">{h.wordCount}w</span>
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-2">
          <h1 className="font-heading text-2xl font-bold text-brand-text">Generate an Artifact</h1>
          <span className="text-xs text-brand-tertiary hidden sm:inline">⌘+Enter to generate</span>
        </motion.div>
        <p className="text-brand-muted text-sm mb-8">Choose a type, describe your project, get a professional document.</p>

        {/* Examples */}
        <div className="mb-8">
          <p className="text-xs text-brand-tertiary mb-2">Try an example:</p>
          <div className="flex flex-wrap gap-2">
            {EXAMPLES.map((ex) => (
              <motion.button key={ex.name} onClick={() => loadExample(ex)} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="text-xs px-3 py-1.5 rounded-lg border border-brand-border bg-brand-surface text-brand-muted hover:text-brand-text hover:border-brand-accent/30 transition">
                {ex.name}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Artifact selector */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-8">
          {ARTIFACT_TYPES.map((a) => (
            <motion.button key={a.id} onClick={() => setArtifactType(a.name)}
              whileHover={{ scale: 1.02, transition: { duration: 0.15 } }}
              whileTap={{ scale: 0.98 }}
              className={`text-left p-4 rounded-xl border transition-colors duration-200 ${
                artifactType === a.name
                  ? 'border-brand-accent/50 bg-brand-accent/10 text-brand-text ring-1 ring-brand-accent/20'
                  : 'border-brand-border bg-brand-surface text-brand-muted hover:border-brand-border-bright hover:bg-brand-elevated'
              }`}>
              <motion.div className="text-xl mb-2" whileHover={{ rotate: 5 }}>{a.icon}</motion.div>
              <div className="text-sm font-medium font-heading">{a.name}</div>
              <div className="text-xs text-brand-tertiary mt-1 leading-relaxed">{a.desc}</div>
              <AnimatePresence>
                {artifactType === a.name && (
                  <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0 }} className="mt-2">
                    <svg className="w-4 h-4 text-brand-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          ))}
        </div>

        {/* Form */}
        <form ref={formRef} onSubmit={handleGenerate} className="space-y-5 mb-10">
          <div>
            <label className="block text-sm font-medium text-brand-text mb-1.5">Project Name</label>
            <input type="text" required value={projectName} onChange={(e) => setProjectName(e.target.value)}
              placeholder="e.g. Customer 360 Data Platform"
              className="w-full px-4 py-3 rounded-xl bg-brand-surface border border-brand-border text-brand-text placeholder-brand-tertiary focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent/30 transition" />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-text mb-1.5">Project Context</label>
            <textarea required rows={7} value={context} onChange={(e) => setContext(e.target.value)}
              placeholder={"Describe your project in detail:\n\n• Goals and business objectives\n• Key stakeholders (names + roles)\n• Data sources and systems\n• Tech stack and infrastructure\n• Timeline and budget"}
              className="w-full px-4 py-3 rounded-xl bg-brand-surface border border-brand-border text-brand-text placeholder-brand-tertiary focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent/30 resize-y transition" />
            <div className="flex justify-between mt-1.5">
              <div className="flex items-center gap-2">
                <div className={`h-1.5 rounded-full transition-all ${
                  contextQuality === 'high' ? 'w-16 bg-brand-success' :
                  contextQuality === 'medium' ? 'w-10 bg-brand-warning' :
                  context.length > 0 ? 'w-5 bg-brand-rose' : 'w-5 bg-brand-border'
                }`} />
                <p className="text-xs text-brand-muted">
                  {contextQuality === 'high' ? 'Great detail!' : contextQuality === 'medium' ? 'More detail = better output' : context.length > 0 ? 'Need 50+ chars' : ''}
                </p>
              </div>
              <p className={`text-xs ${context.length > 4500 ? 'text-brand-rose' : 'text-brand-tertiary'}`}>{context.length}/5000</p>
            </div>
          </div>

          {/* Generate button */}
          <motion.button type="submit" disabled={loading || context.length < 50}
            whileHover={{ scale: loading ? 1 : 1.01 }}
            whileTap={{ scale: loading ? 1 : 0.99 }}
            className="relative bg-brand-accent hover:bg-brand-accent-bright text-brand-base font-semibold px-8 py-4 rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed w-full text-lg shadow-lg shadow-brand-accent/20 hover:shadow-brand-accent/30 overflow-hidden">
            {!loading && <div className="absolute inset-0 bg-brand-accent/20 rounded-xl animate-glow-pulse" />}
            <span className="relative z-10">
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
                  Generating...
                </span>
              ) : showSuccess ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  Done!
                </span>
              ) : (
                `Generate ${artifactType}`
              )}
            </span>
          </motion.button>
        </form>

        {/* Error */}
        <AnimatePresence>
          {error && !loading && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="mb-8 bg-brand-rose/5 border border-brand-rose/20 rounded-xl p-5">
              <div className="flex items-start gap-3">
                <span className="text-brand-rose text-lg">⚠️</span>
                <div>
                  <p className="text-brand-rose font-medium text-sm">Generation failed</p>
                  <p className="text-brand-rose/60 text-sm mt-1">{error}</p>
                  <button onClick={() => handleGenerate()} className="text-sm text-brand-rose hover:text-red-300 underline mt-2">Retry</button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading skeleton */}
        <AnimatePresence>
          {loading && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="mb-8 bg-brand-surface border border-brand-border rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <svg className="animate-spin h-5 w-5 text-brand-accent" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
                <span className="text-brand-accent font-medium text-sm">Generating your {artifactType}...</span>
              </div>
              <div className="space-y-3">
                {[75, 100, 85, 65, 90].map((w, i) => (
                  <motion.div key={i} className="h-4 bg-brand-elevated rounded" style={{ width: `${w}%` }}
                    animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Result */}
        <AnimatePresence>
          {result && !loading && (
            <motion.div ref={resultRef}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              {/* Left accent border on result card */}
              <div className="relative">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-brand-accent via-brand-accent/50 to-brand-rose/50 rounded-full" />
                <div className="ml-4">
                  <div className="bg-brand-surface border border-brand-border rounded-t-2xl px-6 py-4 flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-heading font-semibold text-brand-text">{projectName}</p>
                        {isDemo && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-warning/15 text-brand-warning border border-brand-warning/20 font-medium">
                            Demo output
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-brand-tertiary mt-0.5">{artifactType} · {wordCount} words · {generationTime}s</p>
                    </div>
                  </div>

                  <div className="bg-brand-base border-x border-brand-border px-6 py-3 flex flex-wrap gap-2">
                    <motion.button onClick={handleCopy} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      className="text-sm px-4 py-2 rounded-lg bg-brand-elevated hover:bg-brand-border border border-brand-border transition flex items-center gap-1.5">
                      {copied ? <><svg className="w-3.5 h-3.5 text-brand-success" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> Copied!</> : '📋 Copy'}
                    </motion.button>
                    <motion.button onClick={handleDownloadDocx} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      className="text-sm px-4 py-2 rounded-lg bg-brand-accent hover:bg-brand-accent-bright text-brand-base transition">📄 DOCX</motion.button>
                    <motion.button onClick={handleDownloadMarkdown} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      className="text-sm px-4 py-2 rounded-lg bg-brand-elevated hover:bg-brand-border border border-brand-border transition">📝 Markdown</motion.button>
                    <div className="flex gap-2 ml-auto">
                      <motion.button onClick={handleRefine} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        className="text-sm px-4 py-2 rounded-lg bg-brand-rose/10 hover:bg-brand-rose/20 text-brand-rose border border-brand-rose/20 transition">✨ Refine</motion.button>
                      <motion.button onClick={() => handleGenerate()} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        className="text-sm px-4 py-2 rounded-lg bg-brand-elevated hover:bg-brand-border border border-brand-border transition">🔄 Regenerate</motion.button>
                    </div>
                  </div>

                  <div className="bg-brand-surface border border-brand-border border-t-0 rounded-b-2xl p-6 md:p-8 prose prose-invert prose-sm max-w-none
                    prose-headings:font-heading prose-headings:text-brand-text prose-headings:font-bold
                    prose-h1:text-2xl prose-h1:border-b prose-h1:border-brand-border prose-h1:pb-3 prose-h1:mb-5
                    prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-3
                    prose-h3:text-lg prose-h3:mt-5 prose-h3:mb-2
                    prose-p:text-brand-muted prose-p:leading-relaxed
                    prose-li:text-brand-muted
                    prose-strong:text-brand-text
                    prose-table:border-collapse
                    prose-th:bg-brand-accent/10 prose-th:px-3 prose-th:py-2 prose-th:text-left prose-th:text-sm prose-th:border prose-th:border-brand-border prose-th:font-semibold
                    prose-td:px-3 prose-td:py-2 prose-td:text-sm prose-td:border prose-td:border-brand-border
                    prose-code:text-brand-accent prose-code:bg-brand-elevated prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{result}</ReactMarkdown>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty state */}
        {!result && !loading && !error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-center py-16 text-brand-tertiary">
            <div className="text-4xl mb-4">📄</div>
            <p className="text-sm">Select an artifact type, describe your project, and generate.</p>
            <p className="text-xs mt-1">Your document will appear here.</p>
          </motion.div>
        )}
      </main>

      <footer className="border-t border-brand-border/50 px-6 py-4 text-center text-xs text-brand-tertiary">
        DataPM v1.1 · Powered by Gemini AI · <Link href="/" className="text-brand-accent hover:text-brand-accent-bright transition">Home</Link>
      </footer>
    </div>
  );
}
