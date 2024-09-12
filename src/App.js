import "./App.css";
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from "react-router-dom";
import CheckPlag from "./pages/checkPlag/CheckPlag";
import CertGen from "./pages/CertGen/CertGen";
import { useEffect, useState } from "react";

function App() {
  const [activeTab, setActiveTab] = useState("/check-plag");

  useEffect(() => {
    setActiveTab(window.location.pathname);
  }, []);

  return (
    <div className="App">
      <Router>
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
