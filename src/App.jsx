import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import OnboardingPage from "./OnboardingPage";
import TouchIDPage from "./TouchIDPage";
import EconomicIndicatorPage from "./EconomicIndicator";
import Relogin from './Relogin'; 
import AccountLocked from "./AccountLocked";
import EnterPin from "./EnterPin";
import EconomicDashboard from "./economic-dashboard";


function App() {
  return (
    <Router>
      {/* Navigation Bar */}
      <nav
        style={{
          padding: "12px 24px",
          backgroundColor: "#f0f0f0",
          borderBottom: "1px solid #ccc",
          marginBottom: "20px",
        }}
      >
        <Link to="/" style={{ marginRight: "16px" }}>Onboarding</Link>
        <Link to="/touchid" style={{ marginRight: "16px" }}>Touch ID</Link>
        <Link to="/economic">Economic Indicator</Link>
      {/* tsx */}
      <Route path="/dashboard" element={<EconomicDashboard />} />
      </nav>
      
      {/* Page Routing */}
      <Routes>
        <Route path="/" element={<OnboardingPage />} />
        {/* Demo */}
        <Route path="/touchid" element={<TouchIDPage />} /> 
        <Route path="/economic" element={<EconomicIndicatorPage />} />
        {/* new */}
        <Route path="/relogin" element={<Relogin />} />
        <Route path="/account-locked" element={<AccountLocked />} />
        <Route path="/enter-pin" element={<EnterPin />} />
      </Routes>
    </Router>
  );
}

export default App;
