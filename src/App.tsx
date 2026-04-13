/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { BottomStrip } from './components/BottomStrip';
import { Dashboard } from './pages/Dashboard';
import { DigitalTwin } from './pages/DigitalTwin';
import { ProcessControl } from './pages/ProcessControl';
import { Maintenance } from './pages/Maintenance';
import { Safety } from './pages/Safety';
import { Logistics } from './pages/Logistics';
import { AIAssistant } from './pages/AIAssistant';
import { AlertBanner } from './components/AlertBanner';
import { WorkOrders } from './pages/WorkOrders';
import { Analytics } from './pages/Analytics';

export default function App() {
  return (
    <Router>
      <div className="flex flex-col h-screen bg-bg-primary text-text-primary overflow-hidden">
        <TopBar />
        <div className="flex flex-1 overflow-hidden pb-8">
          <Sidebar />
          <div className="flex-1 flex flex-col relative">
            <AlertBanner />
            <main className="flex-1 overflow-y-auto p-8">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/digital-twin" element={<DigitalTwin />} />
                <Route path="/process-control" element={<ProcessControl />} />
                <Route path="/maintenance" element={<Maintenance />} />
                <Route path="/work-orders" element={<WorkOrders />} />
                <Route path="/safety" element={<Safety />} />
                <Route path="/logistics" element={<Logistics />} />
                <Route path="/ai-assistant" element={<AIAssistant />} />
                <Route path="/analytics" element={<Analytics />} />
              </Routes>
            </main>
          </div>
        </div>
        <BottomStrip />
      </div>
    </Router>
  );
}
