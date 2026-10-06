import React from 'react';
import { useIncident } from '../context/IncidentContext';

export const OverviewView: React.FC = () => {
  const {
    incidents,
    activeIncidentCount,
    systemHealth,
    setSelectedIncidentId,
    setActiveTab,
    simulateIncident,
  } = useIncident();

  const handleInvestigate = (id: string) => {
    setSelectedIncidentId(id);
    setActiveTab('incidents');
  };

  return (
    <div className="flex flex-col w-full px-margin py-space-xl gap-space-xl">
      {/* Top Banner & KPI Stat Blocks */}
      <div className="flex flex-col gap-space-md">
        <div className="flex flex-wrap items-center justify-between gap-space-sm">
          <div className="flex items-center gap-2">
            <span className="font-label-caps text-label-caps uppercase text-primary tracking-wider">
              ENTERPRISE SRE RESILIENCE PLATFORM
            </span>
            <span className="text-on-surface-variant font-code-telemetry text-code-telemetry">•</span>
            <span className="font-label-caps text-label-caps uppercase text-on-surface-variant tracking-wider">
              REAL-TIME PRODUCTION OVERVIEW
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={simulateIncident}
              className="bg-primary text-on-primary hover:bg-primary-container px-3.5 py-1.5 rounded text-xs font-label-caps flex items-center gap-1.5 transition-all shadow-sm"
            >
              <span className="material-symbols-outlined text-[16px]">play_circle</span>
              Start Demo Simulation (Payment API)
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-lg">
          <div className="flex flex-col">
            <h1 className="font-display-hero text-display-hero text-on-surface tracking-tight leading-none">
              Resilience Mesh.
            </h1>
            <h1 className="font-display-hero text-display-hero text-primary italic font-normal tracking-tight leading-none mt-1">
              Autonomous Triage.
            </h1>
          </div>
          <p className="font-body-editorial text-body-editorial text-on-surface-variant max-w-xl pb-1">
            DevOps Copilot continuously monitors 24 services, detects anomalous telemetry thresholds, isolates causal topology with Gemini, and coordinates human-gated remediation runbooks.
          </p>
        </div>
      </div>

      {/* Hero Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
        <div className="bg-surface-container-low rounded-xl p-space-md shadow-sm border border-outline-variant/60 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
              System Health
            </span>
            <span className="material-symbols-outlined text-primary text-[20px]">verified</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-headline-lg text-headline-lg text-on-surface font-semibold tracking-tight">
              {systemHealth}
            </span>
            <span className="text-body-sm text-primary font-medium">99.99% SLA Target</span>
          </div>
          <div className="mt-3 font-code-telemetry text-code-telemetry text-on-surface-variant">
            Telemetry drops: 0.00%
          </div>
        </div>

        <div className="bg-surface-container-low rounded-xl p-space-md shadow-sm border border-outline-variant/60 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
              Active Incidents
            </span>
            <span className={`material-symbols-outlined text-[20px] ${activeIncidentCount > 0 ? 'text-error' : 'text-primary'}`}>
              warning
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={`font-headline-lg text-headline-lg font-semibold tracking-tight ${activeIncidentCount > 0 ? 'text-error' : 'text-primary'}`}>
              {activeIncidentCount}
            </span>
            <span className="text-body-sm text-on-surface-variant">
              {activeIncidentCount > 0 ? 'Requires attention' : 'All systems nominal'}
            </span>
          </div>
          <div className="mt-3 font-code-telemetry text-code-telemetry text-on-surface-variant">
            {activeIncidentCount > 0 ? '1 Critical (P0), 2 Warnings' : 'Zero unmitigated breaches'}
          </div>
        </div>

        <div className="bg-surface-container-low rounded-xl p-space-md shadow-sm border border-outline-variant/60 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
              Services Monitored
            </span>
            <span className="material-symbols-outlined text-primary text-[20px]">hub</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-headline-lg text-headline-lg text-on-surface font-semibold tracking-tight">
              24
            </span>
            <span className="text-body-sm text-on-surface-variant">Across 6 clusters</span>
          </div>
          <div className="mt-3 font-code-telemetry text-code-telemetry text-on-surface-variant">
            14,280 metrics/sec streaming
          </div>
        </div>

        <div className="bg-surface-container-low rounded-xl p-space-md shadow-sm border border-outline-variant/60 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
              Avg Resolution Time
            </span>
            <span className="material-symbols-outlined text-primary text-[20px]">timer</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-headline-lg text-headline-lg text-on-surface font-semibold tracking-tight">
              08m 42s
            </span>
            <span className="text-body-sm text-primary font-medium">-74% vs manual</span>
          </div>
          <div className="mt-3 font-code-telemetry text-code-telemetry text-on-surface-variant">
            Human-in-the-Loop gated
          </div>
        </div>
      </div>

      {/* Active Incidents Section */}
      <div className="flex flex-col gap-space-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-space-sm">
            <h2 className="font-headline-md text-headline-md text-on-surface">Active Incidents</h2>
            <span className="font-label-caps text-label-caps bg-surface-container-high px-2 py-0.5 rounded text-on-surface-variant">
              {incidents.length} Registered
            </span>
          </div>
          <button
            onClick={() => setActiveTab('incidents')}
            className="text-primary hover:underline font-body-sm text-body-sm flex items-center gap-1"
          >
            View all incidents <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>

        <div className="grid grid-cols-1 gap-space-md">
          {incidents.map((incident) => {
            const isResolved = incident.status === 'resolved';
            const isCritical = incident.severity === 'critical';

            return (
              <div
                key={incident.id}
                className={`bg-surface-container-low rounded-xl p-space-lg shadow-sm border transition-all ${
                  isCritical && !isResolved
                    ? 'border-error/40 hover:border-error'
                    : 'border-outline-variant hover:border-outline'
                }`}
              >
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-space-md">
                  <div className="flex flex-col gap-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-code-inline text-code-inline text-on-surface-variant font-bold">
                        {incident.id}
                      </span>
                      <span className="text-on-surface-variant">•</span>
                      <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                        {incident.name}
                      </h3>
                      <span
                        className={`font-label-caps text-label-caps px-2 py-0.5 rounded ${
                          isResolved
                            ? 'bg-primary-container text-on-primary-container'
                            : isCritical
                            ? 'bg-error-container text-error'
                            : 'bg-secondary-container text-secondary'
                        }`}
                      >
                        {isResolved ? 'RESOLVED' : incident.severity.toUpperCase()}
                      </span>
                      <span className="font-label-caps text-label-caps bg-surface-container-highest px-2 py-0.5 rounded text-on-surface-variant">
                        SERVICE: {incident.service}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2 bg-surface-container-lowest p-3 rounded-lg">
                      <div className="flex flex-col">
                        <span className="font-label-caps text-label-caps text-on-surface-variant">Error Rate</span>
                        <span
                          className={`font-code-telemetry text-code-telemetry font-bold ${
                            incident.metrics.errorRate > 5 ? 'text-error' : 'text-primary'
                          }`}
                        >
                          {incident.metrics.errorRate}%
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-label-caps text-label-caps text-on-surface-variant">Latency</span>
                        <span
                          className={`font-code-telemetry text-code-telemetry font-bold ${
                            incident.metrics.latency > 1 && incident.metrics.latencyUnit === 's'
                              ? 'text-error'
                              : 'text-on-surface'
                          }`}
                        >
                          {incident.metrics.latency}
                          {incident.metrics.latencyUnit}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-label-caps text-label-caps text-on-surface-variant">CPU Usage</span>
                        <span className="font-code-telemetry text-code-telemetry text-on-surface">
                          {incident.metrics.cpu}%
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-label-caps text-label-caps text-on-surface-variant">DB Connections</span>
                        <span
                          className={`font-code-telemetry text-code-telemetry font-bold ${
                            incident.metrics.databaseConnections.startsWith('50/50')
                              ? 'text-error'
                              : 'text-primary'
                          }`}
                        >
                          {incident.metrics.databaseConnections}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-2 self-stretch lg:self-center">
                    {isResolved ? (
                      <button
                        onClick={() => handleInvestigate(incident.id)}
                        className="w-full sm:w-auto px-4 py-2 rounded bg-surface-container-highest text-on-surface hover:bg-surface-container font-label-caps text-xs flex items-center justify-center gap-1.5 transition-all"
                      >
                        <span className="material-symbols-outlined text-[16px] text-primary">verified</span>
                        View Postmortem &amp; Trace
                      </button>
                    ) : (
                      <button
                        onClick={() => handleInvestigate(incident.id)}
                        className="w-full sm:w-auto px-5 py-2.5 rounded bg-primary text-on-primary hover:bg-primary-container font-label-caps text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
                      >
                        <span className="material-symbols-outlined text-[16px]">search</span>
                        Investigate
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Monitored Services Grid */}
      <div className="bg-surface-container-low rounded-xl p-space-lg shadow-sm border border-outline-variant/60 flex flex-col gap-space-md">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-headline-sm text-headline-sm text-on-surface">Microservice Mesh Topology</h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Continuous live health checks across containerized workloads
            </p>
          </div>
          <span className="font-label-caps text-label-caps text-primary flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            ALL PROBES HEALTHY
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 pt-2">
          {[
            { name: 'payment-gateway', p99: '180ms', status: 'ok' },
            { name: 'order-service', p99: '42ms', status: 'ok' },
            { name: 'auth-worker', p99: '88ms', status: 'ok' },
            { name: 'rds-prod-pg15', p99: '12ms', status: 'ok' },
            { name: 'redis-cache-cluster', p99: '2ms', status: 'ok' },
            { name: 'kafka-event-bus', p99: '5ms', status: 'ok' },
            { name: 'inventory-svc', p99: '65ms', status: 'ok' },
            { name: 'notification-worker', p99: '110ms', status: 'ok' },
            { name: 'search-elastic', p99: '35ms', status: 'ok' },
            { name: 'billing-adapter', p99: '95ms', status: 'ok' },
            { name: 'shipping-rate-calc', p99: '140ms', status: 'ok' },
            { name: 'telemetry-collector', p99: '8ms', status: 'ok' },
          ].map((svc) => (
            <div
              key={svc.name}
              className="bg-surface-container-lowest p-2.5 rounded-lg flex flex-col gap-1 border border-outline-variant/40"
            >
              <div className="flex items-center justify-between">
                <span className="font-code-inline text-[11px] truncate text-on-surface font-medium">
                  {svc.name}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
              </div>
              <span className="font-code-telemetry text-[11px] text-on-surface-variant">p99: {svc.p99}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
