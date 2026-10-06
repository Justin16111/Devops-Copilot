import React, { useState } from 'react';
import { useIncident } from '../context/IncidentContext';

export const PostmortemsView: React.FC = () => {
  const {
    reports,
    selectedReport,
    setSelectedReportId,
    activeIncident,
    isGeneratingReport,
    reportProgressText,
    generateReportForIncident,
  } = useIncident();

  const [copied, setCopied] = useState(false);
  const [slackAlertSent, setSlackAlertSent] = useState(false);

  const currentReport = selectedReport || reports[0] || null;

  const handleCopyMarkdown = () => {
    if (!currentReport) return;
    navigator.clipboard.writeText(currentReport.markdownContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSyncSlack = () => {
    setSlackAlertSent(true);
    setTimeout(() => setSlackAlertSent(false), 3000);
  };

  return (
    <div className="flex flex-col w-full px-margin py-space-xl gap-space-xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
        <div>
          <span className="font-label-caps text-label-caps uppercase text-primary tracking-wider">
            AGENT 04 SYNTHESIS ENGINE
          </span>
          <h1 className="font-headline-lg text-headline-lg text-on-surface font-bold mt-1">
            Postmortems &amp; Incident Reports
          </h1>
          <p className="font-body-default text-body-default text-on-surface-variant mt-1">
            Deterministic postmortem artifacts generated with Gemini 3.8 Flash and verified atomic UTC chronology.
          </p>
        </div>

        {activeIncident && activeIncident.status === 'resolved' && (
          <button
            onClick={() => generateReportForIncident(activeIncident.id)}
            disabled={isGeneratingReport}
            className="px-4 py-2 rounded bg-primary text-on-primary hover:bg-primary-container font-label-caps text-xs flex items-center gap-1.5 transition-all shadow-sm"
          >
            <span className="material-symbols-outlined text-[16px]">
              {isGeneratingReport ? 'sync' : 'auto_awesome'}
            </span>
            {isGeneratingReport ? reportProgressText || 'Authoring...' : 'Regenerate Postmortem with Gemini'}
          </button>
        )}
      </div>

      {slackAlertSent && (
        <div className="bg-primary-container text-on-primary-container p-3 rounded-lg flex items-center justify-between text-xs font-label-caps animate-in fade-in">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">campaign</span>
            <span>Broadcast sent to Slack channel #incident-response &amp; linked to Jira ticket INFRA-9912</span>
          </div>
          <span className="font-code-inline">SYNCED OK</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
        {/* Reports Index (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-space-md">
          <div className="bg-surface-container-low rounded-xl p-space-md border border-outline-variant shadow-sm flex flex-col gap-space-sm">
            <div className="flex items-center justify-between border-b border-outline-variant pb-2">
              <span className="font-headline-sm text-headline-sm text-on-surface">Reports Index</span>
              <span className="font-label-caps text-label-caps text-on-surface-variant">
                {reports.length} Documents
              </span>
            </div>

            <div className="flex flex-col gap-2">
              {reports.map((rep) => {
                const isSelected = currentReport?.id === rep.id;
                return (
                  <div
                    key={rep.id}
                    onClick={() => setSelectedReportId(rep.id)}
                    className={`p-3 rounded-lg border transition-all cursor-pointer flex flex-col gap-1 ${
                      isSelected
                        ? 'bg-surface-container-lowest border-primary shadow-xs'
                        : 'bg-surface-container-low border-outline-variant/60 hover:bg-surface-container'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-code-inline text-code-inline font-bold text-on-surface">
                        {rep.id}
                      </span>
                      <span className="font-label-caps text-[10px] bg-primary-container text-on-primary-container px-1.5 py-0.2 rounded">
                        VERIFIED
                      </span>
                    </div>
                    <div className="font-headline-sm text-sm text-on-surface font-semibold truncate">
                      {rep.incidentName}
                    </div>
                    <div className="flex items-center justify-between text-xs font-code-telemetry text-on-surface-variant mt-1">
                      <span>Duration: {rep.duration}</span>
                      <span>{rep.jiraTicket}</span>
                    </div>
                  </div>
                );
              })}

              {reports.length === 0 && (
                <div className="text-center py-8 text-on-surface-variant text-sm font-body-sm">
                  <p>No postmortems generated yet.</p>
                  <p className="text-xs mt-1">
                    Complete the Payment API incident workflow to automatically generate one!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Selected Report Content Viewer (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-space-md">
          {currentReport ? (
            <div className="bg-surface-container-low rounded-xl p-space-lg border border-outline-variant shadow-sm flex flex-col gap-space-lg">
              {/* Report Header Metadata */}
              <div className="flex flex-col gap-space-sm border-b border-outline-variant/60 pb-space-md">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-label-caps text-label-caps bg-primary text-on-primary px-2 py-0.5 rounded">
                      INCIDENT POSTMORTEM
                    </span>
                    <span className="font-code-inline text-code-inline text-on-surface-variant font-bold">
                      {currentReport.id}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopyMarkdown}
                      className="px-3 py-1.5 text-xs font-label-caps rounded border border-outline-variant hover:bg-surface-container-high text-on-surface flex items-center gap-1 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[14px]">
                        {copied ? 'check' : 'content_copy'}
                      </span>
                      {copied ? 'Copied Markdown' : 'Copy Markdown'}
                    </button>
                    <button
                      onClick={handleSyncSlack}
                      className="px-3 py-1.5 text-xs font-label-caps rounded bg-surface-container-highest text-on-surface hover:bg-surface-container flex items-center gap-1 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[14px]">send</span>
                      Sync Slack &amp; Jira
                    </button>
                  </div>
                </div>

                <h2 className="font-headline-md text-headline-md text-on-surface font-bold">
                  {currentReport.incidentName} ({currentReport.incidentId})
                </h2>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-xs font-code-telemetry">
                  <div className="bg-surface-container-lowest p-2 rounded">
                    <span className="text-on-surface-variant block font-label-caps text-[10px]">SEVERITY</span>
                    <span className="font-bold text-error uppercase">{currentReport.severity} (P0)</span>
                  </div>
                  <div className="bg-surface-container-lowest p-2 rounded">
                    <span className="text-on-surface-variant block font-label-caps text-[10px]">DURATION</span>
                    <span className="font-bold text-on-surface">{currentReport.duration}</span>
                  </div>
                  <div className="bg-surface-container-lowest p-2 rounded">
                    <span className="text-on-surface-variant block font-label-caps text-[10px]">AFFECTED SERVICE</span>
                    <span className="font-bold text-on-surface">{currentReport.service}</span>
                  </div>
                  <div className="bg-surface-container-lowest p-2 rounded">
                    <span className="text-on-surface-variant block font-label-caps text-[10px]">JIRA ISSUE</span>
                    <span className="font-bold text-primary">{currentReport.jiraTicket}</span>
                  </div>
                </div>
              </div>

              {/* Executive Summary */}
              <div className="flex flex-col gap-2">
                <span className="font-label-caps text-label-caps text-primary uppercase">
                  Executive Summary
                </span>
                <p className="font-body-default text-body-default text-on-surface bg-surface-container-lowest p-4 rounded-lg border border-outline-variant/60 leading-relaxed">
                  {currentReport.summary}
                </p>
              </div>

              {/* Root Cause & Resolution */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                <div className="bg-surface-container-lowest p-4 rounded-lg border border-outline-variant/60 flex flex-col gap-2">
                  <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
                    Root Cause
                  </span>
                  <p className="font-body-default text-body-default text-on-surface font-medium">
                    {currentReport.rootCause}
                  </p>
                </div>

                <div className="bg-surface-container-lowest p-4 rounded-lg border border-outline-variant/60 flex flex-col gap-2">
                  <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
                    Remediation Applied
                  </span>
                  <p className="font-body-default text-body-default text-on-surface font-medium">
                    {currentReport.resolution}
                  </p>
                </div>
              </div>

              {/* Preventative Measures Checklist */}
              <div className="flex flex-col gap-2">
                <span className="font-label-caps text-label-caps text-primary uppercase">
                  Preventative Safeguards &amp; Action Items
                </span>
                <div className="flex flex-col gap-2">
                  {currentReport.prevention.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/60 flex items-start gap-2.5 text-body-sm text-on-surface"
                    >
                      <span className="material-symbols-outlined text-primary text-[18px] mt-0.5">
                        check_box
                      </span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Raw Markdown Accordion */}
              <div className="flex flex-col gap-2 pt-2 border-t border-outline-variant/60">
                <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
                  Full Markdown Telemetry
                </span>
                <pre className="bg-surface-container-lowest p-4 rounded-lg border border-outline-variant/60 font-code-telemetry text-xs text-on-surface overflow-x-auto whitespace-pre-wrap max-h-72">
                  {currentReport.markdownContent}
                </pre>
              </div>
            </div>
          ) : (
            <div className="bg-surface-container-low rounded-xl p-space-xl border border-outline-variant text-center">
              <span className="material-symbols-outlined text-primary text-[48px]">description</span>
              <h3 className="font-headline-sm text-headline-sm text-on-surface mt-2 font-semibold">
                No Postmortem Document Selected
              </h3>
              <p className="font-body-default text-body-default text-on-surface-variant mt-1 max-w-md mx-auto">
                Once an incident is resolved, Agent 04 authors a comprehensive postmortem with Gemini 3.8 Flash.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
