import React from 'react';
import { useIncident } from '../context/IncidentContext';

export const AiAgentsView: React.FC = () => {
  const { activeIncident, setActiveTab, setSelectedIncidentId } = useIncident();

  const isResolved = activeIncident?.status === 'resolved';

  return (
    <div className="flex flex-col w-full">
      <div className="w-full px-margin py-space-xl flex flex-col gap-space-xl">
        {/* Header Hero */}
        <div className="flex flex-col gap-space-md">
          <div className="flex flex-wrap items-center justify-between gap-space-sm">
            <div className="flex items-center gap-2">
              <span className="font-label-caps text-label-caps uppercase text-primary tracking-wider">
                AUTONOMOUS SYSTEM ARCHITECTURE
              </span>
              <span className="text-on-surface-variant font-code-telemetry text-code-telemetry">•</span>
              <span className="font-label-caps text-label-caps uppercase text-on-surface-variant tracking-wider">
                MULTI-AGENT SWARM
              </span>
            </div>
            <div className="inline-flex items-center gap-2.5 bg-surface-container-low px-3 py-1 rounded-full shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span className="font-code-telemetry text-code-telemetry text-on-surface">
                SWARM HEALTH: 100% OPERATIONAL
              </span>
              <span className="text-on-surface-variant font-code-telemetry text-code-telemetry">•</span>
              <span className="font-code-telemetry text-code-telemetry text-on-surface-variant">LATENCY: 18ms</span>
              <span className="text-on-surface-variant font-code-telemetry text-code-telemetry">•</span>
              <span className="font-code-telemetry text-code-telemetry text-primary font-medium">GUARDRAILS: ACTIVE</span>
            </div>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-lg">
            <div className="flex flex-col">
              <h1 className="font-display-hero text-display-hero text-on-surface tracking-tight leading-none">
                Four agents.
              </h1>
              <h1 className="font-display-hero text-display-hero text-primary italic font-normal tracking-tight leading-none mt-1">
                One response system.
              </h1>
            </div>
            <p className="font-body-editorial text-body-editorial text-on-surface-variant max-w-xl pb-1">
              Specialized autonomous AI agents operate in continuous synchronization to detect anomalies, isolate root causes, execute verified remediations, and document preventative safeguards.
            </p>
          </div>
        </div>

        {/* 5-Step Agent Flow */}
        <div className="bg-surface-container-low rounded-xl p-space-md shadow-sm">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-space-sm relative">
            <div
              onClick={() => setActiveTab('monitoring-system-signals')}
              className="flex-1 bg-surface-container-lowest rounded-lg p-space-sm flex flex-col gap-1 transition-all hover:bg-surface-container cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className="font-label-caps text-label-caps text-on-surface">01 // DETECT</span>
                <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
              </div>
              <div className="font-code-telemetry text-code-telemetry text-primary font-medium">14.2k evt/s</div>
              <div className="font-body-sm text-body-sm text-on-surface-variant truncate">Telemetry ingestion</div>
            </div>
            <div className="hidden lg:flex items-center justify-center text-on-surface-variant">
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </div>
            <div
              onClick={() => {
                setSelectedIncidentId('INC-8042');
                setActiveTab('incidents');
              }}
              className="flex-1 bg-surface-container-lowest rounded-lg p-space-sm flex flex-col gap-1 transition-all hover:bg-surface-container cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className="font-label-caps text-label-caps text-on-surface">02 // INVESTIGATE</span>
                <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
              </div>
              <div className="font-code-telemetry text-code-telemetry text-primary font-medium">42.8k spans</div>
              <div className="font-body-sm text-body-sm text-on-surface-variant truncate">Causal topology graph</div>
            </div>
            <div className="hidden lg:flex items-center justify-center text-on-surface-variant">
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </div>
            <div
              onClick={() => {
                setSelectedIncidentId('INC-8042');
                setActiveTab('incidents');
              }}
              className="flex-1 bg-surface-container-lowest rounded-lg p-space-sm flex flex-col gap-1 transition-all hover:bg-surface-container cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className="font-label-caps text-label-caps text-on-surface">03 // REMEDIATE</span>
                <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
              </div>
              <div className="font-code-telemetry text-code-telemetry text-secondary font-medium">HITL Gated</div>
              <div className="font-body-sm text-body-sm text-on-surface-variant truncate">Zero-downtime hotfix</div>
            </div>
            <div className="hidden lg:flex items-center justify-center text-on-surface-variant">
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </div>
            <div
              onClick={() => {
                setSelectedIncidentId('INC-8042');
                setActiveTab('incidents');
              }}
              className="flex-1 bg-surface-container-lowest rounded-lg p-space-sm flex flex-col gap-1 transition-all hover:bg-surface-container cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className="font-label-caps text-label-caps text-on-surface">04 // VERIFY</span>
                <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
              </div>
              <div className="font-code-telemetry text-code-telemetry text-primary font-medium">200 OK (p99 14ms)</div>
              <div className="font-body-sm text-body-sm text-on-surface-variant truncate">Blast-radius analysis</div>
            </div>
            <div className="hidden lg:flex items-center justify-center text-on-surface-variant">
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </div>
            <div
              onClick={() => setActiveTab('postmortems-reports')}
              className="flex-1 bg-surface-container-lowest rounded-lg p-space-sm flex flex-col gap-1 transition-all hover:bg-surface-container cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className="font-label-caps text-label-caps text-on-surface">05 // REPORT</span>
                <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
              </div>
              <div className="font-code-telemetry text-code-telemetry text-primary font-medium">Synced: Slack &amp; Jira</div>
              <div className="font-body-sm text-body-sm text-on-surface-variant truncate">Postmortem generation</div>
            </div>
          </div>
        </div>

        {/* The 4 Agent Detail Cards */}
        <div className="flex flex-col gap-space-lg">
          {/* AGENT 01: DETECTION AGENT */}
          <div className="bg-surface-container-low rounded-xl p-space-lg shadow-sm hover:shadow-md transition-all flex flex-col gap-space-md">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-space-sm">
              <div className="flex flex-col">
                <div className="flex items-center gap-space-sm">
                  <span className="font-label-caps text-label-caps bg-primary text-on-primary px-2 py-0.5 rounded">AGENT 01</span>
                  <h2 className="font-headline-md text-headline-md text-on-surface">DETECTION AGENT</h2>
                </div>
                <span className="font-body-default text-body-default text-on-surface-variant mt-1">Signal Anomaly Ingestion &amp; Edge Filter</span>
              </div>
              <div className="flex items-center gap-2 self-start bg-surface-container-highest px-3 py-1 rounded-full">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                <span className="font-label-caps text-label-caps text-on-surface">ONLINE • POLLING EVERY 500ms</span>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-md">
              <div className="lg:col-span-7 flex flex-col gap-space-sm">
                <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Core Swarm Responsibilities</span>
                <div className="flex flex-col gap-2">
                  <div className="flex items-start gap-2 bg-surface-container-lowest p-3 rounded-lg">
                    <span className="material-symbols-outlined text-[18px] text-primary mt-0.5">query_stats</span>
                    <span className="font-body-default text-body-default text-on-surface">Continuously ingests 14,280 metrics/sec across 6 Kubernetes clusters without telemetry drop.</span>
                  </div>
                  <div className="flex items-start gap-2 bg-surface-container-lowest p-3 rounded-lg">
                    <span className="material-symbols-outlined text-[18px] text-primary mt-0.5">multiline_chart</span>
                    <span className="font-body-default text-body-default text-on-surface">Zero-baseline anomaly detection via adaptive entropy thresholds and multi-dimensional variance models.</span>
                  </div>
                  <div className="flex items-start gap-2 bg-surface-container-lowest p-3 rounded-lg">
                    <span className="material-symbols-outlined text-[18px] text-primary mt-0.5">bolt</span>
                    <span className="font-body-default text-body-default text-on-surface">Dispatches verified incident alarms to Investigation Swarm in &lt;400ms with trace provenance.</span>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-5 flex flex-col justify-between gap-space-sm bg-surface-container-lowest p-space-md rounded-lg">
                <div
                  className="flex flex-col gap-2 cursor-pointer group"
                  onClick={() => {
                    setSelectedIncidentId('INC-8042');
                    setActiveTab('incidents');
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Most Recent Event</span>
                    <span className="text-xs font-code-inline text-primary opacity-0 group-hover:opacity-100 transition-opacity">View details &rarr;</span>
                  </div>
                  <div className="bg-surface-container-low group-hover:bg-surface-container p-3 rounded font-code-telemetry text-code-telemetry text-on-surface flex flex-col gap-1 transition-colors">
                    <div className="flex items-center justify-between text-on-surface-variant">
                      <span className={`font-label-caps text-label-caps ${isResolved ? 'text-primary' : 'text-error'}`}>
                        {isResolved ? 'INCIDENT RESOLVED' : 'INCIDENT TRIGGERED'}
                      </span>
                      <span>12:05:14 UTC</span>
                    </div>
                    <div className="text-on-surface font-medium mt-1">INC-8042 (Payment API Gateway Degradation)</div>
                    <div className="text-on-surface-variant text-body-sm">
                      {isResolved
                        ? 'Normalized: Error Rate 0.8%, Latency 180ms'
                        : 'P99 latency spiked past 420ms (Threshold: 200ms)'}
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 bg-surface-container-lowest">
                  <span className="font-code-inline text-code-inline text-on-surface-variant">Model: Gemini 3.8 Flash Edge</span>
                  <span className="font-code-inline text-code-inline text-primary">Precision: 99.4%</span>
                  <span className="font-code-inline text-code-inline text-on-surface">Drift: 0.00%</span>
                </div>
              </div>
            </div>
          </div>

          {/* AGENT 02: INVESTIGATION AGENT */}
          <div className="bg-surface-container-low rounded-xl p-space-lg shadow-sm hover:shadow-md transition-all flex flex-col gap-space-md">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-space-sm">
              <div className="flex flex-col">
                <div className="flex items-center gap-space-sm">
                  <span className="font-label-caps text-label-caps bg-primary text-on-primary px-2 py-0.5 rounded">AGENT 02</span>
                  <h2 className="font-headline-md text-headline-md text-on-surface">INVESTIGATION AGENT</h2>
                </div>
                <span className="font-body-default text-body-default text-on-surface-variant mt-1">Vector Causal Correlator &amp; Topology Graph</span>
              </div>
              <div className="flex items-center gap-2 self-start bg-surface-container-highest px-3 py-1 rounded-full">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                <span className="font-label-caps text-label-caps text-on-surface">ONLINE • DEEP REASONING READY</span>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-md">
              <div className="lg:col-span-7 flex flex-col gap-space-sm">
                <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Core Swarm Responsibilities</span>
                <div className="flex flex-col gap-2">
                  <div className="flex items-start gap-2 bg-surface-container-lowest p-3 rounded-lg">
                    <span className="material-symbols-outlined text-[18px] text-primary mt-0.5">hub</span>
                    <span className="font-body-default text-body-default text-on-surface">Correlates distributed traces across upstream/downstream services (42,810 spans analyzed).</span>
                  </div>
                  <div className="flex items-start gap-2 bg-surface-container-lowest p-3 rounded-lg">
                    <span className="material-symbols-outlined text-[18px] text-primary mt-0.5">commit</span>
                    <span className="font-body-default text-body-default text-on-surface">Evaluates git commit hashes against config changes and schema migrations in the last 24h.</span>
                  </div>
                  <div className="flex items-start gap-2 bg-surface-container-lowest p-3 rounded-lg">
                    <span className="material-symbols-outlined text-[18px] text-primary mt-0.5">psychology</span>
                    <span className="font-body-default text-body-default text-on-surface">Synthesizes empirical evidence into deterministic root cause hypotheses with confidence bounds.</span>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-5 flex flex-col justify-between gap-space-sm bg-surface-container-lowest p-space-md rounded-lg">
                <div
                  className="flex flex-col gap-2 cursor-pointer group"
                  onClick={() => {
                    setSelectedIncidentId('INC-8042');
                    setActiveTab('incidents');
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Most Recent Diagnostic</span>
                    <span className="text-xs font-code-inline text-primary opacity-0 group-hover:opacity-100 transition-opacity">Inspect trace &rarr;</span>
                  </div>
                  <div className="bg-surface-container-low group-hover:bg-surface-container p-3 rounded font-code-telemetry text-code-telemetry text-on-surface flex flex-col gap-1 transition-colors">
                    <div className="flex items-center justify-between text-on-surface-variant">
                      <span className="font-label-caps text-label-caps text-primary">ROOT CAUSE DETERMINED</span>
                      <span>12:05:17 UTC</span>
                    </div>
                    <div className="text-on-surface font-medium mt-1">PostgreSQL connection pool exhaustion</div>
                    <div className="text-primary text-body-sm font-semibold">94% confidence • Isolated in 3.4 seconds</div>
                  </div>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 bg-surface-container-lowest">
                  <span className="font-code-inline text-code-inline text-on-surface-variant">Model: Gemini 3.8 Flash SRE</span>
                  <span className="font-code-inline text-code-inline text-primary">Causal Depth: 8 tiers</span>
                  <span className="font-code-inline text-code-inline text-on-surface">False Positives: &lt;0.1%</span>
                </div>
              </div>
            </div>
          </div>

          {/* AGENT 03: REMEDIATION AGENT */}
          <div className="bg-surface-container-low rounded-xl p-space-lg shadow-sm hover:shadow-md transition-all flex flex-col gap-space-md">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-space-sm">
              <div className="flex flex-col">
                <div className="flex items-center gap-space-sm">
                  <span className="font-label-caps text-label-caps bg-primary text-on-primary px-2 py-0.5 rounded">AGENT 03</span>
                  <h2 className="font-headline-md text-headline-md text-on-surface">REMEDIATION AGENT</h2>
                </div>
                <span className="font-body-default text-body-default text-on-surface-variant mt-1">Dynamic Patch Synthesizer &amp; Guardrail Enforcer</span>
              </div>
              <div className="flex items-center gap-2 self-start bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full">
                <span className="w-2 h-2 rounded-full bg-secondary"></span>
                <span className="font-label-caps text-label-caps">ONLINE • HUMAN-IN-THE-LOOP REQUIRED</span>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-md">
              <div className="lg:col-span-7 flex flex-col gap-space-sm">
                <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Core Swarm Responsibilities</span>
                <div className="flex flex-col gap-2">
                  <div className="flex items-start gap-2 bg-surface-container-lowest p-3 rounded-lg">
                    <span className="material-symbols-outlined text-[18px] text-primary mt-0.5">terminal</span>
                    <span className="font-body-default text-body-default text-on-surface">Formulates zero-downtime hot-patches across Terraform, Kubernetes ConfigMaps, and Helm values.</span>
                  </div>
                  <div className="flex items-start gap-2 bg-surface-container-lowest p-3 rounded-lg">
                    <span className="material-symbols-outlined text-[18px] text-primary mt-0.5">security</span>
                    <span className="font-body-default text-body-default text-on-surface">Computes blast-radius score &amp; generates deterministic 1-click rollback runbooks prior to execution.</span>
                  </div>
                  <div className="flex items-start gap-2 bg-surface-container-lowest p-3 rounded-lg">
                    <span className="material-symbols-outlined text-[18px] text-primary mt-0.5">verified_user</span>
                    <span className="font-body-default text-body-default text-on-surface">Enforces mandatory human-in-the-loop sign-off before production mutations are staged or committed.</span>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-5 flex flex-col justify-between gap-space-sm bg-surface-container-lowest p-space-md rounded-lg">
                <div
                  className="flex flex-col gap-2 cursor-pointer group"
                  onClick={() => {
                    setSelectedIncidentId('INC-8042');
                    setActiveTab('incidents');
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Validated Patch Artifact</span>
                    <span className="text-xs font-code-inline text-secondary opacity-0 group-hover:opacity-100 transition-opacity">Review patch &rarr;</span>
                  </div>
                  <div className="bg-surface-container-low group-hover:bg-surface-container p-3 rounded font-code-telemetry text-code-telemetry text-on-surface flex flex-col gap-1 transition-colors">
                    <div className="flex items-center justify-between text-on-surface-variant">
                      <span className="font-label-caps text-label-caps text-secondary">HOT-PATCH SYNTHESIZED</span>
                      <span>12:05:22 UTC</span>
                    </div>
                    <div className="text-on-surface font-medium mt-1 font-code-inline text-code-inline bg-surface-container-highest p-1.5 rounded">
                      max_connections 50 -&gt; 100
                    </div>
                    <div className="text-on-surface-variant text-body-sm">Dynamically applied to RDS Parameter Group 'rds-prod-pg15'</div>
                  </div>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 bg-surface-container-lowest">
                  <span className="font-code-inline text-code-inline text-on-surface">Safety Rating: Tier 1</span>
                  <span className="font-code-inline text-code-inline text-primary">Dry-run: Clean</span>
                  <span className="font-code-inline text-code-inline text-on-surface-variant">Rollback: Instant 1-click</span>
                </div>
              </div>
            </div>
          </div>

          {/* AGENT 04: REPORT AGENT */}
          <div className="bg-surface-container-low rounded-xl p-space-lg shadow-sm hover:shadow-md transition-all flex flex-col gap-space-md">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-space-sm">
              <div className="flex flex-col">
                <div className="flex items-center gap-space-sm">
                  <span className="font-label-caps text-label-caps bg-primary text-on-primary px-2 py-0.5 rounded">AGENT 04</span>
                  <h2 className="font-headline-md text-headline-md text-on-surface">REPORT AGENT</h2>
                </div>
                <span className="font-body-default text-body-default text-on-surface-variant mt-1">Synthesis Engine &amp; Systemic Hardening</span>
              </div>
              <div className="flex items-center gap-2 self-start bg-surface-container-highest px-3 py-1 rounded-full">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                <span className="font-label-caps text-label-caps text-on-surface">ONLINE • CONTINUOUS LEARNING</span>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-md">
              <div className="lg:col-span-7 flex flex-col gap-space-sm">
                <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Core Swarm Responsibilities</span>
                <div className="flex flex-col gap-2">
                  <div className="flex items-start gap-2 bg-surface-container-lowest p-3 rounded-lg">
                    <span className="material-symbols-outlined text-[18px] text-primary mt-0.5">description</span>
                    <span className="font-body-default text-body-default text-on-surface">Automatically documents end-to-end incident chronology with verified UTC atomic timestamps.</span>
                  </div>
                  <div className="flex items-start gap-2 bg-surface-container-lowest p-3 rounded-lg">
                    <span className="material-symbols-outlined text-[18px] text-primary mt-0.5">calculate</span>
                    <span className="font-body-default text-body-default text-on-surface">Calculates precise business impact ($0 chargeback safety verified, 14,200 affected requests).</span>
                  </div>
                  <div className="flex items-start gap-2 bg-surface-container-lowest p-3 rounded-lg">
                    <span className="material-symbols-outlined text-[18px] text-primary mt-0.5">rule</span>
                    <span className="font-body-default text-body-default text-on-surface">Generates preventative Jira tickets, alerting rules, and regression CI/CD integration gate tests.</span>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-5 flex flex-col justify-between gap-space-sm bg-surface-container-lowest p-space-md rounded-lg">
                <div
                  className="flex flex-col gap-2 cursor-pointer group"
                  onClick={() => {
                    setActiveTab('postmortems-reports');
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Generated Postmortem Artifact</span>
                    <span className="text-xs font-code-inline text-primary opacity-0 group-hover:opacity-100 transition-opacity">Read report &rarr;</span>
                  </div>
                  <div className="bg-surface-container-low group-hover:bg-surface-container p-3 rounded font-code-telemetry text-code-telemetry text-on-surface flex flex-col gap-1 transition-colors">
                    <div className="flex items-center justify-between text-on-surface-variant">
                      <span className="font-label-caps text-label-caps text-primary">POSTMORTEM READY</span>
                      <span>12:07:02 UTC</span>
                    </div>
                    <div className="text-on-surface font-medium mt-1">INC-8042-Summary.md authored</div>
                    <div className="text-on-surface-variant text-body-sm">Synced to Slack channel #incident-response &amp; Jira INFRA-9912</div>
                  </div>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 bg-surface-container-lowest">
                  <span className="font-code-inline text-code-inline text-on-surface">Synthesis Speed: 1.2s</span>
                  <span className="font-code-inline text-code-inline text-primary">Format: Markdown / PDF</span>
                  <span className="font-code-inline text-code-inline text-on-surface-variant">Sync: Slack &amp; Jira</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Bottom Governance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md pt-space-md">
          <div className="bg-surface-container-low rounded-xl p-space-md flex flex-col gap-2 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">policy</span>
              <span className="font-headline-sm text-headline-sm text-on-surface">Policy Engine</span>
            </div>
            <p className="font-body-default text-body-default text-on-surface-variant">
              Non-destructive observations and telemetry analyses are fully automated. All stateful production mutations strictly require senior SRE approval before application.
            </p>
            <div className="mt-2 flex items-center gap-1 font-label-caps text-label-caps text-primary">
              <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
              ZERO UNAUTHORIZED MUTATIONS
            </div>
          </div>
          <div className="bg-surface-container-low rounded-xl p-space-md flex flex-col gap-2 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">lock_reset</span>
              <span className="font-headline-sm text-headline-sm text-on-surface">Audit Trail</span>
            </div>
            <p className="font-body-default text-body-default text-on-surface-variant">
              Every agent prompt, reasoning step, dry-run simulation, and operator authorization is signed with SHA-256 cryptographic provenance for complete regulatory compliance.
            </p>
            <div className="mt-2 flex items-center gap-1 font-code-inline text-code-inline text-on-surface-variant">
              SIG: 0x9b4f...a18e (VERIFIED)
            </div>
          </div>
          <div className="bg-surface-container-low rounded-xl p-space-md flex flex-col gap-2 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">engineering</span>
              <span className="font-headline-sm text-headline-sm text-on-surface">Human Oversight</span>
            </div>
            <p className="font-body-default text-body-default text-on-surface-variant">
              Maya Lin (Lead SRE) is currently active as primary on-call gatekeeper. Multi-agent decisions defer to manual command override at any millisecond.
            </p>
            <div className="mt-2 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-primary"></span>
              <span className="font-body-sm text-body-sm text-on-surface font-medium">Maya Lin (On-Call Primary)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
