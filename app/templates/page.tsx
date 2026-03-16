'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useEffect } from 'react';

const Logo = () => (
  <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 4C6 2.89543 6.89543 2 8 2H18L26 10V28C26 29.1046 25.1046 30 24 30H8C6.89543 30 6 29.1046 6 28V4Z" stroke="#C6F135" strokeWidth="1.5" fill="none"/>
    <path d="M18 2V10H26" stroke="#C6F135" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M11 16L15 20L21 14" stroke="#FF4D8D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="26" cy="22" r="5" fill="#0B0514" stroke="#C6F135" strokeWidth="1.5"/>
    <path d="M24 22H28M26 20V24" stroke="#C6F135" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const TEMPLATES = [
  {
    id: 'dwh-migration',
    icon: '🏗️',
    title: 'Data Warehouse Migration',
    desc: 'Migrating from a legacy data warehouse (on-prem or cloud) to a modern cloud-based solution. Covers ETL redesign, data validation, stakeholder alignment, and cutover planning.',
    tags: ['Snowflake', 'BigQuery', 'Redshift', 'dbt'],
    name: 'Data Warehouse Migration to Snowflake',
    context: 'Migrating our on-premise SQL Server data warehouse (~2TB, 300+ tables, 15 years of history) to Snowflake on AWS. Current pain points: 4-hour nightly ETL window often exceeds SLA, no real-time data, analysts wait 2+ days for new reports. Team: 2 data engineers (Sarah Kim, lead; Marco Rossi), 1 analytics engineer (Léa Dupont), 1 project manager. Key stakeholders: CTO (James Park) — executive sponsor, CFO (Linda Chen) — budget approver, Head of BI (Romain Barbier) — primary user. Tech stack: current SQL Server + SSIS → target Snowflake + dbt + Fivetran + Looker. Timeline: 6 months starting Q3 2026. Budget: €180K (infra + licensing + consulting). Compliance: GDPR (EU customer data), SOX (financial data). Go/no-go: zero data loss, <15min latency for critical dashboards, all 45 existing reports migrated.',
    artifact: 'Migration Plan',
  },
  {
    id: 'bi-dashboard',
    icon: '📊',
    title: 'BI Dashboard Rollout',
    desc: 'Rolling out a new BI platform across the organization. Includes KPI design, dashboard specs, user training, and adoption tracking.',
    tags: ['Looker', 'Tableau', 'Power BI', 'Analytics'],
    name: 'Company-Wide BI Dashboard Rollout',
    context: 'Rolling out Looker as our primary BI tool across 5 departments (Sales, Marketing, Finance, Operations, Customer Success). Currently: teams use a mix of Excel, Google Sheets, and ad-hoc SQL queries — no single source of truth. Goal: 80% self-service analytics adoption within 6 months, reduce ad-hoc data requests to the data team by 60%. Data sources: Salesforce CRM (50K contacts), HubSpot Marketing (200K contacts), Stripe billing ($15M ARR), PostgreSQL product database (3M users), Google Analytics (5M monthly events). Stakeholders: VP Data (Camille Torres) — sponsor, Head of Sales (Yuki Tanaka), CFO (Pierre Martin) — needs financial dashboards, Marketing Director (Aisha Patel) — needs campaign attribution. Team: 1 analytics engineer, 2 BI developers, 1 data analyst for training. Budget: €120K. Timeline: 4 months. Key risk: low adoption from sales team who prefer their Excel trackers.',
    artifact: 'Project Charter',
  },
  {
    id: 'data-quality',
    icon: '✅',
    title: 'Data Quality Initiative',
    desc: 'Establishing a data quality framework with monitoring, alerting, and remediation processes. Covers quality dimensions, scoring, and governance.',
    tags: ['Data Quality', 'Governance', 'Great Expectations', 'Monte Carlo'],
    name: 'Enterprise Data Quality Initiative',
    context: 'Launching a data quality program after discovering 23% of our customer records have incomplete or duplicate data, causing €2M in estimated annual revenue leakage (wrong pricing, missed renewals, failed outreach). Scope: CRM (Salesforce), ERP (SAP), product database (PostgreSQL), and marketing platform (HubSpot). Quality dimensions to track: completeness, accuracy, consistency, timeliness, uniqueness. Current state: no monitoring, issues caught manually by business users weeks after occurrence. Target: automated quality scoring across all critical data assets, <2% error rate, alerts within 15 minutes of quality degradation. Stakeholders: Chief Data Officer (Elena Vasquez) — executive sponsor, Head of Data Engineering (Thomas Müller) — implementation lead, VP Sales (David Park) — impacted by CRM quality, Legal/Compliance (Marie Laurent) — GDPR implications. Tech: dbt for transformations, Great Expectations for validation, Slack for alerts. Team: 2 data engineers, 1 data analyst. Budget: €90K. Timeline: 5 months.',
    artifact: 'KPI Framework',
  },
  {
    id: 'mdm',
    icon: '🔗',
    title: 'Master Data Management',
    desc: 'Implementing MDM across systems to create a golden record for customers, products, or other master entities. Includes matching, merging, and governance.',
    tags: ['MDM', 'Customer 360', 'Golden Record', 'Governance'],
    name: 'Customer Master Data Management Program',
    context: 'Implementing Customer MDM to create a single golden record across 6 source systems: Salesforce CRM (enterprise), HubSpot (SMB), Shopify (e-commerce), Zendesk (support), Stripe (billing), and our custom SaaS platform. Problem: same customer can exist as 3-5 different records across systems with different IDs, emails, and company names. This causes: duplicate outreach (complained by 15% of enterprise customers), incorrect billing (3 incidents/month), and unreliable customer lifetime value metrics. Scale: ~200K unique customers, ~800K total records across systems. Approach: build a matching/merging pipeline using probabilistic matching (fuzzy name + email + domain + phone), create a master customer ID, and syndicate back to source systems. Stakeholders: CEO (Robert Nguyen) — strategic priority, CTO (Alex Petrov) — technical oversight, VP Customer Success (Sophia Andersson) — primary beneficiary, Head of Sales Ops (Jean-Baptiste Moreau) — CRM data owner. Tech: Snowflake (hub), dbt (transforms), custom Python matching service, Fivetran (ingestion). Team: 3 data engineers, 1 data architect, 1 project manager. Budget: €250K. Timeline: 8 months. Success: >95% match accuracy, <1% false positive merges, all systems synced within 1 hour.',
    artifact: 'Data Specification',
  },
];

export default function TemplatesPage() {
  useEffect(() => {
    document.title = 'Project Templates — DataPM';
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-brand-base">
      {/* Nav */}
      <nav className="border-b border-brand-border/50 px-4 sm:px-6 py-3 bg-brand-base/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center justify-between max-w-5xl mx-auto w-full">
          <Link href="/" className="flex items-center gap-2">
            <Logo />
            <span className="text-lg font-heading font-bold tracking-tight">
              <span className="text-brand-accent">Data</span><span className="text-brand-text">PM</span>
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/app" className="bg-brand-accent hover:bg-brand-accent-bright text-brand-base text-sm font-semibold px-5 py-2 rounded-lg transition">
              Open App →
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-10 sm:py-16">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-brand-text mb-3">Project Templates</h1>
          <p className="text-brand-muted max-w-lg mx-auto">Start from a realistic scenario. Each template pre-fills the project context so you can generate in one click.</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-5">
          {TEMPLATES.map((t, i) => (
            <motion.div key={t.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-brand-surface border border-brand-border rounded-2xl p-6 hover:border-brand-accent/30 transition-all duration-200 group relative overflow-hidden"
            >
              <div className="absolute -top-12 -right-12 w-24 h-24 bg-brand-accent/0 group-hover:bg-brand-accent/[0.06] rounded-full blur-2xl transition-all duration-500" />

              <div className="relative">
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-3xl">{t.icon}</span>
                  <div>
                    <h3 className="font-heading font-semibold text-lg text-brand-text">{t.title}</h3>
                    <p className="text-xs text-brand-accent mt-0.5">Generates: {t.artifact}</p>
                  </div>
                </div>

                <p className="text-sm text-brand-muted leading-relaxed mb-4">{t.desc}</p>

                <div className="flex flex-wrap gap-1.5 mb-5">
                  {t.tags.map(tag => (
                    <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-brand-elevated border border-brand-border text-brand-tertiary">{tag}</span>
                  ))}
                </div>

                <Link href={`/app?name=${encodeURIComponent(t.name)}&context=${encodeURIComponent(t.context)}&type=${encodeURIComponent(t.artifact)}`}
                  className="inline-flex items-center gap-2 bg-brand-accent hover:bg-brand-accent-bright text-brand-base font-semibold px-5 py-2.5 rounded-xl transition-all duration-150 text-sm shadow-lg shadow-brand-accent/15 hover:-translate-y-0.5">
                  Use template →
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-brand-muted text-sm mb-4">Want to start from scratch?</p>
          <Link href="/app" className="inline-flex items-center gap-2 border border-brand-border hover:border-brand-accent/30 px-6 py-3 rounded-xl text-brand-text font-medium transition-all duration-150 text-sm hover:bg-brand-surface">
            Open blank workspace →
          </Link>
        </div>
      </main>

      <footer className="border-t border-brand-border/50 px-6 py-4 text-center text-xs text-brand-tertiary">
        DataPM v1.2 · <Link href="/" className="text-brand-accent hover:text-brand-accent-bright transition">Home</Link>
        {' · '}<Link href="/app" className="text-brand-accent hover:text-brand-accent-bright transition">App</Link>
      </footer>
    </div>
  );
}
