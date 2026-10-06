export type IncidentSeverity = 'critical' | 'warning' | 'info';

export type IncidentStatus = 
  | 'active'
  | 'investigating'
  | 'root_cause_found'
  | 'approval_required'
  | 'remediating'
  | 'verifying'
  | 'resolved';

export interface IncidentMetrics {
  errorRate: number; // e.g. 38%
  latency: number; // e.g. 8.7s
  latencyUnit: 's' | 'ms';
  cpu: number; // e.g. 91%
  databaseConnections: string; // e.g. "50/50"
  memory?: number; // e.g. 78%
}

export interface MetricComparison {
  errorRate: number;
  latency: string;
  databaseConnections: string;
}

export interface IncidentAnalysis {
  incidentDetected: boolean;
  severity: IncidentSeverity;
  rootCause: string;
  confidence: number;
  evidence: string[];
  impact: string;
  recommendedAction: {
    title: string;
    from: number | string;
    to: number | string;
    risk: 'low' | 'medium' | 'high';
    estimatedRecovery: string;
    actionType?: 'INCREASE_DB_POOL' | 'RESTART_SERVICE' | 'ROLLBACK_DEPLOYMENT' | 'SCALE_SERVICE';
    reason?: string;
  };
  prevention: string[];
}

export interface ExecutionStep {
  id: string;
  label: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
}

export interface TimelineEvent {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  type: 'detect' | 'investigate' | 'approve' | 'remediate' | 'verify' | 'report' | 'system';
  actor: string;
}

export interface Incident {
  id: string;
  name: string;
  service: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  createdAt: string;
  resolvedAt?: string;
  duration?: string;
  metrics: IncidentMetrics;
  beforeMetrics?: MetricComparison;
  afterMetrics?: MetricComparison;
  logs: string[];
  recentDeployment: {
    version: string;
    time: string;
    author?: string;
    commit?: string;
  };
  analysis?: IncidentAnalysis;
  executionSteps?: ExecutionStep[];
  timeline: TimelineEvent[];
  postmortemId?: string;
  requiresApproval?: boolean;
  approvalGranted?: boolean;
}

export interface PostmortemReport {
  id: string;
  incidentId: string;
  incidentName: string;
  service: string;
  severity: IncidentSeverity;
  duration: string;
  rootCause: string;
  impact: string;
  resolution: string;
  prevention: string[];
  summary: string;
  markdownContent: string;
  generatedAt: string;
  slackSynced: boolean;
  jiraTicket: string;
  author: string;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR';
  service: string;
  message: string;
}

export interface TimeSeriesPoint {
  time: string;
  timestamp: number;
  errorRate: number;
  latencyMs: number;
  cpu: number;
  dbConnections: number;
  dbMax: number;
  memory: number;
}
