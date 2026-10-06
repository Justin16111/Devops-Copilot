import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-surface-container-low border-t border-outline-variant py-space-md">
      <div className="w-full px-margin flex flex-col md:flex-row items-center justify-between gap-space-sm text-on-surface-variant font-code-telemetry text-code-telemetry">
        <div>© 2024 DEVOPS COPILOT • Autonomous Operational Resilience Engine</div>
        <div className="flex items-center gap-space-md">
          <span>Telemetry Stream: Latency 14ms</span>
          <span>Runbook Sync: OK</span>
        </div>
      </div>
    </footer>
  );
};
