import React from 'react';
import { useIncident, NavTab } from '../context/IncidentContext';

export const Header: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    activeIncidentCount,
    simulateIncident,
    resetDemo,
    activeIncident,
    isAutonomousDemoRunning,
    runAutonomousDemo,
  } = useIncident();

  const isDegraded = activeIncidentCount > 0;

  return (
    <header className="fixed top-0 left-0 right-0 w-full z-50 bg-surface/95 backdrop-blur border-b border-outline-variant">
      <div className="h-16 w-full px-margin flex items-center justify-between gap-space-md">
        {/* Brand */}
        <div className="flex items-center gap-space-md">
          <img
            alt="DevOps Copilot Logo"
            className="h-8 w-auto object-contain cursor-pointer"
            src="https://lh3.googleusercontent.com/aida/AEtjO1VaPSVh_dVkJOppfBEBhBU-NKbK-I10AUlk5Fro9FKAoE-kg3CA97FVpPGYJFICyPxxEmozQvxy8YuJl1W_oQ7cK3AP0fOJE8KGMtEwhzzDRkap8hQ0WY-ILceyRRT7r2cEasXLzqAgO3l1S-SvjiaIHNJk1cFGRRFvYUn9GYRm4LFFQd1uIywL-pK0mC_DZBVnjPyJ_nLQtZWLLIOriDEVGlt6iF-1Jdw5tCoDO2gOrve3LkTMeq99q_Q"
            onClick={() => setActiveTab('ai-agents')}
          />
          <span
            className="font-headline-sm text-headline-sm uppercase text-on-surface tracking-tight cursor-pointer"
            onClick={() => setActiveTab('ai-agents')}
          >
            DEVOPS COPILOT
          </span>
          <span className="font-label-caps text-label-caps bg-surface-container-high text-primary px-2 py-0.5 rounded border border-outline-variant">
            AI AGENT v2.4
          </span>
        </div>

        {/* Navigation */}
        <nav className="hidden xl:flex items-center gap-1">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded transition-colors inline-flex items-center gap-1.5 text-body-default ${
              activeTab === 'overview'
                ? 'bg-surface-container text-on-surface font-headline-sm'
                : 'text-on-surface-variant font-body-default hover:bg-surface-container-high hover:text-on-surface'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('incidents')}
            className={`px-3 py-1.5 rounded transition-colors inline-flex items-center gap-1.5 text-body-default ${
              activeTab === 'incidents'
                ? 'bg-surface-container text-on-surface font-headline-sm'
                : 'text-on-surface-variant font-body-default hover:bg-surface-container-high hover:text-on-surface'
            }`}
          >
            Incidents{' '}
            {activeIncidentCount > 0 && (
              <span className="font-label-caps text-label-caps bg-error-container text-error px-1.5 py-0.5 rounded-full">
                {activeIncidentCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('monitoring-system-signals')}
            className={`px-3 py-1.5 rounded transition-colors inline-flex items-center gap-1.5 text-body-default ${
              activeTab === 'monitoring-system-signals'
                ? 'bg-surface-container text-on-surface font-headline-sm'
                : 'text-on-surface-variant font-body-default hover:bg-surface-container-high hover:text-on-surface'
            }`}
          >
            Monitoring / System Signals
          </button>
          <button
            onClick={() => setActiveTab('ai-agents')}
            className={`px-3 py-1.5 rounded transition-colors inline-flex items-center gap-1.5 text-body-default ${
              activeTab === 'ai-agents'
                ? 'bg-surface-container text-on-surface font-headline-sm'
                : 'text-on-surface-variant font-body-default hover:bg-surface-container-high hover:text-on-surface'
            }`}
          >
            AI Agents
          </button>
          <button
            onClick={() => setActiveTab('postmortems-reports')}
            className={`px-3 py-1.5 rounded transition-colors inline-flex items-center gap-1.5 text-body-default ${
              activeTab === 'postmortems-reports'
                ? 'bg-surface-container text-on-surface font-headline-sm'
                : 'text-on-surface-variant font-body-default hover:bg-surface-container-high hover:text-on-surface'
            }`}
          >
            Postmortems / Reports
          </button>
        </nav>

        {/* Right Tools & Status */}
        <div className="flex items-center gap-space-sm sm:gap-space-md">
          {/* Demo Action Pills */}
          <div className="flex items-center gap-1.5">
            {isAutonomousDemoRunning ? (
              <div className="px-2.5 py-1 text-xs rounded border border-primary bg-primary-container text-on-primary-container font-label-caps flex items-center gap-1.5 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
                <span>AUTONOMOUS DEMO RUNNING...</span>
              </div>
            ) : (
              <>
                <button
                  onClick={runAutonomousDemo}
                  title="Run automated end-to-end incident response flow"
                  className="px-2.5 py-1 text-xs rounded border border-primary/50 bg-primary text-on-primary hover:bg-primary-container transition-all flex items-center gap-1 font-label-caps shadow-xs"
                >
                  <span className="material-symbols-outlined text-[14px]">play_arrow</span>
                  <span className="hidden sm:inline">Run Full Demo</span>
                  <span className="sm:hidden">Demo</span>
                </button>
                <button
                  onClick={simulateIncident}
                  title="Trigger simulated Payment API Failure incident"
                  className="px-2 py-1 text-xs rounded border border-error/40 bg-error-container/40 text-error hover:bg-error-container hover:text-on-error-container transition-all flex items-center gap-1 font-label-caps"
                >
                  <span className="material-symbols-outlined text-[14px]">bolt</span>
                  <span className="hidden md:inline">Simulate Incident</span>
                </button>
                <button
                  onClick={resetDemo}
                  title="Reset state to baseline"
                  className="px-2 py-1 text-xs rounded border border-outline-variant hover:bg-surface-container-high text-on-surface-variant transition-all font-label-caps hidden lg:inline-flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[14px]">refresh</span>
                  Reset
                </button>
              </>
            )}
          </div>


          {/* Region Status */}
          <div className="hidden sm:flex items-center gap-2 bg-surface-container-low px-3 py-1.5 rounded-full border border-outline-variant">
            <span className="relative flex h-2 w-2">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  isDegraded ? 'bg-error' : 'bg-primary'
                }`}
              ></span>
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${
                  isDegraded ? 'bg-error' : 'bg-primary'
                }`}
              ></span>
            </span>
            <span className="font-code-telemetry text-code-telemetry text-on-surface-variant">
              Production • us-east-1
            </span>
          </div>

          {/* Notifications */}
          <button
            onClick={() => setActiveTab('incidents')}
            aria-label="Notifications"
            className="relative p-2 rounded hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            {isDegraded && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full ring-2 ring-surface"></span>
            )}
          </button>

          {/* User Profile */}
          <div className="relative flex items-center" title="Maya Lin (Lead SRE)">
            <img
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover ring-1 ring-outline-variant"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAZeb0ck1gLyYvzOOvhAC1Lgu5jJ9xBQpqLSPAjuGBrNiOVrwhotHNXSldPGq9kTotWOxHw8F3oHN5d0SbfP5Am3CeEQEX4uuYrlLziJLHBJFqsvj-dg9eA9b61GDwF_SIe2eglDKh2-wTovBGtfq8wpDh9ypid1SnUQ0N7eR6bdj4tgIP5_KS_G3bVtDCXkTogeSxIVIHWbzGNyXs7tveTYXbuUeuqoL2HUbw_qD0u1pGqZfRBVd65"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-primary rounded-full ring-2 ring-surface"></span>
          </div>
        </div>
      </div>
    </header>
  );
};
