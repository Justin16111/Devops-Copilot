import express, { Request, Response } from 'express';
import { incidentStore } from './incidentStore';
import { analyzeIncidentWithGemini, generatePostmortemWithGemini } from './geminiService';
import type { TimelineEvent } from '../src/types/index';

export const apiApp = express();

apiApp.use(express.json());

// GET /api/incidents
apiApp.get('/api/incidents', (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: incidentStore.getIncidents(),
  });
});

// GET /api/incidents/:id
apiApp.get('/api/incidents/:id', (req: Request, res: Response) => {
  const incident = incidentStore.getIncident(req.params.id);
  if (!incident) {
    res.status(404).json({ success: false, error: 'Incident not found' });
    return;
  }
  res.json({ success: true, data: incident });
});

// POST /api/incidents/:id/analyze
apiApp.post('/api/incidents/:id/analyze', async (req: Request, res: Response) => {
  const incident = incidentStore.getIncident(req.params.id);
  if (!incident) {
    res.status(404).json({ success: false, error: 'Incident not found' });
    return;
  }

  try {
    const analysis = await analyzeIncidentWithGemini(incident);

    const now = new Date().toISOString().slice(11, 19) + ' UTC';
    const newTimelineEvent: TimelineEvent = {
      id: `t-${Date.now()}`,
      timestamp: now,
      title: 'Root Cause Identified',
      description: `${analysis.rootCause} (${analysis.confidence}% confidence). Recommended: ${analysis.recommendedAction.title}`,
      type: 'investigate',
      actor: 'Agent 02 (Investigation Agent)',
    };

    const updated = incidentStore.updateIncident(req.params.id, {
      status: 'root_cause_found',
      analysis,
      timeline: [...incident.timeline, newTimelineEvent],
    });

    res.json({ success: true, data: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'AI analysis temporarily unavailable.' });
  }
});

// POST /api/incidents/:id/remediation
apiApp.post('/api/incidents/:id/remediation', (req: Request, res: Response) => {
  const incident = incidentStore.getIncident(req.params.id);
  if (!incident) {
    res.status(404).json({ success: false, error: 'Incident not found' });
    return;
  }

  res.json({
    success: true,
    data: incident.analysis?.recommendedAction || {
      title: 'Increase database connection pool',
      from: 50,
      to: 100,
      risk: 'low',
      estimatedRecovery: '2 minutes',
      actionType: 'INCREASE_DB_POOL',
    },
  });
});

// POST /api/incidents/:id/approve
apiApp.post('/api/incidents/:id/approve', (req: Request, res: Response) => {
  const incident = incidentStore.getIncident(req.params.id);
  if (!incident) {
    res.status(404).json({ success: false, error: 'Incident not found' });
    return;
  }

  const { approver = 'Maya Lin (Lead SRE)' } = req.body;
  const now = new Date().toISOString().slice(11, 19) + ' UTC';

  const approvalEvent: TimelineEvent = {
    id: `t-${Date.now()}`,
    timestamp: now,
    title: 'Remediation Approved',
    description: `Manual SRE authorization granted by ${approver}. Safety check passed (dry-run: clean).`,
    type: 'approve',
    actor: approver,
  };

  const updated = incidentStore.updateIncident(req.params.id, {
    status: 'remediating',
    approvalGranted: true,
    timeline: [...incident.timeline, approvalEvent],
  });

  res.json({ success: true, data: updated });
});

// POST /api/incidents/:id/execute
apiApp.post('/api/incidents/:id/execute', (req: Request, res: Response) => {
  const incident = incidentStore.getIncident(req.params.id);
  if (!incident) {
    res.status(404).json({ success: false, error: 'Incident not found' });
    return;
  }

  const now = new Date().toISOString().slice(11, 19) + ' UTC';

  const executedEvent: TimelineEvent = {
    id: `t-${Date.now()}`,
    timestamp: now,
    title: 'Remediation Executed',
    description: 'Hot-patch applied to RDS Parameter Group. max_connections: 50 -> 100.',
    type: 'remediate',
    actor: 'Agent 03 (Remediation Agent)',
  };

  const completedSteps = (incident.executionSteps || []).map((step) => ({
    ...step,
    status: 'completed' as const,
  }));

  // Update metrics to recovered state
  const updated = incidentStore.updateIncident(req.params.id, {
    status: 'verifying',
    executionSteps: completedSteps,
    metrics: {
      errorRate: 0.8,
      latency: 180,
      latencyUnit: 'ms',
      cpu: 24,
      databaseConnections: '42/100',
      memory: 45,
    },
    beforeMetrics: incident.beforeMetrics || {
      errorRate: 38.0,
      latency: '8.7s',
      databaseConnections: '50/50',
    },
    afterMetrics: {
      errorRate: 0.8,
      latency: '180ms',
      databaseConnections: '42/100',
    },
    timeline: [...incident.timeline, executedEvent],
  });

  res.json({ success: true, data: updated });
});

// POST /api/incidents/:id/verify
apiApp.post('/api/incidents/:id/verify', (req: Request, res: Response) => {
  const incident = incidentStore.getIncident(req.params.id);
  if (!incident) {
    res.status(404).json({ success: false, error: 'Incident not found' });
    return;
  }

  const now = new Date().toISOString().slice(11, 19) + ' UTC';

  const verifyEvent: TimelineEvent = {
    id: `t-${Date.now()}-v`,
    timestamp: now,
    title: 'Recovery Verified',
    description: 'System health verified: Error rate 0.8% (<1.0% threshold), p99 latency 180ms, DB handles 42/100.',
    type: 'verify',
    actor: 'Agent 01 & Verification Engine',
  };

  const resolvedEvent: TimelineEvent = {
    id: `t-${Date.now()}-r`,
    timestamp: now,
    title: 'Incident Resolved',
    description: 'Autonomous remediation cycle complete. Zero active alerts.',
    type: 'system',
    actor: 'DevOps Copilot Swarm',
  };

  const updated = incidentStore.updateIncident(req.params.id, {
    status: 'resolved',
    resolvedAt: now,
    timeline: [...incident.timeline, verifyEvent, resolvedEvent],
  });

  res.json({ success: true, data: updated });
});

// POST /api/incidents/:id/report
apiApp.post('/api/incidents/:id/report', async (req: Request, res: Response) => {
  const incident = incidentStore.getIncident(req.params.id);
  if (!incident) {
    res.status(404).json({ success: false, error: 'Incident not found' });
    return;
  }

  try {
    const reportId = `REP-${incident.id.replace('INC-', '')}`;
    const report = await generatePostmortemWithGemini(incident, reportId);
    incidentStore.addReport(report);

    const now = new Date().toISOString().slice(11, 19) + ' UTC';
    const reportEvent: TimelineEvent = {
      id: `t-${Date.now()}`,
      timestamp: now,
      title: 'Postmortem Report Authored',
      description: `Report ${reportId} authored & synced to Slack (#incident-response) and Jira (${report.jiraTicket}).`,
      type: 'report',
      actor: 'Agent 04 (Report Agent)',
    };

    incidentStore.updateIncident(req.params.id, {
      postmortemId: reportId,
      timeline: [...incident.timeline, reportEvent],
    });

    res.json({ success: true, data: report });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Report generation temporarily unavailable.' });
  }
});

// GET /api/reports
apiApp.get('/api/reports', (_req: Request, res: Response) => {
  res.json({ success: true, data: incidentStore.getReports() });
});

// GET /api/reports/:id
apiApp.get('/api/reports/:id', (req: Request, res: Response) => {
  const report = incidentStore.getReport(req.params.id);
  if (!report) {
    res.status(404).json({ success: false, error: 'Report not found' });
    return;
  }
  res.json({ success: true, data: report });
});

// POST /api/incidents/reset
apiApp.post('/api/incidents/reset', (_req: Request, res: Response) => {
  incidentStore.reset();
  res.json({ success: true, data: incidentStore.getIncidents() });
});
