import type { Incident, PostmortemReport } from '../src/types/index';

function createInitialIncidents(): Incident[] {
  return [
    {
      id: 'INC-8042',
      name: 'Payment API Failure',
      service: 'Payment API Gateway',
      severity: 'critical',
      status: 'active',
      createdAt: '12:05:14 UTC',
      duration: '8m 14s',
      metrics: {
        errorRate: 38.0,
        latency: 8.7,
        latencyUnit: 's',
        cpu: 91,
        databaseConnections: '50/50',
        memory: 82,
      },
      beforeMetrics: {
        errorRate: 38.0,
        latency: '8.7s',
        databaseConnections: '50/50',
      },
      logs: [
        '12:05:18 WARN Connection pool 48/50 (high watermark threshold reached)',
        '12:05:20 WARN Connection pool 50/50 (pool exhausted, queuing new acquire requests)',
        '12:05:21 ERROR Connection timeout: client unable to acquire pool handle within 5000ms',
        '12:05:21 ERROR Database unavailable for worker thread [tx-worker-884]',
        '12:05:22 ERROR HTTP 500 /payment/v2/checkout: Failed to process order #884192',
        '12:05:24 ERROR Connection acquisition failure rate breached critical SLA (38%)',
        '12:05:25 WARN Circuit breaker tripped for downstream database cluster [rds-prod-pg15]',
      ],
      recentDeployment: {
        version: 'v2.4',
        time: '12:00 UTC',
        author: 'j.chen@devops',
        commit: 'a91f42e (feat: async checkout worker batching)',
      },
      analysis: {
        incidentDetected: true,
        severity: 'critical',
        rootCause: 'Database connection pool exhaustion',
        confidence: 94,
        evidence: [
          'Connection pool reached maximum capacity (50/50)',
          'Database connection timeout errors spiked sharply (>4,200 events/min)',
          'HTTP 500 errors on /payment endpoint surged to 38%',
          'Recent deployment v2.4 doubled worker concurrency without scaling max_connections',
        ],
        impact: 'Payment requests are failing (38% error rate, 8.7s p99 latency). Checkout pipeline degraded.',
        recommendedAction: {
          title: 'Increase database connection pool',
          from: 50,
          to: 100,
          risk: 'low',
          estimatedRecovery: '2 minutes',
          actionType: 'INCREASE_DB_POOL',
          reason: 'Apply dynamic parameter update to RDS parameter group to double max_connections with zero downtime.',
        },
        prevention: [
          'Add connection pool saturation alert at 80% watermark in telemetry',
          'Detect connection leaks in payment worker lifecycle',
          'Validate database configuration and worker thread ceiling in CI/CD load tests',
        ],
      },
      executionSteps: [
        { id: '1', label: 'Updating RDS Parameter Group configuration (max_connections 50 -> 100)', status: 'pending' },
        { id: '2', label: 'Recycling idle worker connection handles with zero downtime', status: 'pending' },
        { id: '3', label: 'Executing health & connectivity probes on /payment/health', status: 'pending' },
        { id: '4', label: 'Monitoring latency and error rate recovery', status: 'pending' },
      ],
      timeline: [
        {
          id: 't-1',
          timestamp: '12:05:14 UTC',
          title: 'Incident Detected',
          description: 'Payment API error rate spiked past 10% SLA threshold (detected at 38%).',
          type: 'detect',
          actor: 'Agent 01 (Detection Agent)',
        },
      ],
      requiresApproval: true,
      approvalGranted: false,
    },
    {
      id: 'INC-8040',
      name: 'Database Connection Spike',
      service: 'RDS PostgreSQL Replica 02',
      severity: 'warning',
      status: 'active',
      createdAt: '11:48:30 UTC',
      metrics: {
        errorRate: 4.2,
        latency: 420,
        latencyUnit: 'ms',
        cpu: 64,
        databaseConnections: '42/50',
        memory: 68,
      },
      logs: [
        '11:48:15 WARN Replica query queue depth exceeded 150 items',
        '11:48:22 WARN Active connections reached 42/50 on rds-replica-02',
        '11:48:30 INFO Analytics batch query running with non-indexed filter',
      ],
      recentDeployment: {
        version: 'v2.3.9',
        time: 'Yesterday 18:00 UTC',
        author: 'analytics-team',
        commit: '7b881cd',
      },
      timeline: [
        {
          id: 't-2',
          timestamp: '11:48:30 UTC',
          title: 'Anomaly Flagged',
          description: 'Connection pool watermark reached 84% on analytics read replica.',
          type: 'detect',
          actor: 'Agent 01 (Detection Agent)',
        },
      ],
    },
    {
      id: 'INC-8038',
      name: 'High CPU Usage',
      service: 'Auth Service Worker',
      severity: 'warning',
      status: 'active',
      createdAt: '11:15:02 UTC',
      metrics: {
        errorRate: 1.8,
        latency: 310,
        latencyUnit: 'ms',
        cpu: 89,
        databaseConnections: '18/50',
        memory: 74,
      },
      logs: [
        '11:14:40 WARN Pod auth-worker-67b CPU throttled at 89%',
        '11:15:00 WARN JWT key rotation cache miss triggering repeated cryptographic verifications',
      ],
      recentDeployment: {
        version: 'v1.9.4',
        time: '3 days ago',
        author: 'sec-infra',
        commit: '4f2910a',
      },
      timeline: [
        {
          id: 't-3',
          timestamp: '11:15:02 UTC',
          title: 'Threshold Breach',
          description: 'CPU threshold 85% breached on auth worker cluster.',
          type: 'detect',
          actor: 'Agent 01 (Detection Agent)',
        },
      ],
    },
  ];
}

class IncidentStore {
  private incidents: Incident[];
  private reports: PostmortemReport[];

  constructor() {
    this.incidents = createInitialIncidents();
    this.reports = [];
  }

  getIncidents(): Incident[] {
    return this.incidents;
  }

  getIncident(id: string): Incident | undefined {
    return this.incidents.find((inc) => inc.id === id);
  }

  updateIncident(id: string, patch: Partial<Incident>): Incident | undefined {
    const index = this.incidents.findIndex((inc) => inc.id === id);
    if (index === -1) return undefined;

    this.incidents[index] = {
      ...this.incidents[index],
      ...patch,
      metrics: {
        ...this.incidents[index].metrics,
        ...(patch.metrics || {}),
      },
    };
    return this.incidents[index];
  }

  getReports(): PostmortemReport[] {
    return this.reports;
  }

  getReport(id: string): PostmortemReport | undefined {
    return this.reports.find((r) => r.id === id || r.incidentId === id);
  }

  addReport(report: PostmortemReport): void {
    const existingIndex = this.reports.findIndex((r) => r.id === report.id || r.incidentId === report.incidentId);
    if (existingIndex >= 0) {
      this.reports[existingIndex] = report;
    } else {
      this.reports.unshift(report);
    }
  }

  reset(): void {
    this.incidents = createInitialIncidents();
    this.reports = [];
  }
}

export const incidentStore = new IncidentStore();
