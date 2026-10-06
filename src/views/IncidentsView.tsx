import React, { useState } from 'react';
import { useIncident } from '../context/IncidentContext';
import { IncidentDetailView } from './IncidentDetailView';

export const IncidentsView: React.FC = () => {
  const {
    incidents,
    selectedIncidentId,
    setSelectedIncidentId,
    simulateIncident,
  } = useIncident();

  const [filter, setFilter] = useState<'ALL' | 'ACTIVE' | 'RESOLVED'>('ALL');
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'detail' | 'list'>('detail');

  const filtered = incidents.filter((inc) => {
    if (filter === 'ACTIVE' && inc.status === 'resolved') return false;
    if (filter === 'RESOLVED' && inc.status !== 'resolved') return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        inc.name.toLowerCase().includes(q) ||
        inc.id.toLowerCase().includes(q) ||
        inc.service.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const selectedIncident = incidents.find((i) => i.id === selectedIncidentId);

  // If in detail mode and an incident is selected, render IncidentDetailView with a header back/list toggle
  if (viewMode === 'detail' && selectedIncident) {
    return (
      <div className="flex flex-col w-full">
        {/* Sub-bar allowing quick navigation across incidents */}
        <div className="w-full bg-surface-container-low border-b border-outline-variant px-margin py-2 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('list')}
              className="text-xs font-label-caps text-on-surface-variant hover:text-on-surface flex items-center gap-1 px-2 py-1 rounded bg-surface-container hover:bg-surface-container-high transition-colors"
            >
              <span className="material-symbols-outlined text-[14px]">arrow_back</span>
              All Incidents ({incidents.length})
            </button>
            <span className="text-on-surface-variant">•</span>
            <div className="flex items-center gap-1 overflow-x-auto">
              {incidents.map((inc) => (
                <button
                  key={inc.id}
                  onClick={() => setSelectedIncidentId(inc.id)}
                  className={`px-2.5 py-1 text-xs font-code-inline rounded transition-colors flex items-center gap-1.5 ${
                    inc.id === selectedIncidentId
                      ? 'bg-surface-container-highest text-on-surface font-bold ring-1 ring-outline'
                      : 'text-on-surface-variant hover:bg-surface-container'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      inc.status === 'resolved'
                        ? 'bg-primary'
                        : inc.severity === 'critical'
                        ? 'bg-error'
                        : 'bg-secondary'
                    }`}
                  ></span>
                  <span>{inc.id}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={simulateIncident}
            className="text-xs font-label-caps text-primary hover:underline flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[14px]">replay</span>
            Simulate Demo Flow
          </button>
        </div>

        <IncidentDetailView />
      </div>
    );
  }

  // Otherwise, render full table / list view
  return (
    <div className="flex flex-col w-full px-margin py-space-xl gap-space-xl">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
        <div>
          <span className="font-label-caps text-label-caps uppercase text-primary tracking-wider">
            TRIAGE &amp; INCIDENT QUEUE
          </span>
          <h1 className="font-headline-lg text-headline-lg text-on-surface font-bold mt-1">
            Production Incidents
          </h1>
          <p className="font-body-default text-body-default text-on-surface-variant mt-1">
            Real-time feed of anomalous signals correlated into actionable incidents.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex rounded-lg border border-outline-variant p-0.5 bg-surface-container-low">
            {(['ALL', 'ACTIVE', 'RESOLVED'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setFilter(mode)}
                className={`px-3 py-1 text-xs rounded font-label-caps ${
                  filter === mode
                    ? 'bg-surface-container-highest text-on-surface font-semibold'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          <input
            type="text"
            placeholder="Search incident name or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-surface-container-low border border-outline-variant rounded px-3 py-1.5 text-xs font-code-inline text-on-surface focus:outline-none focus:border-primary w-60"
          />
        </div>
      </div>

      {/* Incidents List Table */}
      <div className="bg-surface-container-low rounded-xl border border-outline-variant overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-body-default text-body-default">
            <thead>
              <tr className="border-b border-outline-variant bg-surface-container text-xs font-label-caps text-on-surface-variant">
                <th className="py-3 px-4">Incident ID</th>
                <th className="py-3 px-4">Title &amp; Target Service</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Error Rate</th>
                <th className="py-3 px-4">Latency</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/60 font-code-telemetry text-code-telemetry">
              {filtered.map((inc) => {
                const isResolved = inc.status === 'resolved';
                const isCritical = inc.severity === 'critical';

                return (
                  <tr
                    key={inc.id}
                    onClick={() => {
                      setSelectedIncidentId(inc.id);
                      setViewMode('detail');
                    }}
                    className="hover:bg-surface-container-lowest transition-colors cursor-pointer"
                  >
                    <td className="py-3 px-4 font-bold text-on-surface">{inc.id}</td>
                    <td className="py-3 px-4">
                      <div className="font-headline-sm text-sm text-on-surface font-semibold">
                        {inc.name}
                      </div>
                      <div className="text-xs text-on-surface-variant font-code-inline">
                        {inc.service}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`font-label-caps text-xs px-2 py-0.5 rounded ${
                          isCritical
                            ? 'bg-error-container text-error'
                            : 'bg-secondary-container text-secondary'
                        }`}
                      >
                        {inc.severity.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`font-label-caps text-xs px-2 py-0.5 rounded ${
                          isResolved
                            ? 'bg-primary-container text-on-primary-container'
                            : 'bg-surface-container-highest text-on-surface'
                        }`}
                      >
                        {inc.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`font-bold ${
                          inc.metrics.errorRate > 5 ? 'text-error' : 'text-primary'
                        }`}
                      >
                        {inc.metrics.errorRate}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-on-surface">
                      {inc.metrics.latency}
                      {inc.metrics.latencyUnit}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedIncidentId(inc.id);
                          setViewMode('detail');
                        }}
                        className="px-3 py-1 rounded bg-primary text-on-primary hover:bg-primary-container font-label-caps text-xs transition-all"
                      >
                        {isResolved ? 'View' : 'Investigate'}
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-on-surface-variant text-sm">
                    No incidents matching current criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
