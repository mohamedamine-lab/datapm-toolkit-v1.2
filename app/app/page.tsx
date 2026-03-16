'use client';

import { useState, useRef, useEffect, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion, AnimatePresence } from 'framer-motion';

/* ── Logo ── */
const Logo = () => (
  <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 4C6 2.89543 6.89543 2 8 2H18L26 10V28C26 29.1046 25.1046 30 24 30H8C6.89543 30 6 29.1046 6 28V4Z" stroke="#C6F135" strokeWidth="1.5" fill="none"/>
    <path d="M18 2V10H26" stroke="#C6F135" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M11 16L15 20L21 14" stroke="#FF4D8D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="26" cy="22" r="5" fill="#0B0514" stroke="#C6F135" strokeWidth="1.5"/>
    <path d="M24 22H28M26 20V24" stroke="#C6F135" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

/* ── Types ── */
const ARTIFACT_TYPES = [
  { id: 'project-charter', name: 'Project Charter', icon: '📋', desc: 'Full charter with scope, RACI, risks, timeline', time: '~12s' },
  { id: 'kpi-framework', name: 'KPI Framework', icon: '📊', desc: 'Strategic & operational KPIs with dashboards', time: '~10s' },
  { id: 'data-specification', name: 'Data Specification', icon: '🗄️', desc: 'Data model, field specs, quality rules', time: '~14s' },
  { id: 'stakeholder-deck', name: 'Stakeholder Deck Outline', icon: '📽️', desc: 'Slide-by-slide deck with talking points', time: '~10s' },
  { id: 'data-dictionary', name: 'Data Dictionary', icon: '📖', desc: 'Field definitions, metadata & lineage', time: '~12s' },
  { id: 'migration-plan', name: 'Migration Plan', icon: '🔄', desc: 'Step-by-step migration strategy & rollback', time: '~14s' },
  { id: 'requirements-doc', name: 'Requirements Document', icon: '📝', desc: 'Functional & non-functional requirements', time: '~12s' },
];

const EXAMPLES = [
  { name: 'Customer 360 Platform', context: 'Building a unified customer data platform consolidating data from Salesforce CRM, Shopify e-commerce, Zendesk support tickets, and Google Analytics. Goal: single source of truth for customer interactions across 50K+ customers. Stakeholders: VP Marketing (Sarah Chen), Head of Sales (Tom Rivera), CTO (Alex Kim), Data Engineering Lead (Priya Patel). Timeline: 6 months starting Q2 2026. Tech stack: Snowflake, dbt, Fivetran, Looker. Budget: $200K.', artifact: 'Project Charter' },
  { name: 'E-Commerce Analytics', context: 'Creating a comprehensive analytics dashboard for RetailCo doing $50M ARR with 200K monthly customers. Data sources: Shopify, Google Ads ($500K/month), Facebook Ads ($200K/month), Stripe. Key stakeholders: CEO, Head of Growth, Finance Director. Target: reduce time-to-insight from 3 days to real-time. Using Looker on BigQuery.', artifact: 'KPI Framework' },
  { name: 'Legacy ERP Migration', context: 'Migrating from on-premise SAP ERP (ECC 6.0) to Oracle Cloud ERP. 15 years of data (~500GB across 400 tables). 200 active users. Zero tolerance for data loss (SOX compliance). Maximum cutover window: 72 hours. Budget: $500K for migration. Go-live: January 2027.', artifact: 'Migration Plan' },
];

const CONTEXT_TIPS = [
  '💡 Mention your data stack (e.g. Snowflake, dbt, Tableau)',
  '💡 Include your main stakeholder names & roles',
  '💡 Specify timeline and team size',
  '💡 Add budget or resource constraints',
  '💡 Describe current pain points or baseline metrics',
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

/* ── Quality Score ── */
function computeQuality(content: string): { score: number; label: string; color: string } {
  let s = 0;
  const wc = content.split(/\s+/).length;
  if (wc > 300) s += 20; if (wc > 600) s += 15; if (wc > 1000) s += 10;
  const headers = (content.match(/^#{1,3} /gm) || []).length;
  if (headers > 3) s += 15; if (headers > 6) s += 10;
  const tables = (content.match(/\|.*\|/g) || []).length;
  if (tables > 3) s += 15; if (tables > 10) s += 10;
  const bullets = (content.match(/^[-*] /gm) || []).length;
  if (bullets > 3) s += 5;
  s = Math.min(100, s);
  if (s >= 70) return { score: s, label: 'Excellent', color: 'text-brand-success' };
  if (s >= 40) return { score: s, label: 'Good', color: 'text-brand-accent' };
  return { score: s, label: 'Basic', color: 'text-brand-warning' };
}

/* ── Toast ── */
interface Toast { id: string; message: string; type: 'success' | 'error' | 'info' }
function ToastContainer({ toasts, onDismiss }: { toasts: Toast[]; onDismiss: (id: string) => void }) {
  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 sm:bottom-6 sm:right-6 max-sm:bottom-4 max-sm:left-4 max-sm:right-4">
      <AnimatePresence>
        {toasts.map(t => (
          <motion.div key={t.id} initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className={`px-4 py-3 rounded-xl text-sm font-medium shadow-xl backdrop-blur-xl border cursor-pointer ${
              t.type === 'success' ? 'bg-brand-success/15 border-brand-success/30 text-brand-success' :
              t.type === 'error' ? 'bg-brand-rose/15 border-brand-rose/30 text-brand-rose' :
              'bg-brand-accent/15 border-brand-accent/30 text-brand-accent'
            }`}
            onClick={() => onDismiss(t.id)}>
            {t.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

/* ── Main ── */
export default function AppPageWrapper() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-brand-base flex items-center justify-center"><div className="animate-spin h-8 w-8 border-2 border-brand-accent border-t-transparent rounded-full" /></div>}>
      <AppPage />
    </Suspense>
  );
}

function AppPage() {
  const searchParams = useSearchParams();

  // Steps: 1 = project info, 2 = choose artifact, 3 = generate & export
  const [step, setStep] = useState(1);
  const [projectName, setProjectName] = useState('');
  const [context, setContext] = useState('');
  const [artifactType, setArtifactType] = useState('Project Charter');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [error, setError] = useState('');
  const [generationTime, setGenerationTime] = useState(0);
  const [isDemo, setIsDemo] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [contextFocused, setContextFocused] = useState(false);
  const [tipIndex, setTipIndex] = useState(0);
  const resultRef = useRef<HTMLDivElement>(null);
  const editRef = useRef<HTMLTextAreaElement>(null);

  // Toast helper
  const addToast = useCallback((message: string, type: Toast['type'] = 'success') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  }, []);

  // Load from URL params (template pre-fill)
  useEffect(() => {
    const pName = searchParams.get('name');
    const pCtx = searchParams.get('context');
    const pType = searchParams.get('type');
    if (pName) setProjectName(pName);
    if (pCtx) setContext(pCtx);
    if (pType) setArtifactType(pType);
    if (pName && pCtx) setStep(2);
  }, [searchParams]);

  // Load history
  useEffect(() => {
    const saved = localStorage.getItem('datapm-history-v2');
    if (saved) { try { setHistory(JSON.parse(saved)); } catch {} }
  }, []);

  // Keyboard shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        if (step === 1 && projectName && context.length >= 50) setStep(2);
        else if (step === 2) handleGenerate();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [step, projectName, context, artifactType]);

  // Rotate context tips
  useEffect(() => {
    if (!contextFocused) return;
    const t = setInterval(() => setTipIndex(i => (i + 1) % CONTEXT_TIPS.length), 4000);
    return () => clearInterval(t);
  }, [contextFocused]);

  // Page title
  useEffect(() => {
    document.title = 'Generate Artifact — DataPM';
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
    setStep(2);
    addToast(`Loaded "${ex.name}" example`, 'info');
  };

  const handleGenerate = useCallback(async () => {
    if (!projectName || !context) return;
    if (context.length < 50) { setError('Provide at least 50 characters of context.'); return; }
    setStep(3);
    setLoading(true);
    setResult('');
    setError('');
    setIsDemo(false);
    setEditing(false);
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
      const cleanContent = data.content.replace(/\n\n> ⚠️[\s\S]*$/, '');
      setResult(cleanContent);
      setGenerationTime(Math.round((Date.now() - startTime) / 1000));
      const wc = cleanContent.split(/\s+/).length;
      saveToHistory({ id: Date.now().toString(), projectName, artifactType, content: cleanContent, context, timestamp: new Date().toISOString(), wordCount: wc });
      addToast(`✓ ${artifactType} generated in ${Math.round((Date.now() - startTime) / 1000)}s`);
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth' }), 200);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Generation failed');
      addToast('Generation failed — try again', 'error');
    }
    setLoading(false);
  }, [projectName, context, artifactType, history, addToast]);

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
      addToast('✨ Artifact refined');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Refinement failed');
      addToast('Refinement failed', 'error');
    }
    setLoading(false);
  };

  const handleCopy = (format: 'markdown' | 'plain' = 'markdown') => {
    const text = format === 'plain' ? result.replace(/[#*|_`>-]/g, '').replace(/\n{3,}/g, '\n\n') : result;
    navigator.clipboard.writeText(text);
    addToast(format === 'plain' ? '📋 Plain text copied' : '📋 Markdown copied');
  };

  const handleDownloadDocx = async () => {
    const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } = await import('docx');
    const content = editing ? editContent : result;
    const lines = content.split('\n');
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
    addToast('📄 DOCX downloaded');
  };

  const handleDownloadMarkdown = () => {
    const content = editing ? editContent : result;
    const header = `---\ntitle: "${projectName}"\ntype: "${artifactType}"\ngenerated: "${new Date().toISOString()}"\ntool: DataPM Toolkit\n---\n\n`;
    const blob = new Blob([header + content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `${projectName.replace(/\s+/g, '_')}_${artifactType.replace(/\s+/g, '_')}.md`; a.click();
    URL.revokeObjectURL(url);
    addToast('📝 Markdown downloaded');
  };

  const loadFromHistory = (entry: HistoryEntry) => {
    setProjectName(entry.projectName);
    setArtifactType(entry.artifactType);
    setContext(entry.context || '');
    setResult(entry.content);
    setStep(3);
    setShowHistory(false);
    setError('');
    setEditing(false);
  };

  const wordCount = result ? result.split(/\s+/).length : 0;
  const contextWords = context.trim().split(/\s+/).filter(Boolean).length;
  const contextQuality = contextWords < 10 ? 'low' : contextWords < 50 ? 'medium' : 'high';
  const quality = result ? computeQuality(result) : null;

  return (
    <div className="min-h-screen flex flex-col bg-brand-base">
      {/* Toast */}
      <ToastContainer toasts={toasts} onDismiss={id => setToasts(prev => prev.filter(t => t.id !== id))} />

      {/* Nav */}
      <nav className="border-b border-brand-border/50 px-4 sm:px-6 py-3 bg-brand-base/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center justify-between max-w-6xl mx-auto w-full">
          <Link href="/" className="flex items-center gap-2">
            <Logo />
            <span className="text-lg font-heading font-bold tracking-tight">
              <span className="text-brand-accent">Data</span><span className="text-brand-text">PM</span>
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <button onClick={() => setShowHistory(!showHistory)} aria-label="Toggle history"
              className="text-sm text-brand-muted hover:text-brand-text transition flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-brand-surface">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span className="hidden sm:inline">History</span> ({history.length})
            </button>
            <Link href="/templates" className="text-sm text-brand-muted hover:text-brand-text transition hidden sm:inline px-3 py-1.5 rounded-lg hover:bg-brand-surface">Templates</Link>
            <span className="text-xs text-brand-tertiary bg-brand-surface px-2.5 py-1 rounded-full border border-brand-border">v1.2</span>
          </div>
        </div>
      </nav>

      <div className="flex-1 flex max-w-6xl mx-auto w-full">
        {/* History Sidebar (desktop) */}
        <AnimatePresence>
          {showHistory && (
            <motion.aside initial={{ width: 0, opacity: 0 }} animate={{ width: 280, opacity: 1 }} exit={{ width: 0, opacity: 0 }}
              className="hidden lg:block border-r border-brand-border/50 overflow-hidden flex-shrink-0">
              <div className="w-[280px] p-4 h-full overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-heading font-semibold text-sm text-brand-text">Recent</h3>
                  {history.length > 0 && (
                    <button onClick={() => { setHistory([]); localStorage.removeItem('datapm-history-v2'); addToast('History cleared'); }}
                      className="text-xs text-brand-error hover:text-red-300 transition">Clear</button>
                  )}
                </div>
                {history.length === 0 ? (
                  <p className="text-xs text-brand-muted">No history yet. Generate your first artifact!</p>
                ) : (
                  <div className="space-y-1">
                    {history.slice(0, 15).map((h) => (
                      <button key={h.id} onClick={() => loadFromHistory(h)}
                        className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-brand-surface transition text-sm group">
                        <div className="flex items-center gap-2">
                          <span className="text-base">{ARTIFACT_TYPES.find(a => a.name === h.artifactType)?.icon || '📄'}</span>
                          <div className="min-w-0 flex-1">
                            <p className="text-brand-text truncate text-xs font-medium">{h.projectName}</p>
                            <p className="text-brand-tertiary text-[10px]">{h.artifactType} · {h.wordCount}w</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Mobile history drawer */}
        <AnimatePresence>
          {showHistory && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 z-40 bg-brand-base/80 backdrop-blur-sm" onClick={() => setShowHistory(false)}>
              <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25 }}
                className="absolute bottom-0 left-0 right-0 bg-brand-surface border-t border-brand-border rounded-t-2xl max-h-[60vh] overflow-y-auto p-5"
                onClick={e => e.stopPropagation()}>
                <div className="w-10 h-1 bg-brand-border rounded-full mx-auto mb-4" />
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-heading font-semibold text-sm text-brand-text">History</h3>
                  {history.length > 0 && (
                    <button onClick={() => { setHistory([]); localStorage.removeItem('datapm-history-v2'); }} className="text-xs text-brand-error">Clear</button>
                  )}
                </div>
                {history.length === 0 ? (
                  <p className="text-xs text-brand-muted">No history yet.</p>
                ) : (
                  <div className="space-y-1">
                    {history.slice(0, 10).map((h) => (
                      <button key={h.id} onClick={() => loadFromHistory(h)}
                        className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-brand-elevated transition text-sm">
                        <span className="text-brand-text text-xs">{h.projectName}</span>
                        <span className="text-brand-tertiary text-[10px] ml-2">{h.artifactType}</span>
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main content */}
        <main className="flex-1 px-4 sm:px-8 py-6 sm:py-8 overflow-y-auto">
          {/* Progress indicator */}
          <div className="flex items-center gap-2 mb-8">
            {[
              { n: 1, label: 'Project Info' },
              { n: 2, label: 'Choose Artifact' },
              { n: 3, label: 'Generate & Export' },
            ].map((s, i) => (
              <div key={s.n} className="flex items-center gap-2 flex-1">
                <button
                  onClick={() => { if (s.n < step || (s.n === 1) || (s.n === 2 && projectName && context.length >= 50)) setStep(s.n); }}
                  className={`flex items-center gap-2 transition-all ${step >= s.n ? 'cursor-pointer' : 'cursor-default'}`}
                >
                  {/* Step dot/number */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all flex-shrink-0 ${
                    step > s.n ? 'bg-brand-accent text-brand-base' :
                    step === s.n ? 'bg-brand-accent/20 text-brand-accent border-2 border-brand-accent' :
                    'bg-brand-surface text-brand-tertiary border border-brand-border'
                  }`}>
                    {step > s.n ? '✓' : s.n}
                  </div>
                  <span className={`text-sm font-medium hidden sm:inline transition-colors ${
                    step === s.n ? 'text-brand-text' : step > s.n ? 'text-brand-accent' : 'text-brand-tertiary'
                  }`}>{s.label}</span>
                </button>
                {i < 2 && <div className={`flex-1 h-px transition-colors ${step > s.n ? 'bg-brand-accent/40' : 'bg-brand-border'}`} />}
              </div>
            ))}
          </div>

          {/* ── STEP 1: Project Info ── */}
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
                <div className="flex items-center justify-between mb-2">
                  <h1 className="font-heading text-2xl font-bold text-brand-text">Describe your project</h1>
                  <span className="text-xs text-brand-tertiary hidden sm:inline">⌘+Enter to continue</span>
                </div>
                <p className="text-brand-muted text-sm mb-6">The more context you give, the better the output.</p>

                {/* Examples */}
                <div className="mb-6">
                  <p className="text-xs text-brand-tertiary mb-2">Try an example:</p>
                  <div className="flex flex-wrap gap-2">
                    {EXAMPLES.map(ex => (
                      <button key={ex.name} onClick={() => loadExample(ex)}
                        className="text-xs px-3 py-1.5 rounded-lg border border-brand-border bg-brand-surface text-brand-muted hover:text-brand-text hover:border-brand-accent/30 transition-all duration-150">
                        {ex.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-brand-text mb-1.5">Project Name</label>
                    <input type="text" value={projectName} onChange={e => setProjectName(e.target.value)}
                      placeholder="e.g. Customer 360 Data Platform"
                      className="w-full px-4 py-3 rounded-xl bg-brand-surface border border-brand-border text-brand-text placeholder-brand-tertiary focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent/30 transition-all duration-150" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-brand-text mb-1.5">Project Context</label>
                    <textarea rows={8} value={context} onChange={e => setContext(e.target.value)}
                      onFocus={() => setContextFocused(true)} onBlur={() => setContextFocused(false)}
                      placeholder={"e.g. Migration of our data warehouse to Snowflake, 6-month project, 3 data engineers, main stakeholder is the CTO.\n\nInclude: goals, stakeholders (names + roles), data sources, tech stack, timeline, budget..."}
                      className="w-full px-4 py-3 rounded-xl bg-brand-surface border border-brand-border text-brand-text placeholder-brand-tertiary focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent/30 resize-y transition-all duration-150" />

                    {/* Context quality & tips */}
                    <div className="flex flex-col sm:flex-row justify-between mt-2 gap-2">
                      <div className="flex items-center gap-2">
                        <div className={`h-1.5 rounded-full transition-all duration-300 ${
                          contextQuality === 'high' ? 'w-16 bg-brand-success' :
                          contextQuality === 'medium' ? 'w-10 bg-brand-warning' :
                          context.length > 0 ? 'w-5 bg-brand-rose' : 'w-5 bg-brand-border'
                        }`} />
                        <p className="text-xs text-brand-muted">
                          {contextQuality === 'high' ? '✓ Great detail — ready to generate' : contextQuality === 'medium' ? 'Good start — more detail = better output' : context.length > 0 ? 'Need more context (50+ words)' : ''}
                        </p>
                      </div>
                      <p className="text-xs text-brand-tertiary">{contextWords} words</p>
                    </div>

                    {/* Smart tips */}
                    <AnimatePresence mode="wait">
                      {contextFocused && contextWords < 50 && (
                        <motion.p key={tipIndex} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                          className="text-xs text-brand-accent/70 mt-2">
                          {CONTEXT_TIPS[tipIndex]}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <motion.button onClick={() => { if (projectName && context.length >= 50) setStep(2); }}
                  disabled={!projectName || context.length < 50}
                  whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                  className="mt-8 bg-brand-accent hover:bg-brand-accent-bright text-brand-base font-semibold px-8 py-4 rounded-xl transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed w-full text-lg shadow-lg shadow-brand-accent/20">
                  Continue — Choose Artifact →
                </motion.button>
              </motion.div>
            )}

            {/* ── STEP 2: Choose Artifact ── */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.25 }}>
                <div className="flex items-center justify-between mb-2">
                  <h1 className="font-heading text-2xl font-bold text-brand-text">Choose an artifact</h1>
                  <button onClick={() => setStep(1)} className="text-sm text-brand-muted hover:text-brand-text transition">← Back</button>
                </div>
                <p className="text-brand-muted text-sm mb-2">Generating for: <span className="text-brand-text font-medium">{projectName}</span></p>
                <p className="text-brand-tertiary text-xs mb-6">Select one, then click generate.</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                  {ARTIFACT_TYPES.map(a => (
                    <motion.button key={a.id} onClick={() => setArtifactType(a.name)}
                      whileHover={{ scale: 1.02, transition: { duration: 0.15 } }}
                      whileTap={{ scale: 0.98 }}
                      className={`text-left p-5 rounded-xl border transition-all duration-200 ${
                        artifactType === a.name
                          ? 'border-brand-accent/50 bg-brand-accent/10 ring-1 ring-brand-accent/20'
                          : 'border-brand-border bg-brand-surface hover:border-brand-border-bright hover:bg-brand-elevated'
                      }`}>
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{a.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium font-heading text-brand-text">{a.name}</span>
                            {artifactType === a.name && (
                              <svg className="w-4 h-4 text-brand-accent flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            )}
                          </div>
                          <p className="text-xs text-brand-muted mt-1 leading-relaxed">{a.desc}</p>
                          <p className="text-[10px] text-brand-tertiary mt-1.5">{a.time}</p>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>

                <motion.button onClick={handleGenerate} disabled={loading}
                  whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                  className="bg-brand-accent hover:bg-brand-accent-bright text-brand-base font-semibold px-8 py-4 rounded-xl transition-all duration-150 disabled:opacity-40 w-full text-lg shadow-lg shadow-brand-accent/20 relative overflow-hidden">
                  {!loading && <div className="absolute inset-0 bg-brand-accent/20 rounded-xl animate-glow-pulse" />}
                  <span className="relative z-10">Generate {artifactType}</span>
                </motion.button>
              </motion.div>
            )}

            {/* ── STEP 3: Generate & Export ── */}
            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.25 }}>
                {/* Loading */}
                {loading && (
                  <div className="mb-8">
                    <div className="flex items-center gap-3 mb-6">
                      <svg className="animate-spin h-5 w-5 text-brand-accent" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
                      <div>
                        <span className="text-brand-accent font-medium text-sm">Generating your {artifactType}...</span>
                        <p className="text-brand-tertiary text-xs mt-0.5">This usually takes 10-15 seconds</p>
                      </div>
                    </div>
                    <div className="bg-brand-surface border border-brand-border rounded-2xl p-6">
                      <div className="space-y-3">
                        {[75, 100, 85, 65, 90, 70, 95].map((w, i) => (
                          <motion.div key={i} className="h-4 bg-brand-elevated rounded" style={{ width: `${w}%` }}
                            animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.15 }} />
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Error */}
                {error && !loading && (
                  <div className="mb-8 bg-brand-rose/5 border border-brand-rose/20 rounded-xl p-5">
                    <div className="flex items-start gap-3">
                      <span className="text-brand-rose text-lg">⚠️</span>
                      <div>
                        <p className="text-brand-rose font-medium text-sm">Generation failed</p>
                        <p className="text-brand-rose/60 text-sm mt-1">{error}</p>
                        <button onClick={handleGenerate} className="text-sm text-brand-rose hover:text-red-300 underline mt-2">Retry</button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Result */}
                {result && !loading && (
                  <div ref={resultRef}>
                    {/* Header bar */}
                    <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="font-heading font-semibold text-lg text-brand-text">{projectName}</h2>
                          {isDemo && <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-warning/15 text-brand-warning border border-brand-warning/20">Demo</span>}
                        </div>
                        <p className="text-xs text-brand-tertiary">{artifactType} · {wordCount} words · {generationTime}s</p>
                      </div>
                      {quality && (
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-16 bg-brand-surface rounded-full overflow-hidden">
                            <div className={`h-full rounded-full transition-all ${quality.score >= 70 ? 'bg-brand-success' : quality.score >= 40 ? 'bg-brand-accent' : 'bg-brand-warning'}`}
                              style={{ width: `${quality.score}%` }} />
                          </div>
                          <span className={`text-xs font-medium ${quality.color}`}>Quality: {quality.label}</span>
                        </div>
                      )}
                    </div>

                    {/* Action bar */}
                    <div className="bg-brand-surface border border-brand-border rounded-t-2xl px-4 sm:px-6 py-3 flex flex-wrap gap-2">
                      <button onClick={() => handleCopy('markdown')} className="text-sm px-3 py-1.5 rounded-lg bg-brand-elevated hover:bg-brand-border border border-brand-border transition-all duration-150">📋 Copy MD</button>
                      <button onClick={() => handleCopy('plain')} className="text-sm px-3 py-1.5 rounded-lg bg-brand-elevated hover:bg-brand-border border border-brand-border transition-all duration-150">📄 Copy Text</button>
                      <button onClick={handleDownloadDocx} className="text-sm px-3 py-1.5 rounded-lg bg-brand-accent hover:bg-brand-accent-bright text-brand-base transition-all duration-150">📄 DOCX</button>
                      <button onClick={handleDownloadMarkdown} className="text-sm px-3 py-1.5 rounded-lg bg-brand-elevated hover:bg-brand-border border border-brand-border transition-all duration-150">📝 .md</button>
                      <div className="flex gap-2 sm:ml-auto">
                        <button onClick={() => { setEditing(!editing); if (!editing) setEditContent(result); }}
                          className={`text-sm px-3 py-1.5 rounded-lg border transition-all duration-150 ${editing ? 'bg-brand-accent/15 border-brand-accent/30 text-brand-accent' : 'bg-brand-elevated border-brand-border hover:bg-brand-border'}`}>
                          ✏️ {editing ? 'Preview' : 'Edit'}
                        </button>
                        <button onClick={handleRefine} className="text-sm px-3 py-1.5 rounded-lg bg-brand-rose/10 hover:bg-brand-rose/20 text-brand-rose border border-brand-rose/20 transition-all duration-150">✨ Refine</button>
                        <button onClick={handleGenerate} className="text-sm px-3 py-1.5 rounded-lg bg-brand-elevated hover:bg-brand-border border border-brand-border transition-all duration-150">🔄</button>
                      </div>
                    </div>

                    {/* Content */}
                    {editing ? (
                      <div className="border border-brand-border border-t-0 rounded-b-2xl overflow-hidden">
                        <textarea ref={editRef} value={editContent} onChange={e => setEditContent(e.target.value)}
                          className="w-full p-6 bg-brand-surface text-brand-text font-mono text-sm leading-relaxed resize-y min-h-[400px] focus:outline-none" />
                        <div className="px-6 pb-4 bg-brand-surface flex justify-end gap-2">
                          <button onClick={() => { setResult(editContent); setEditing(false); addToast('Changes saved'); }}
                            className="text-sm px-4 py-2 bg-brand-accent text-brand-base rounded-lg font-medium">Save changes</button>
                          <button onClick={() => setEditing(false)} className="text-sm px-4 py-2 bg-brand-elevated text-brand-muted rounded-lg border border-brand-border">Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-brand-surface border border-brand-border border-t-0 rounded-b-2xl p-6 md:p-8 prose prose-invert prose-sm max-w-none
                        prose-headings:font-heading prose-headings:text-brand-text prose-headings:font-bold
                        prose-h1:text-2xl prose-h1:border-b prose-h1:border-brand-border prose-h1:pb-3 prose-h1:mb-5
                        prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-3
                        prose-h3:text-lg prose-h3:mt-5 prose-h3:mb-2
                        prose-p:text-brand-muted prose-p:leading-relaxed
                        prose-li:text-brand-muted prose-strong:text-brand-text
                        prose-table:border-collapse
                        prose-th:bg-brand-accent/10 prose-th:px-3 prose-th:py-2 prose-th:text-left prose-th:text-sm prose-th:border prose-th:border-brand-border prose-th:font-semibold
                        prose-td:px-3 prose-td:py-2 prose-td:text-sm prose-td:border prose-td:border-brand-border">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{result}</ReactMarkdown>
                      </div>
                    )}

                    {/* Quality nudge */}
                    {quality && quality.score < 40 && (
                      <div className="mt-4 bg-brand-warning/5 border border-brand-warning/20 rounded-xl px-4 py-3 text-sm text-brand-warning">
                        💡 Add more project context for a richer output — try including stakeholders, tech stack, and timeline.
                      </div>
                    )}

                    {/* Bottom actions */}
                    <div className="mt-6 flex flex-col sm:flex-row gap-3">
                      <button onClick={() => setStep(2)} className="flex-1 px-6 py-3 rounded-xl border border-brand-border bg-brand-surface hover:bg-brand-elevated text-brand-text font-medium transition-all duration-150 text-sm">
                        ← Generate another artifact (same project)
                      </button>
                      <button onClick={() => { setResult(''); setProjectName(''); setContext(''); setStep(1); setError(''); setEditing(false); }}
                        className="flex-1 px-6 py-3 rounded-xl border border-brand-accent/30 bg-brand-accent/5 hover:bg-brand-accent/10 text-brand-accent font-medium transition-all duration-150 text-sm">
                        + New project
                      </button>
                    </div>

                    {/* Mobile sticky actions */}
                    <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-brand-base/90 backdrop-blur-xl border-t border-brand-border p-3 flex gap-2 z-40">
                      <button onClick={() => handleCopy('markdown')} className="flex-1 text-sm py-2.5 rounded-xl bg-brand-elevated border border-brand-border font-medium">📋 Copy</button>
                      <button onClick={handleDownloadDocx} className="flex-1 text-sm py-2.5 rounded-xl bg-brand-accent text-brand-base font-medium">📄 DOCX</button>
                    </div>
                    {/* Spacer for mobile sticky */}
                    <div className="sm:hidden h-16" />
                  </div>
                )}

                {/* Empty state for step 3 without result */}
                {!result && !loading && !error && (
                  <div className="text-center py-16 text-brand-tertiary">
                    <div className="text-4xl mb-4">📄</div>
                    <p className="text-sm">Something went wrong. Go back and try again.</p>
                    <button onClick={() => setStep(2)} className="mt-4 text-brand-accent text-sm hover:underline">← Back to artifact selection</button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      <footer className="border-t border-brand-border/50 px-6 py-4 text-center text-xs text-brand-tertiary">
        DataPM v1.2 · Powered by Gemini AI · <Link href="/" className="text-brand-accent hover:text-brand-accent-bright transition">Home</Link>
        {' · '}<Link href="/templates" className="text-brand-accent hover:text-brand-accent-bright transition">Templates</Link>
      </footer>
    </div>
  );
}
