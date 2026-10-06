import React, { useState } from 'react';
import { useIncident } from '../context/IncidentContext';

export const MonitoringView: React.FC = () => {
  const {
    liveMetrics,
    liveLogs,
    logFilter,
    setLogFilter,
    logSearch,
    setLogSearch,
    activeIncident,
  } = useIncident();

  const [isPaused, setIsPaused] = useState(false);

  const filteredLogs = liveLogs.filter((log) => {
    if (logFilter !== 'ALL' && log.level !== logFilter) return false;
    if (logSearch) {
      const q = logSearch.toLowerCase();
      return (
        log.message.toLowerCase().includes(q) ||
        log.service.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Helper for generating SVG polyline points from metrics array
  const createPolyline = (
    data: number[],
    minVal: number,
    maxVal: number,
    width = 300,
    height = 80
  ) => {
    if (data.length === 0) return '';
    const range = maxVal - minVal || 1;
    return data
      .map((val, idx) => {
        const x = (idx / (data.length - 1 || 1)) * width;
        const normalized = Math.max(0, Math.min(1, (val - minVal) / range));
        const y = height - normalized * (height - 10) - 5;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');
  };

  const errorRates = liveMetrics.map((p) => p.errorRate);
  const latencies = liveMetrics.map((p) => p.latencyMs);
  const dbHandles = liveMetrics.map((p) => p.dbConnections);
  const cpus = liveMetrics.map((p) => p.cpu);
  const memories = liveMetrics.map((p) => p.memory);

  const latestError = errorRates[errorRates.length - 1] ?? 0.8;
  const latestLatency = latencies[latencies.length - 1] ?? 180;
  const latestDb = dbHandles[dbHandles.length - 1] ?? 42;
  const latestCpu = cpus[cpus.length - 1] ?? 24;
  const latestMem = memories[memories.length - 1] ?? 45;

  return (
    <div className="flex flex-col w-full px-margin py-space-xl gap-space-xl">
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-md">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-label-caps text-label-caps uppercase text-primary tracking-wider">
              HIGH-FREQUENCY TELEMETRY INGESTION
            </span>
            <span className="text-on-surface-variant font-code-telemetry text-code-telemetry">•</span>
            <span className="font-label-caps text-label-caps uppercase text-on-surface-variant tracking-wider">
              14.2K EVT/S STREAM
            </span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface font-bold mt-1">
            Monitoring &amp; System Signals
          </h1>
          <p className="font-body-default text-body-default text-on-surface-variant mt-1">
            Real-time telemetry timeseries across error distributions, p99 latency envelopes, and connection pools.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-surface-container-low px-3 py-1.5 rounded-full border border-outline-variant">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          <span className="font-code-telemetry text-code-telemetry text-on-surface">
            Buffer: 60s window • Sample rate: 500ms
          </span>
        </div>
      </div>

      {/* 5 Real-Time Telemetry Sparkline Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-space-md">
        {/* Error Rate */}
        <div className="bg-surface-container-low rounded-xl p-space-md border border-outline-variant/60 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-label-caps text-on-surface-variant">
              <span>ERROR RATE (%)</span>
              <span className={latestError > 5 ? 'text-error font-bold' : 'text-primary'}>
                {latestError > 5 ? 'BREACH' : 'OK'}
              </span>
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span
                className={`font-headline-md text-headline-md font-bold tracking-tight ${
                  latestError > 5 ? 'text-error' : 'text-primary'
                }`}
              >
                {latestError.toFixed(1)}%
              </span>
              <span className="text-xs text-on-surface-variant font-code-telemetry">SLA &lt;1%</span>
            </div>
          </div>
          <div className="h-20 w-full mt-2">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 300 80" preserveAspectRatio="none">
              <polyline
                fill="none"
                stroke={latestError > 5 ? '#c94a4a' : '#2f7d46'}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={createPolyline(errorRates, 0, 45, 300, 80)}
              />
            </svg>
          </div>
        </div>

        {/* Latency */}
        <div className="bg-surface-container-low rounded-xl p-space-md border border-outline-variant/60 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-label-caps text-on-surface-variant">
              <span>P99 LATENCY (MS)</span>
              <span className={latestLatency > 1000 ? 'text-error font-bold' : 'text-primary'}>
                {latestLatency > 1000 ? 'SPIKE' : 'OK'}
              </span>
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span
                className={`font-headline-md text-headline-md font-bold tracking-tight ${
                  latestLatency > 1000 ? 'text-error' : 'text-on-surface'
                }`}
              >
                {latestLatency > 1000 ? `${(latestLatency / 1000).toFixed(1)}s` : `${Math.round(latestLatency)}ms`}
              </span>
              <span className="text-xs text-on-surface-variant font-code-telemetry">p99 threshold</span>
            </div>
          </div>
          <div className="h-20 w-full mt-2">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 300 80" preserveAspectRatio="none">
              <polyline
                fill="none"
                stroke={latestLatency > 1000 ? '#c94a4a' : '#0e6430'}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={createPolyline(latencies, 100, 9500, 300, 80)}
              />
            </svg>
          </div>
        </div>

        {/* DB Connection Pool */}
        <div className="bg-surface-container-low rounded-xl p-space-md border border-outline-variant/60 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-label-caps text-on-surface-variant">
              <span>DB POOL HANDLES</span>
              <span className={latestDb >= 50 && activeIncident?.status !== 'resolved' ? 'text-error font-bold' : 'text-primary'}>
                {latestDb >= 50 && activeIncident?.status !== 'resolved' ? 'EXHAUSTED' : 'HEADROOM'}
              </span>
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span
                className={`font-headline-md text-headline-md font-bold tracking-tight ${
                  latestDb >= 50 && activeIncident?.status !== 'resolved' ? 'text-error' : 'text-primary'
                }`}
              >
                {latestDb} / {activeIncident?.status === 'resolved' ? '100' : '50'}
              </span>
              <span className="text-xs text-on-surface-variant font-code-telemetry">active handles</span>
            </div>
          </div>
          <div className="h-20 w-full mt-2">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 300 80" preserveAspectRatio="none">
              <polyline
                fill="none"
                stroke={latestDb >= 50 && activeIncident?.status !== 'resolved' ? '#c94a4a' : '#2f7d46'}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={createPolyline(dbHandles, 20, 55, 300, 80)}
              />
            </svg>
          </div>
        </div>

        {/* CPU Utilization */}
        <div className="bg-surface-container-low rounded-xl p-space-md border border-outline-variant/60 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-label-caps text-on-surface-variant">
              <span>CPU UTILIZATION (%)</span>
              <span className="text-primary font-bold">STABLE</span>
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="font-headline-md text-headline-md font-bold tracking-tight text-on-surface">
                {Math.round(latestCpu)}%
              </span>
              <span className="text-xs text-on-surface-variant font-code-telemetry">6 nodes</span>
            </div>
          </div>
          <div className="h-20 w-full mt-2">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 300 80" preserveAspectRatio="none">
              <polyline
                fill="none"
                stroke="#45664c"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={createPolyline(cpus, 10, 100, 300, 80)}
              />
            </svg>
          </div>
        </div>

        {/* Memory Usage */}
        <div className="bg-surface-container-low rounded-xl p-space-md border border-outline-variant/60 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-label-caps text-on-surface-variant">
              <span>MEMORY ALLOCATION</span>
              <span className="text-primary font-bold">NORMAL</span>
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="font-headline-md text-headline-md font-bold tracking-tight text-on-surface">
                {Math.round(latestMem)}%
              </span>
              <span className="text-xs text-on-surface-variant font-code-telemetry">14.2 GB / 32 GB</span>
            </div>
          </div>
          <div className="h-20 w-full mt-2">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 300 80" preserveAspectRatio="none">
              <polyline
                fill="none"
                stroke="#53765f"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={createPolyline(memories, 20, 80, 300, 80)}
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Live Logs Streamer */}
      <div className="bg-surface-container-low rounded-xl p-space-lg border border-outline-variant shadow-sm flex flex-col gap-space-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-sm border-b border-outline-variant pb-space-sm">
          <div className="flex items-center gap-space-sm">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></span>
              <h2 className="font-headline-sm text-headline-sm text-on-surface">
                Live Distributed Trace &amp; Log Ingestion
              </h2>
            </div>
            <span className="font-label-caps text-xs text-on-surface-variant bg-surface-container px-2 py-0.5 rounded">
              {filteredLogs.length} Events In View
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Filter Buttons */}
            <div className="inline-flex rounded-lg border border-outline-variant p-0.5 bg-surface-container-lowest">
              {(['ALL', 'INFO', 'WARN', 'ERROR'] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setLogFilter(lvl)}
                  className={`px-3 py-1 text-xs rounded font-label-caps ${
                    logFilter === lvl
                      ? 'bg-surface-container-highest text-on-surface font-semibold'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <input
              type="text"
              placeholder="Search regex / string..."
              value={logSearch}
              onChange={(e) => setLogSearch(e.target.value)}
              className="bg-surface-container-lowest border border-outline-variant rounded px-3 py-1 text-xs font-code-inline text-on-surface focus:outline-none focus:border-primary w-48"
            />

            <button
              onClick={() => setIsPaused(!isPaused)}
              className="px-2.5 py-1 text-xs font-label-caps rounded border border-outline-variant hover:bg-surface-container-high text-on-surface-variant"
            >
              {isPaused ? 'RESUME STREAM' : 'PAUSE'}
            </button>
          </div>
        </div>

        {/* Console Viewport */}
        <div className="bg-surface-container-lowest rounded-lg p-4 font-code-telemetry text-code-telemetry border border-outline-variant/60 max-h-96 overflow-y-auto flex flex-col gap-2">
          {filteredLogs.map((log) => (
            <div
              key={log.id}
              className={`flex items-start gap-2.5 text-xs py-0.5 ${
                log.level === 'ERROR'
                  ? 'text-error font-medium'
                  : log.level === 'WARN'
                  ? 'text-secondary'
                  : 'text-on-surface'
              }`}
            >
              <span className="text-on-surface-variant font-code-inline select-none min-w-[90px]">
                {log.timestamp}
              </span>
              <span
                className={`font-label-caps px-1 rounded text-[10px] ${
                  log.level === 'ERROR'
                    ? 'bg-error-container text-error'
                    : log.level === 'WARN'
                    ? 'bg-secondary-container text-secondary'
                    : 'bg-surface-container text-on-surface-variant'
                }`}
              >
                {log.level}
              </span>
              <span className="text-on-surface-variant font-medium select-none min-w-[120px]">
                [{log.service}]
              </span>
              <span className="break-all">{log.message}</span>
            </div>
          ))}
          {filteredLogs.length === 0 && (
            <div className="text-center py-8 text-on-surface-variant text-sm font-body-sm">
              No telemetry events matched the active query filter.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
