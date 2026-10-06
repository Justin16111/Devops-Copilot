/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { IncidentProvider, useIncident } from './context/IncidentContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { OverviewView } from './views/OverviewView';
import { IncidentsView } from './views/IncidentsView';
import { MonitoringView } from './views/MonitoringView';
import { AiAgentsView } from './views/AiAgentsView';
import { PostmortemsView } from './views/PostmortemsView';

const MainContent: React.FC = () => {
  const { activeTab, error } = useIncident();

  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface">
      <Header />

      {error && (
        <div className="fixed top-16 left-0 right-0 z-40 bg-error-container text-on-error-container px-margin py-2 text-xs font-label-caps flex items-center justify-between border-b border-error">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px]">error</span>
            <span>{error}</span>
          </div>
        </div>
      )}

      <main className="w-full pt-16 bg-surface flex-1 min-h-[calc(100vh-4rem)]">
        {activeTab === 'overview' && <OverviewView />}
        {activeTab === 'incidents' && <IncidentsView />}
        {activeTab === 'monitoring-system-signals' && <MonitoringView />}
        {activeTab === 'ai-agents' && <AiAgentsView />}
        {activeTab === 'postmortems-reports' && <PostmortemsView />}
      </main>

      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <IncidentProvider>
      <MainContent />
    </IncidentProvider>
  );
}
