
import React from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/layout/Layout';
import DashboardPage from './pages/DashboardPage';
import IpAnalysisPage from './pages/IpAnalysisPage';
import AnalysisProgressPage from './pages/AnalysisProgressPage';
import AnalysisErrorPage from './pages/AnalysisErrorPage';
import PricingPage from './pages/PricingPage';
import SettingsAndSupportPage from './pages/SettingsAndSupportPage';
import NotFoundPage from './pages/NotFoundPage';
import LoginPage from './pages/LoginPage';
import BlacklistPage from './pages/BlacklistPage';
import { useAppContext } from './hooks/useAppContext';
import IpAnalysisProgressPage from './pages/IpAnalysisProgressPage';
import IpAnalysisErrorPage from './pages/IpAnalysisErrorPage';
import BlacklistAnalysisProgressPage from './pages/BlacklistAnalysisProgressPage';
import BlacklistAnalysisErrorPage from './pages/BlacklistAnalysisErrorPage';

function App() {
  const { isAuthenticated } = useAppContext();

  return (
    <HashRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/ip-analysis" element={<IpAnalysisPage />} />
            <Route path="/ip-analysis/progress" element={<IpAnalysisProgressPage />} />
            <Route path="/ip-analysis/error" element={<IpAnalysisErrorPage />} />
            <Route path="/analysis/progress" element={<AnalysisProgressPage />} />
            <Route path="/analysis/error" element={<AnalysisErrorPage />} />
            <Route path="/blacklist" element={<BlacklistPage />} />
            <Route path="/blacklist/progress" element={<BlacklistAnalysisProgressPage />} />
            <Route path="/blacklist/error" element={<BlacklistAnalysisErrorPage />} />
            {/* <Route path="/pricing" element={<PricingPage />} /> */}
            {/* <Route path="/settings-support" element={<SettingsAndSupportPage />} /> */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Layout>
    </HashRouter>
  );
}

export default App;