import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import type { Incident, PostmortemReport, LogEntry, TimeSeriesPoint } from '../types/index';
import { ApiClient } from '../services/apiClient';

export type NavTab = 'overview' | 'incidents' | 'monitoring-system-signals' | 'ai-agents' | 'postmortems-reports';

export type InvestigationStep = 
  | 'idle'
  | 'analyzing_logs'
  | 'correlating_metrics'
  | 'checking_deployments'
  | 'identifying_patterns'
  | 'finding_root_cause'
  | 'complete'
  | 'error';

interface IncidentContextType {
  // Navigation
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  selectedIncidentId: string | null;
  setSelectedIncidentId: (id: string | null) => void;
  selectedReportId: string | null;
  setSelectedReportId: (id: string | null) => void;

  // Data
  incidents: Incident[];
  activeIncident: Incident | null;
  reports: PostmortemReport[];
  selectedReport: PostmortemReport | null;
  loading: boolean;
  error: string | null;

  // Investigation workflow
  investigationStep: InvestigationStep;
  investigationProgressText: string;
  isInvestigating: boolean;
  startInvestigation: (id?: string) => Promise<void>;

  // Remediation workflow
  isApproving: boolean;
  showApprovalModal: boolean;
  setShowApprovalModal: (show: boolean) => void;
  isExecutingRemediation: boolean;
  executionStepIndex: number;
  approveAndExecute: (id?: string) => Promise<void>;

  // Recovery & Postmortem
  isGeneratingReport: boolean;
  reportProgressText: string;
  generateReportForIncident: (id?: string) => Promise<PostmortemReport | null>;

  // Demo Controls
  simulateIncident: () => Promise<void>;
  resetDemo: () => Promise<void>;
  isAutonomousDemoRunning: boolean;
  runAutonomousDemo: () => Promise<void>;

  // Live Metrics & Logs
  liveMetrics: TimeSeriesPoint[];
  liveLogs: LogEntry[];
  addLiveLog: (log: Omit<LogEntry, 'id'>) => void;
  logFilter: 'ALL' | 'INFO' | 'WARN' | 'ERROR';
  setLogFilter: (filter: 'ALL' | 'INFO' | 'WARN' | 'ERROR') => void;
  logSearch: string;
  setLogSearch: (query: string) => void;

  // System stats
  activeIncidentCount: number;
  systemHealth: string;
}

const IncidentContext = createContext<IncidentContextType | undefined>(undefined);

export const IncidentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<NavTab>('ai-agents');
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>('INC-8042');
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);

  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [reports, setReports] = useState<PostmortemReport[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAutonomousDemoRunning, setIsAutonomousDemoRunning] = useState<boolean>(false);

  // Investigation animation states
  const [investigationStep, setInvestigationStep] = useState<InvestigationStep>('idle');
  const [investigationProgressText, setInvestigationProgressText] = useState<string>('');
  const [isInvestigating, setIsInvestigating] = useState<boolean>(false);

  // Remediation states
  const [isApproving, setIsApproving] = useState<boolean>(false);
  const [showApprovalModal, setShowApprovalModal] = useState<boolean>(false);
  const [isExecutingRemediation, setIsExecutingRemediation] = useState<boolean>(false);
  const [executionStepIndex, setExecutionStepIndex] = useState<number>(0);

  // Report generation state
  const [isGeneratingReport, setIsGeneratingReport] = useState<boolean>(false);
  const [reportProgressText, setReportProgressText] = useState<string>('');

  // Monitoring time series
  const [liveMetrics, setLiveMetrics] = useState<TimeSeriesPoint[]>([]);
  const [liveLogs, setLiveLogs] = useState<LogEntry[]>([]);
  const [logFilter, setLogFilter] = useState<'ALL' | 'INFO' | 'WARN' | 'ERROR'>('ALL');
  const [logSearch, setLogSearch] = useState<string>('');

  // Initial load
  const loadInitialData = useCallback(async () => {
    try {
      setLoading(true);
      const [incData, repData] = await Promise.all([
        ApiClient.getIncidents(),
        ApiClient.getReports(),
      ]);
      setIncidents(incData);
      setReports(repData);

      // Seed initial metrics history
      const now = Date.now();
      const points: TimeSeriesPoint[] = [];
      const paymentIncident = incData.find((i) => i.id === 'INC-8042');
      const isCritical = paymentIncident?.status !== 'resolved';

      for (let i = 20; i >= 0; i--) {
        const t = new Date(now - i * 15000);
        const timeStr = t.toISOString().slice(14, 19);
        const ratio = i < 6 && isCritical ? 1 : 0.05;
        points.push({
          time: timeStr,
          timestamp: t.getTime(),
          errorRate: isCritical && i < 6 ? 35 + Math.random() * 5 : 0.5 + Math.random() * 0.4,
          latencyMs: isCritical && i < 6 ? 8400 + Math.random() * 600 : 160 + Math.random() * 30,
          cpu: isCritical && i < 6 ? 88 + Math.random() * 5 : 22 + Math.random() * 8,
          dbConnections: isCritical && i < 6 ? 50 : 38 + Math.floor(Math.random() * 8),
          dbMax: isCritical && i < 6 ? 50 : 100,
          memory: 45 + Math.random() * 5,
        });
      }
      setLiveMetrics(points);

      // Seed initial logs
      setLiveLogs([
        { id: 'l1', timestamp: '12:05:14 UTC', level: 'INFO', service: 'Payment API', message: 'Worker pod payment-api-7b8f scaled to 12 replicas' },
        { id: 'l2', timestamp: '12:05:18 UTC', level: 'WARN', service: 'RDS-Postgres', message: 'Connection pool 48/50 (high watermark threshold reached)' },
        { id: 'l3', timestamp: '12:05:20 UTC', level: 'WARN', service: 'RDS-Postgres', message: 'Connection pool 50/50 (pool exhausted, queuing new acquire requests)' },
        { id: 'l4', timestamp: '12:05:21 UTC', level: 'ERROR', service: 'RDS-Postgres', message: 'Database connection timeout: pool handle acquisition exceeded 5000ms' },
        { id: 'l5', timestamp: '12:05:21 UTC', level: 'ERROR', service: 'Payment API', message: 'Database unavailable for checkout worker thread [tx-worker-884]' },
        { id: 'l6', timestamp: '12:05:22 UTC', level: 'ERROR', service: 'Payment API', message: 'HTTP 500 /payment/v2/checkout: Failed to process order #884192' },
        { id: 'l7', timestamp: '12:05:24 UTC', level: 'ERROR', service: 'Payment API', message: 'Connection acquisition failure rate breached critical SLA (38%)' },
      ]);
    } catch (err: any) {
      setError(err.message || 'Failed to initialize app data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Periodic simulated live logs ticker
  useEffect(() => {
    const timer = setInterval(() => {
      const nowStr = new Date().toISOString().slice(11, 19) + ' UTC';
      const sampleMessages = [
        { level: 'INFO' as const, service: 'Telemetry Edge', message: 'Ingested 14,280 metrics/sec across 6 clusters. Drift: 0.00%' },
        { level: 'INFO' as const, service: 'Payment Gateway', message: 'Health probe ping: 200 OK from us-east-1a' },
        { level: 'INFO' as const, service: 'Trace Correlator', message: 'Ingested 42.8k distributed spans across 18 mesh microservices' },
        { level: 'WARN' as const, service: 'Cache Replica', message: 'Redis memory utilization watermark at 61% (Normal)' },
      ];
      const pick = sampleMessages[Math.floor(Math.random() * sampleMessages.length)];
      setLiveLogs((prev) => [
        {
          id: `log-${Date.now()}-${Math.random()}`,
          timestamp: nowStr,
          level: pick.level,
          service: pick.service,
          message: pick.message,
        },
        ...prev.slice(0, 49),
      ]);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  const activeIncident = incidents.find((i) => i.id === selectedIncidentId) || incidents[0] || null;
  const selectedReport = reports.find((r) => r.id === selectedReportId || r.incidentId === selectedIncidentId) || reports[0] || null;

  const activeIncidentCount = incidents.filter((i) => i.status !== 'resolved').length;
  const systemHealth = activeIncidentCount === 0 ? '100%' : activeIncidentCount === 1 ? '98.7%' : '94.2%';

  // Step 3: Investigation with real animated UI states
  const startInvestigation = useCallback(async (id?: string) => {
    const targetId = id || selectedIncidentId || 'INC-8042';
    setIsInvestigating(true);
    setError(null);

    const steps: { step: InvestigationStep; text: string; delay: number }[] = [
      { step: 'analyzing_logs', text: 'Analyzing application logs...', delay: 800 },
      { step: 'correlating_metrics', text: 'Correlating system metrics...', delay: 800 },
      { step: 'checking_deployments', text: 'Checking recent deployments...', delay: 800 },
      { step: 'identifying_patterns', text: 'Identifying abnormal error patterns...', delay: 800 },
      { step: 'finding_root_cause', text: 'Finding root cause with deep causal topology...', delay: 900 },
    ];

    try {
      for (const item of steps) {
        setInvestigationStep(item.step);
        setInvestigationProgressText(item.text);
        await new Promise((r) => setTimeout(r, item.delay));
      }

      // Call API
      const updatedIncident = await ApiClient.analyzeIncident(targetId);
      setIncidents((prev) => prev.map((inc) => (inc.id === targetId ? updatedIncident : inc)));
      setInvestigationStep('complete');
      setInvestigationProgressText('Root cause identified.');
    } catch (err: any) {
      console.error('Investigation error:', err);
      setInvestigationStep('error');
      setError('AI analysis temporarily unavailable. Click to retry.');
    } finally {
      setIsInvestigating(false);
    }
  }, [selectedIncidentId]);

  // Step 6 & 7 & 8: Approve and Execute Remediation with animated step-by-step progress
  const approveAndExecute = useCallback(async (id?: string) => {
    const targetId = id || selectedIncidentId || 'INC-8042';
    setShowApprovalModal(false);
    setIsExecutingRemediation(true);
    setExecutionStepIndex(0);

    try {
      // 1. Approve
      await ApiClient.approveRemediation(targetId, 'Maya Lin (Lead SRE)');

      // Progress through 4 execution steps
      const execStepLabels = [
        'Updating configuration (max_connections 50 -> 100)',
        'Restarting affected service worker handles',
        'Checking health & ping probes',
        'Monitoring recovery metrics',
      ];

      for (let i = 0; i < execStepLabels.length; i++) {
        setExecutionStepIndex(i);
        await new Promise((r) => setTimeout(r, 900));
      }

      // Call Execute API
      const executed = await ApiClient.executeRemediation(targetId);

      // Animate Metrics recovering progressively
      // Error rate: 38% -> 25% -> 12% -> 4% -> 0.8%
      // Latency: 8.7s -> 5.1s -> 2.3s -> 180ms
      // Database: 50/50 -> 48/100 -> 42/100
      const recoveryStages = [
        { errorRate: 25.0, latency: 5.1, latencyUnit: 's' as const, db: '50/100', cpu: 72 },
        { errorRate: 12.0, latency: 2.3, latencyUnit: 's' as const, db: '48/100', cpu: 54 },
        { errorRate: 4.0, latency: 680, latencyUnit: 'ms' as const, db: '45/100', cpu: 38 },
        { errorRate: 0.8, latency: 180, latencyUnit: 'ms' as const, db: '42/100', cpu: 24 },
      ];

      for (const stage of recoveryStages) {
        await new Promise((r) => setTimeout(r, 700));
        setIncidents((prev) =>
          prev.map((inc) =>
            inc.id === targetId
              ? {
                  ...inc,
                  metrics: {
                    ...inc.metrics,
                    errorRate: stage.errorRate,
                    latency: stage.latency,
                    latencyUnit: stage.latencyUnit,
                    databaseConnections: stage.db,
                    cpu: stage.cpu,
                  },
                }
              : inc
          )
        );

        // Append to live metrics time series
        const now = new Date();
        setLiveMetrics((prev) => [
          ...prev.slice(1),
          {
            time: now.toISOString().slice(14, 19),
            timestamp: now.getTime(),
            errorRate: stage.errorRate,
            latencyMs: stage.latencyUnit === 's' ? stage.latency * 1000 : stage.latency,
            cpu: stage.cpu,
            dbConnections: parseInt(stage.db.split('/')[0]),
            dbMax: 100,
            memory: 42,
          },
        ]);
      }

      // Verify Recovery
      const verified = await ApiClient.verifyRecovery(targetId);
      setIncidents((prev) => prev.map((inc) => (inc.id === targetId ? verified : inc)));

      // Add recovered live log
      setLiveLogs((prev) => [
        {
          id: `log-rec-${Date.now()}`,
          timestamp: new Date().toISOString().slice(11, 19) + ' UTC',
          level: 'INFO',
          service: 'Verification Engine',
          message: 'Zero-downtime hotfix verified: 200 OK (p99 180ms). Incident marked RESOLVED.',
        },
        ...prev,
      ]);

      // Automatically generate postmortem report
      await generateReportForIncident(targetId);
    } catch (err: any) {
      console.error('Execution error:', err);
      setError('Remediation failed. Check runbook logs.');
    } finally {
      setIsExecutingRemediation(false);
    }
  }, [selectedIncidentId]);

  // Step 10: Generate postmortem report
  const generateReportForIncident = useCallback(async (id?: string) => {
    const targetId = id || selectedIncidentId || 'INC-8042';
    setIsGeneratingReport(true);
    setReportProgressText('Analyzing incident telemetry...');

    try {
      await new Promise((r) => setTimeout(r, 600));
      setReportProgressText('Preparing atomic UTC timeline...');
      await new Promise((r) => setTimeout(r, 600));
      setReportProgressText('Generating preventative recommendations & runbooks...');

      const report = await ApiClient.generateReport(targetId);
      setReports((prev) => {
        const filtered = prev.filter((r) => r.id !== report.id && r.incidentId !== report.incidentId);
        return [report, ...filtered];
      });
      setSelectedReportId(report.id);

      // Update incident with report link
      setIncidents((prev) =>
        prev.map((inc) => (inc.id === targetId ? { ...inc, postmortemId: report.id } : inc))
      );

      return report;
    } catch (err: any) {
      console.error('Report generation error:', err);
      setError('Report generation failed. You can retry.');
      return null;
    } finally {
      setIsGeneratingReport(false);
      setReportProgressText('');
    }
  }, [selectedIncidentId]);

  // Demo: Simulate Incident (Payment API)
  const simulateIncident = useCallback(async () => {
    try {
      setLoading(true);
      await ApiClient.resetAll();
      const freshIncidents = await ApiClient.getIncidents();
      setIncidents(freshIncidents);
      setSelectedIncidentId('INC-8042');
      setActiveTab('incidents');
      setInvestigationStep('idle');
      setInvestigationProgressText('');

      // Add fresh alert log
      setLiveLogs((prev) => [
        {
          id: `sim-${Date.now()}`,
          timestamp: new Date().toISOString().slice(11, 19) + ' UTC',
          level: 'ERROR',
          service: 'Payment API Gateway',
          message: '🚨 CRITICAL ANOMALY: Error rate 38%, Latency 8.7s, DB Connection Pool 50/50 saturated!',
        },
        ...prev,
      ]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Demo: Reset All
  const resetDemo = useCallback(async () => {
    try {
      setLoading(true);
      await ApiClient.resetAll();
      await loadInitialData();
      setSelectedIncidentId('INC-8042');
      setInvestigationStep('idle');
      setActiveTab('overview');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [loadInitialData]);

  // Autonomous End-to-End Demo Flow Runner
  const runAutonomousDemo = useCallback(async () => {
    if (isAutonomousDemoRunning) return;
    setIsAutonomousDemoRunning(true);
    try {
      // 1. Simulate Incident
      await simulateIncident();
      await new Promise((r) => setTimeout(r, 1200));

      // 2. Start Investigation
      await startInvestigation('INC-8042');
      await new Promise((r) => setTimeout(r, 1800));

      // 3. Show Human-in-the-Loop approval
      setShowApprovalModal(true);
      await new Promise((r) => setTimeout(r, 2200));

      // 4. Approve & Execute
      await approveAndExecute('INC-8042');
      await new Promise((r) => setTimeout(r, 2000));

      // 5. Navigate to postmortem report
      setActiveTab('postmortems-reports');
    } catch (err: any) {
      console.error('Autonomous demo error:', err);
      setError('Autonomous demo flow interrupted. You can resume manually.');
    } finally {
      setIsAutonomousDemoRunning(false);
    }
  }, [isAutonomousDemoRunning, simulateIncident, startInvestigation, approveAndExecute]);

  const addLiveLog = useCallback((log: Omit<LogEntry, 'id'>) => {
    setLiveLogs((prev) => [
      {
        id: `log-${Date.now()}-${Math.random()}`,
        ...log,
      },
      ...prev,
    ]);
  }, []);

  return (
    <IncidentContext.Provider
      value={{
        activeTab,
        setActiveTab,
        selectedIncidentId,
        setSelectedIncidentId,
        selectedReportId,
        setSelectedReportId,
        incidents,
        activeIncident,
        reports,
        selectedReport,
        loading,
        error,
        investigationStep,
        investigationProgressText,
        isInvestigating,
        startInvestigation,
        isApproving,
        showApprovalModal,
        setShowApprovalModal,
        isExecutingRemediation,
        executionStepIndex,
        approveAndExecute,
        isGeneratingReport,
        reportProgressText,
        generateReportForIncident,
        simulateIncident,
        resetDemo,
        isAutonomousDemoRunning,
        runAutonomousDemo,
        liveMetrics,
        liveLogs,
        addLiveLog,
        logFilter,
        setLogFilter,
        logSearch,
        setLogSearch,
        activeIncidentCount,
        systemHealth,
      }}
    >
      {children}
    </IncidentContext.Provider>
  );
};

export const useIncident = () => {
  const context = useContext(IncidentContext);
  if (!context) {
    throw new Error('useIncident must be used within an IncidentProvider');
  }
  return context;
};
