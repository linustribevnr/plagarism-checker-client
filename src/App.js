import "./App.css";
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from "react-router-dom";
import CheckPlag from "./pages/checkPlag/CheckPlag";
import CertGen from "./pages/CertGen/CertGen";
import { useEffect, useState } from "react";
import logo from "./Assets/turinghut_logo.png";

function App() {
  const [activeTab, setActiveTab] = useState("/check-plag");

  useEffect(() => {
    setActiveTab(window.location.pathname);
  }, []);

  return (
    <div className="App">
      <Router>
        <header className="header">
          <div className="logo-tabs-container">
            <div className="logo">
              <img src={logo} alt="Logo" />
            </div>
            <div className="tabs">
              <Link
                to="/check-plag"
                className={`tab-link ${activeTab === "/check-plag" ? "active" : ""}`}
                onClick={() => setActiveTab("/check-plag")}
              >
                Plag Checker
              </Link>
              <Link
                to="/cert-gen"
                className={`tab-link ${activeTab === "/cert-gen" ? "active" : ""}`}
                onClick={() => setActiveTab("/cert-gen")}
              >
                Cert Gen
              </Link>
            </div>
          </div>
        </header>

        <Routes>
          <Route path="/" element={<Navigate to="/check-plag" />} />
          <Route path="/check-plag" element={<CheckPlag />} />
          <Route path="/cert-gen" element={<CertGen />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;