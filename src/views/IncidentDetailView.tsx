import React, { useState } from 'react';
import { useIncident } from '../context/IncidentContext';

export const IncidentDetailView: React.FC = () => {
  const {
    activeIncident,
    investigationStep,
    investigationProgressText,
    isInvestigating,
    startInvestigation,
    isExecutingRemediation,
    executionStepIndex,
    approveAndExecute,
    isGeneratingReport,
    reportProgressText,
    generateReportForIncident,
    setActiveTab,
    setSelectedReportId,
    error,
    isAutonomousDemoRunning,
    runAutonomousDemo,
  } = useIncident();

  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [logFilter, setLogFilter] = useState<'ALL' | 'INFO' | 'WARN' | 'ERROR'>('ALL');
  const [logQuery, setLogQuery] = useState('');

  if (!activeIncident) {
    return (
      <div className="p-margin text-center">
        <p className="font-headline-sm text-headline-sm text-on-surface">No incident selected</p>
        <button
          onClick={() => setActiveTab('overview')}
          className="mt-4 px-4 py-2 bg-primary text-on-primary rounded text-xs font-label-caps"
        >
          Return to Overview
        </button>
      </div>
    );
  }

  const isResolved = activeIncident.status === 'resolved';
  const hasAnalysis = Boolean(activeIncident.analysis);
  const isPendingApproval = hasAnalysis && !activeIncident.approvalGranted && !isResolved;

  const filteredLogs = activeIncident.logs.filter((log) => {
    if (logFilter !== 'ALL') {
      if (!log.includes(` ${logFilter} `)) return false;
    }
    if (logQuery) {
      if (!log.toLowerCase().includes(logQuery.toLowerCase())) return false;
    }
    return true;
  });

  return (
    <div className="flex flex-col w-full px-margin py-space-xl gap-space-xl">
      {/* Breadcrumb & Top Bar */}
      <div className="flex flex-col gap-space-sm">
        <div className="flex items-center gap-2 font-code-telemetry text-code-telemetry text-on-surface-variant">
          <button onClick={() => setActiveTab('overview')} className="hover:text-primary">
            Overview
          </button>
          <span>/</span>
          <button onClick={() => setActiveTab('incidents')} className="hover:text-primary">
            Incidents
          </button>
          <span>/</span>
          <span className="text-on-surface font-semibold">{activeIncident.id}</span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
          <div className="flex flex-col">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="font-headline-lg text-headline-lg text-on-surface font-bold">
                {activeIncident.name}
              </h1>
              <span
                className={`font-label-caps text-label-caps px-2.5 py-1 rounded ${
                  isResolved
                    ? 'bg-primary-container text-on-primary-container'
                    : activeIncident.severity === 'critical'
                    ? 'bg-error-container text-error'
                    : 'bg-secondary-container text-secondary'
                }`}
              >
                {isResolved ? 'RESOLVED' : activeIncident.severity.toUpperCase()}
              </span>
              <span className="font-label-caps text-label-caps bg-surface-container-high px-2.5 py-1 rounded text-on-surface-variant">
                TARGET: {activeIncident.service}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1 text-on-surface-variant font-code-telemetry text-code-telemetry">
              <span>Detected at {activeIncident.createdAt}</span>
              <span>•</span>
              <span>Version: {activeIncident.recentDeployment.version}</span>
              <span>•</span>
              <span>Commit: {activeIncident.recentDeployment.commit}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!hasAnalysis && !isInvestigating && !isResolved && (
              <>
                <button
                  onClick={runAutonomousDemo}
                  disabled={isAutonomousDemoRunning}
                  className="bg-surface-container-highest hover:bg-surface-container text-on-surface px-3.5 py-2 rounded text-xs font-label-caps flex items-center gap-1.5 transition-all border border-outline-variant"
                >
                  <span className="material-symbols-outlined text-[16px] text-primary">play_arrow</span>
                  Autonomous Demo Flow
                </button>
                <button
                  onClick={() => startInvestigation(activeIncident.id)}
                  className="bg-primary text-on-primary hover:bg-primary-container px-4 py-2 rounded text-xs font-label-caps flex items-center gap-1.5 transition-all shadow-sm"
                >
                  <span className="material-symbols-outlined text-[16px]">psychology</span>
                  Start AI Investigation
                </button>
              </>
            )}

            {isResolved && activeIncident.postmortemId && (
              <button
                onClick={() => {
                  setSelectedReportId(activeIncident.postmortemId || null);
                  setActiveTab('postmortems-reports');
                }}
                className="bg-primary text-on-primary hover:bg-primary-container px-4 py-2 rounded text-xs font-label-caps flex items-center gap-1.5 transition-all shadow-sm"
              >
                <span className="material-symbols-outlined text-[16px]">description</span>
                View Postmortem Report
              </button>
            )}
          </div>
        </div>
      </div>

      {/* KPI Metrics Dashboard Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-space-md">
        <div className="bg-surface-container-low p-space-md rounded-xl border border-outline-variant/60">
          <span className="font-label-caps text-label-caps text-on-surface-variant">Error Rate</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span
              className={`font-headline-md text-headline-md font-bold tracking-tight ${
                activeIncident.metrics.errorRate > 2 ? 'text-error' : 'text-primary'
              }`}
            >
              {activeIncident.metrics.errorRate}%
            </span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              {isResolved ? 'Recovered' : 'SLA < 1.0%'}
            </span>
          </div>
        </div>

        <div className="bg-surface-container-low p-space-md rounded-xl border border-outline-variant/60">
          <span className="font-label-caps text-label-caps text-on-surface-variant">P99 Latency</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span
              className={`font-headline-md text-headline-md font-bold tracking-tight ${
                activeIncident.metrics.latency > 1 && activeIncident.metrics.latencyUnit === 's'
                  ? 'text-error'
                  : 'text-on-surface'
              }`}
            >
              {activeIncident.metrics.latency}
              {activeIncident.metrics.latencyUnit}
            </span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              {isResolved ? 'Normal (180ms)' : 'Target < 250ms'}
            </span>
          </div>
        </div>

        <div className="bg-surface-container-low p-space-md rounded-xl border border-outline-variant/60">
          <span className="font-label-caps text-label-caps text-on-surface-variant">CPU Utilization</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="font-headline-md text-headline-md font-bold tracking-tight text-on-surface">
              {activeIncident.metrics.cpu}%
            </span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">Pod Cluster</span>
          </div>
        </div>

        <div className="bg-surface-container-low p-space-md rounded-xl border border-outline-variant/60">
          <span className="font-label-caps text-label-caps text-on-surface-variant">DB Connection Pool</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span
              className={`font-headline-md text-headline-md font-bold tracking-tight ${
                activeIncident.metrics.databaseConnections.startsWith('50/50')
                  ? 'text-error'
                  : 'text-primary'
              }`}
            >
              {activeIncident.metrics.databaseConnections}
            </span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              {isResolved ? 'Headroom: 58%' : 'Saturated'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Investigation & Remediation Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
        {/* Left Column: AI Investigation & Remediation (8 Cols) */}
        <div className="lg:col-span-8 flex flex-col gap-space-lg">
          {/* STEP 3: Animated Investigation Loading State */}
          {isInvestigating && (
            <div className="bg-surface-container-low rounded-xl p-space-lg border border-primary/40 shadow-sm flex flex-col gap-space-md animate-pulse">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary animate-ping"></span>
                  <span className="font-label-caps text-label-caps text-primary">
                    AI INVESTIGATION IN PROGRESS
                  </span>
                </div>
                <span className="font-code-telemetry text-code-telemetry text-on-surface-variant">
                  Gemini 3.8 Flash • Agent 02
                </span>
              </div>

              <div className="flex flex-col gap-2 my-2">
                <div className="font-headline-sm text-headline-sm text-on-surface font-medium">
                  {investigationProgressText}
                </div>
                <div className="w-full bg-surface-container-highest rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-500"
                    style={{
                      width:
                        investigationStep === 'analyzing_logs'
                          ? '20%'
                          : investigationStep === 'correlating_metrics'
                          ? '40%'
                          : investigationStep === 'checking_deployments'
                          ? '60%'
                          : investigationStep === 'identifying_patterns'
                          ? '80%'
                          : '95%',
                    }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-xs font-code-inline text-on-surface-variant">
                <div className={investigationStep === 'analyzing_logs' ? 'text-primary font-bold' : ''}>
                  01 Logs
                </div>
                <div className={investigationStep === 'correlating_metrics' ? 'text-primary font-bold' : ''}>
                  02 Metrics
                </div>
                <div className={investigationStep === 'checking_deployments' ? 'text-primary font-bold' : ''}>
                  03 Deploys
                </div>
                <div className={investigationStep === 'identifying_patterns' ? 'text-primary font-bold' : ''}>
                  04 Patterns
                </div>
                <div className={investigationStep === 'finding_root_cause' ? 'text-primary font-bold' : ''}>
                  05 Root Cause
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Root Cause Identified Card */}
          {hasAnalysis && !isInvestigating && (
            <div className="bg-surface-container-low rounded-xl p-space-lg border border-outline-variant shadow-sm flex flex-col gap-space-md">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-sm border-b border-outline-variant/60 pb-space-sm">
                <div className="flex items-center gap-space-sm">
                  <span className="font-label-caps text-label-caps bg-primary text-on-primary px-2 py-0.5 rounded">
                    ROOT CAUSE IDENTIFIED
                  </span>
                  <span className="font-body-sm text-body-sm text-primary font-semibold">
                    {activeIncident.analysis?.confidence}% confidence
                  </span>
                </div>
                <span className="font-code-telemetry text-code-telemetry text-on-surface-variant">
                  Causal graph depth: 8 tiers • Isolated in 3.4s
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <h2 className="font-headline-md text-headline-md text-on-surface font-semibold">
                  {activeIncident.analysis?.rootCause}
                </h2>
                <p className="font-body-default text-body-default text-on-surface-variant">
                  {activeIncident.analysis?.impact}
                </p>
              </div>

              {/* Evidence list */}
              <div className="flex flex-col gap-2 mt-1">
                <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
                  Correlated Telemetry Evidence
                </span>
                <div className="flex flex-col gap-2">
                  {activeIncident.analysis?.evidence.map((ev, idx) => (
                    <div
                      key={idx}
                      className="bg-surface-container-lowest p-3 rounded-lg flex items-start gap-2 text-body-sm text-on-surface"
                    >
                      <span className="material-symbols-outlined text-primary text-[18px] mt-0.5">
                        check_circle
                      </span>
                      <span>{ev}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 5 & 6: Recommended Remediation Card (Human-in-the-Loop) */}
          {hasAnalysis && !isResolved && (
            <div className="bg-surface-container-low rounded-xl p-space-lg border-l-4 border-l-secondary border-t border-r border-b border-outline-variant shadow-sm flex flex-col gap-space-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-label-caps text-label-caps bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded">
                    RECOMMENDED REMEDIATION
                  </span>
                  <span className="font-code-inline text-code-inline text-secondary font-medium">
                    Risk: {activeIncident.analysis?.recommendedAction.risk.toUpperCase()}
                  </span>
                </div>
                <span className="font-code-telemetry text-code-telemetry text-on-surface-variant">
                  Est. Recovery: {activeIncident.analysis?.recommendedAction.estimatedRecovery}
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                  {activeIncident.analysis?.recommendedAction.title}
                </h3>
                <p className="font-body-default text-body-default text-on-surface-variant">
                  {activeIncident.analysis?.recommendedAction.reason ||
                    'Scale database max_connections pool dynamically to alleviate client acquisition timeouts.'}
                </p>
              </div>

              {/* Mutation Specification Monospace Block */}
              <div className="bg-surface-container-lowest p-3.5 rounded-lg border border-outline-variant/60 flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs font-label-caps text-on-surface-variant">
                  <span>PROPOSED PRODUCTION MUTATION</span>
                  <span>RDS PARAMETER GROUP 'rds-prod-pg15'</span>
                </div>
                <div className="font-code-telemetry text-code-telemetry bg-surface-container-highest p-2.5 rounded text-on-surface">
                  <span className="text-secondary font-bold">MUTATION:</span> max_connections{' '}
                  <span className="line-through text-error">50</span> -&gt;{' '}
                  <span className="text-primary font-bold">100</span>
                </div>
                <div className="flex flex-wrap items-center justify-between text-xs font-code-inline text-on-surface-variant pt-1">
                  <span>Zero-downtime hot-patch</span>
                  <span className="text-primary font-medium">Dry-run: Clean (0 conflicts)</span>
                  <span>Rollback: Instant 1-click</span>
                </div>
              </div>

              {/* Execution Progress States (STEP 7) */}
              {isExecutingRemediation && (
                <div className="bg-surface-container-highest/80 p-4 rounded-lg flex flex-col gap-3">
                  <div className="flex items-center justify-between font-label-caps text-label-caps text-secondary">
                    <span>EXECUTING VERIFIED HOT-PATCH</span>
                    <span className="animate-spin material-symbols-outlined text-[16px]">sync</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    {[
                      'Updating RDS Parameter Group configuration (50 -> 100)',
                      'Restarting affected database connection pool workers',
                      'Checking health & connectivity probes',
                      'Monitoring recovery metrics',
                    ].map((stepLabel, idx) => {
                      const isDone = idx < executionStepIndex;
                      const isCurrent = idx === executionStepIndex;
                      return (
                        <div
                          key={idx}
                          className={`flex items-center gap-2 text-xs font-code-telemetry ${
                            isDone
                              ? 'text-primary font-medium'
                              : isCurrent
                              ? 'text-on-surface font-bold animate-pulse'
                              : 'text-on-surface-variant'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[16px]">
                            {isDone ? 'check_circle' : isCurrent ? 'hourglass_top' : 'radio_button_unchecked'}
                          </span>
                          <span>{stepLabel}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Human-in-the-Loop Gate CTA */}
              {!isExecutingRemediation && isPendingApproval && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-space-sm pt-2 border-t border-outline-variant/60">
                  <div className="flex items-center gap-2 text-xs font-body-sm text-on-surface-variant">
                    <span className="material-symbols-outlined text-secondary text-[18px]">gavel</span>
                    <span>Human authorization required: Maya Lin (Lead SRE)</span>
                  </div>
                  <button
                    onClick={() => setShowApprovalModal(true)}
                    className="w-full sm:w-auto px-6 py-2.5 rounded bg-primary text-on-primary hover:bg-primary-container font-label-caps text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
                  >
                    <span className="material-symbols-outlined text-[16px]">verified</span>
                    APPROVE &amp; EXECUTE
                  </button>
                </div>
              )}
            </div>
          )}

          {/* STEP 8 & 9: Recovery Section (Side-by-side Before vs After metrics) */}
          {isResolved && (
            <div className="bg-surface-container-low rounded-xl p-space-lg border border-primary/40 shadow-sm flex flex-col gap-space-md">
              <div className="flex items-center justify-between border-b border-outline-variant/60 pb-space-sm">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[22px]">verified</span>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                    Recovery Verification: RECOVERED
                  </h3>
                </div>
                <span className="font-label-caps text-label-caps bg-primary-container text-on-primary-container px-2 py-0.5 rounded">
                  INCIDENT RESOLVED
                </span>
              </div>

              <p className="font-body-default text-body-default text-on-surface-variant">
                The hotfix was applied with zero downtime. Active synthetic probes confirm error rates dropped below 1.0% and latency normalized.
              </p>

              {/* Before vs After Telemetry Comparison Table */}
              <div className="bg-surface-container-lowest rounded-lg p-space-md border border-outline-variant/60 overflow-x-auto">
                <table className="w-full text-left font-code-telemetry text-code-telemetry">
                  <thead>
                    <tr className="border-b border-outline-variant/60 text-xs font-label-caps text-on-surface-variant">
                      <th className="pb-2">Metric</th>
                      <th className="pb-2 text-error">Before Mitigation</th>
                      <th className="pb-2 text-primary">After Mitigation</th>
                      <th className="pb-2">Target SLA</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/40">
                    <tr>
                      <td className="py-2.5 font-medium text-on-surface">Error Rate</td>
                      <td className="py-2.5 text-error font-bold">38.0%</td>
                      <td className="py-2.5 text-primary font-bold">0.8%</td>
                      <td className="py-2.5 text-on-surface-variant">&lt; 1.0%</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-medium text-on-surface">P99 Latency</td>
                      <td className="py-2.5 text-error font-bold">8.7s (8,700ms)</td>
                      <td className="py-2.5 text-primary font-bold">180ms</td>
                      <td className="py-2.5 text-on-surface-variant">&lt; 250ms</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-medium text-on-surface">DB Connection Pool</td>
                      <td className="py-2.5 text-error font-bold">50 / 50 (100%)</td>
                      <td className="py-2.5 text-primary font-bold">42 / 100 (42%)</td>
                      <td className="py-2.5 text-on-surface-variant">&lt; 75%</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-medium text-on-surface">CPU Utilization</td>
                      <td className="py-2.5 text-on-surface">91%</td>
                      <td className="py-2.5 text-primary font-bold">24%</td>
                      <td className="py-2.5 text-on-surface-variant">&lt; 70%</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Postmortem generation CTA / Progress */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-space-sm pt-2 border-t border-outline-variant/60">
                <div className="flex items-center gap-2 text-xs font-code-inline text-on-surface-variant">
                  <span className="material-symbols-outlined text-primary text-[18px]">description</span>
                  <span>Automated Postmortem authored with Gemini 3.8 Flash</span>
                </div>
                <button
                  onClick={() => {
                    if (activeIncident.postmortemId) {
                      setSelectedReportId(activeIncident.postmortemId);
                    }
                    setActiveTab('postmortems-reports');
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 rounded bg-primary text-on-primary hover:bg-primary-container font-label-caps text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
                >
                  <span className="material-symbols-outlined text-[16px]">menu_book</span>
                  View Postmortem Report
                </button>
              </div>
            </div>
          )}

          {/* Incident Live Logs Filterable Stream */}
          <div className="bg-surface-container-low rounded-xl p-space-md border border-outline-variant shadow-sm flex flex-col gap-space-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">terminal</span>
                <span className="font-headline-sm text-headline-sm text-on-surface">Incident Telemetry Stream</span>
              </div>
              {/* Filter controls */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex rounded-lg border border-outline-variant p-0.5 bg-surface-container-lowest">
                  {(['ALL', 'INFO', 'WARN', 'ERROR'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => setLogFilter(lvl)}
                      className={`px-2 py-0.5 text-xs rounded font-code-inline ${
                        logFilter === lvl
                          ? 'bg-surface-container-highest text-on-surface font-semibold'
                          : 'text-on-surface-variant hover:text-on-surface'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Filter logs..."
                  value={logQuery}
                  onChange={(e) => setLogQuery(e.target.value)}
                  className="bg-surface-container-lowest border border-outline-variant rounded px-2.5 py-1 text-xs font-code-inline text-on-surface focus:outline-none focus:border-primary w-36"
                />
              </div>
            </div>

            <div className="bg-surface-container-lowest rounded-lg p-3 font-code-telemetry text-code-telemetry text-on-surface flex flex-col gap-1.5 max-h-64 overflow-y-auto border border-outline-variant/60">
              {filteredLogs.map((log, idx) => (
                <div
                  key={idx}
                  className={`flex items-start gap-2 text-xs ${
                    log.includes('ERROR')
                      ? 'text-error'
                      : log.includes('WARN')
                      ? 'text-secondary'
                      : 'text-on-surface-variant'
                  }`}
                >
                  <span className="text-on-surface-variant select-none opacity-60">
                    {(idx + 1).toString().padStart(2, '0')}
                  </span>
                  <span className="break-all">{log}</span>
                </div>
              ))}
              {filteredLogs.length === 0 && (
                <div className="text-center py-4 text-on-surface-variant text-xs">
                  No log entries matching filter.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Timeline & SRE Oversight (4 Cols) */}
        <div className="lg:col-span-4 flex flex-col gap-space-lg">
          {/* Incident Timeline */}
          <div className="bg-surface-container-low rounded-xl p-space-md border border-outline-variant shadow-sm flex flex-col gap-space-md">
            <div className="flex items-center justify-between border-b border-outline-variant/60 pb-2">
              <span className="font-headline-sm text-headline-sm text-on-surface">Timeline</span>
              <span className="font-label-caps text-label-caps text-on-surface-variant">UTC ATOMIC</span>
            </div>

            <div className="relative pl-6 flex flex-col gap-4 border-l border-outline-variant/80 ml-2">
              {activeIncident.timeline.map((evt) => (
                <div key={evt.id} className="relative flex flex-col gap-1">
                  {/* Node dot */}
                  <span
                    className={`absolute -left-[31px] top-1 w-3 h-3 rounded-full ring-2 ring-surface ${
                      evt.type === 'detect'
                        ? 'bg-error'
                        : evt.type === 'approve'
                        ? 'bg-secondary'
                        : evt.type === 'remediate'
                        ? 'bg-secondary'
                        : evt.type === 'verify' || evt.type === 'system'
                        ? 'bg-primary'
                        : 'bg-primary'
                    }`}
                  ></span>
                  <div className="flex items-center justify-between">
                    <span className="font-code-inline text-code-inline font-bold text-on-surface">
                      {evt.title}
                    </span>
                    <span className="font-code-inline text-[11px] text-on-surface-variant">
                      {evt.timestamp}
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    {evt.description}
                  </p>
                  <span className="font-label-caps text-[10px] text-primary">
                    {evt.actor}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Operator Guardrail Card */}
          <div className="bg-surface-container-low rounded-xl p-space-md border border-outline-variant shadow-sm flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">security</span>
              <span className="font-headline-sm text-headline-sm text-on-surface">Human Guardrails</span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Every production mutation requires explicit Human-in-the-Loop authorization. No autonomous shell commands or unvetted scripts are allowed.
            </p>
            <div className="mt-2 bg-surface-container-lowest p-2.5 rounded-lg border border-outline-variant/60 flex items-center gap-2">
              <img
                alt="Maya Lin"
                className="w-7 h-7 rounded-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAZeb0ck1gLyYvzOOvhAC1Lgu5jJ9xBQpqLSPAjuGBrNiOVrwhotHNXSldPGq9kTotWOxHw8F3oHN5d0SbfP5Am3CeEQEX4uuYrlLziJLHBJFqsvj-dg9eA9b61GDwF_SIe2eglDKh2-wTovBGtfq8wpDh9ypid1SnUQ0N7eR6bdj4tgIP5_KS_G3bVtDCXkTogeSxIVIHWbzGNyXs7tveTYXbuUeuqoL2HUbw_qD0u1pGqZfRBVd65"
              />
              <div className="flex flex-col">
                <span className="font-body-sm text-body-sm font-semibold text-on-surface">
                  Maya Lin
                </span>
                <span className="font-label-caps text-[10px] text-primary">Lead SRE On-Call</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal (STEP 6) */}
      {showApprovalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-surface rounded-xl border border-outline-variant shadow-2xl max-w-lg w-full p-space-lg flex flex-col gap-space-md animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-outline-variant pb-space-sm">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[22px]">security</span>
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                  Human-in-the-Loop Authorization
                </h3>
              </div>
              <button
                onClick={() => setShowApprovalModal(false)}
                className="text-on-surface-variant hover:text-on-surface p-1"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <p className="font-body-default text-body-default text-on-surface">
              You are authorizing a live production mutation for{' '}
              <strong>{activeIncident.name}</strong> ({activeIncident.id}).
            </p>

            <div className="bg-surface-container-low p-3.5 rounded-lg border border-outline-variant/60 flex flex-col gap-2 font-code-telemetry text-code-telemetry">
              <div className="flex justify-between text-xs">
                <span className="text-on-surface-variant">Target Resource:</span>
                <span className="font-bold text-on-surface">RDS Parameter Group 'rds-prod-pg15'</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-on-surface-variant">Configuration Change:</span>
                <span className="font-bold text-primary">max_connections 50 -&gt; 100</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-on-surface-variant">Blast Radius:</span>
                <span className="text-secondary font-bold">Tier 1 (Zero-Downtime Hotfix)</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-on-surface-variant">Dry-run Simulation:</span>
                <span className="text-primary font-bold">Clean (0 conflicts)</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-on-surface-variant">Rollback Capability:</span>
                <span className="text-on-surface">1-click deterministic rollback available</span>
              </div>
            </div>

            <div className="text-xs font-body-sm text-on-surface-variant bg-surface-container-highest p-3 rounded">
              By authorizing, this runbook step will be cryptographically signed with SHA-256 provenance under Maya Lin's on-call credentials.
            </div>

            <div className="flex items-center justify-end gap-space-sm pt-space-sm border-t border-outline-variant">
              <button
                onClick={() => setShowApprovalModal(false)}
                className="px-4 py-2 rounded border border-outline-variant text-on-surface hover:bg-surface-container font-label-caps text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => approveAndExecute(activeIncident.id)}
                className="px-5 py-2 rounded bg-primary text-on-primary hover:bg-primary-container font-label-caps text-xs flex items-center gap-1.5 transition-all shadow-sm"
              >
                <span className="material-symbols-outlined text-[16px]">lock_open</span>
                Confirm &amp; Execute Hot-Patch
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
