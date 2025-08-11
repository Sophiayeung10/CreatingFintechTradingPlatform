import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Crypto from './assets/buttonsForSidebar/Crypto.png';
import Dividends from './assets/buttonsForSidebar/Dividends.png';
import Earning from './assets/buttonsForSidebar/Earning.png';
import Market from './assets/buttonsForSidebar/Market.png';
import More from './assets/buttonsForSidebar/More.png';
import News from './assets/buttonsForSidebar/News.png';
import Notification from './assets/buttonsForSidebar/Notification.png';
import Phi from './assets/buttonsForSidebar/Phi.png';
import Adjustment from './assets/buttonsForSidebar/Adjustment.png';
import SwingPhi from './assets/buttonsForSidebar/SwingPhi.png';
import Release from './assets/buttonsForSidebar/Release.png';
import Calendar from './assets/buttonsForSidebar/Calendar.png';
import Searchlogo from './assets/buttonsForSidebar/Searchlogo.png';
import './EconomicIndicator.css';


const EconomicIndicatorPage = () => {
  const [indicatorData, setIndicatorData] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("united states");
  const [selectedDate, setSelectedDate] = useState("2025-12-25");
  const [liveData, setLiveData] = useState({ cpi: null, retail: null, gdp: null });

  //inactivity control
  const [showRelogin, setShowRelogin] = useState(false);
  const [pin, setPin] = useState(["", "", "", "", ""]);
  const navigate = useNavigate();
  const inactivityTimer = useRef(null);

  // Inactivity Tracking 
  const resetInactivityTimer = () => {
    clearTimeout(inactivityTimer.current);
    inactivityTimer.current = setTimeout(() => {
      setShowRelogin(true);
    }, 5 * 1000); // 5 seconds for testing
  };
  //change to 15 * 60 * 1000); // 15 minutes

  //timer
  useEffect(() => {
    const events = ["mousemove", "keydown", "scroll", "click"];
    events.forEach(e => window.addEventListener(e, resetInactivityTimer));
    resetInactivityTimer(); 

  return () => {
      events.forEach(e => window.removeEventListener(e, resetInactivityTimer));
      clearTimeout(inactivityTimer.current);
    };
  }, []);

  //PIN inputs
  const handlePinChange = (value, index) => {
    if (/^\d?$/.test(value)) {
      const newPin = [...pin];
      newPin[index] = value;
      setPin(newPin);
      if (value && index < 4) {
        document.getElementById(`pin-${index + 1}`).focus();
      }
    }
  };

  const handleRelogin = () => {
    const enteredPin = pin.join("");
    if (enteredPin.length === 5) {
      console.log("Re-login attempt with PIN:", enteredPin);
      setShowRelogin(false);
      resetInactivityTimer(); // restart timer
    } else {
      alert("Please enter all 5 digits.");
    }
  };

  useEffect(() => {

    const apiKey = "guest:guest";
    const fetchLiveData = async () => {
      try {
        const [cpiRes, retailRes, gdpRes] = await Promise.all([
          axios.get(`https://api.tradingeconomics.com/historical/country/united states/indicator/cpi?c=${apiKey}`),
          axios.get(`https://api.tradingeconomics.com/historical/country/united states/indicator/retail sales?c=${apiKey}`),
          axios.get(`https://api.tradingeconomics.com/historical/country/united states/indicator/gdp?c=${apiKey}`)
        ]);

        setLiveData({
          cpi: cpiRes.data[0]?.value,
          retail: retailRes.data[0]?.value,
          gdp: gdpRes.data[0]?.value
        });
      } catch (error) {
        console.error('Error fetching live indicator data:', error);
      }
    };
    fetchLiveData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiKey = "guest:guest";
        const country = selectedCountry;
        const indicators = [
          "inflation rate",
          "gdp growth rate",
          "unemployment rate",
          "consumer confidence",
          "retail sales yoy",
          "industrial production",
          "housing starts",
          "interest rate",
          "business confidence"
        ];

        const promises = indicators.map(async (indicator) => {
          const encoded = encodeURIComponent(indicator);
          const url = `https://api.tradingeconomics.com/historical/country/${country}/indicator/${encoded}?c=${apiKey}`;
          const res = await axios.get(url);
          const data = res.data;
          if (!data || data.length === 0) return null;

          const latest = data[0];
          const previous = data[1] || null;

          return {
            name: indicator,
            value: latest?.value,
            previous: previous?.value ?? null,
            date: latest?.date
          };
        });

        const results = await Promise.all(promises);
        const cleanedResults = results.filter(Boolean);
        setIndicatorData(cleanedResults);
      } catch (error) {
        console.error("⚠️ Failed to fetch data from TradingEconomics API:", error.message);
      }
    };
    fetchData();
  }, [selectedCountry]);

  return (
    <div className="page-container">
      {/* 🔹 Relogin Modal */}
      {showRelogin && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2>Session Timed Out</h2>
            <p>Please enter your 5-digit password to continue</p>
            <div className="pin-container">
              {pin.map((digit, index) => (
                <input
                  key={index}
                  id={`pin-${index}`}
                  type="password"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handlePinChange(e.target.value, index)}
                  className="pin-input"
                />
              ))}
            </div>
            <button className="login-button" onClick={handleRelogin}>
              Log In
            </button>
            <p
              className="onboarding-link"
              onClick={() => navigate("/")}
            >
              Go to onboarding page
            </p>
          </div>
        </div>
      )}
      
      <div className="main-container">
        {/* Sidebar */}
        <aside className="sidebar">
          <img src={SwingPhi} alt="SwingPhi Logo" className="sidebar-logo" />
          <div className="sidebar-buttons">
            {[Market, News, Earning, Dividends, Phi, Crypto, Notification, More].map((img, idx) => (
              <button className="sidebar-btn" key={idx}>
                <img src={img} alt={`Sidebar ${idx}`} />
              </button>
            ))}
          </div>
          <img src={Release} alt="Profile" className="profile-pic" />
        </aside>

        {/* Main Content + Premium Tables side-by-side */}
        <main className="content-area">
          {/* Left: Main Content */}
          <div className="main-content">
            <section className="indicator-header">

  {/* Row 1: Search bar + Premium button */}
  <div className="flex items-center justify-between mb-4">
    <div className="flex items-center gap-2">
      <span className="search-container flex items-center gap-2">
        <img
          src={Searchlogo}
          alt="Search Icon"
          className="search-icon"
        />
        <input
          type="text"
          placeholder="Search companies"
          className="search-input"
        />
      </span>
      <button className="premium-button">Premium</button>
    </div>
  </div>
  </section>

  {/* Row 2: Title + Country/Date filters */}
<div className="indicator-header flex items-center gap-4 flex-wrap">
  <h2 className="indicator-title text-xl font-semibold whitespace-nowrap">
    Economic Indicator
  </h2>

  <div className="flex gap-3 shrink-0">
    <select
      value={selectedCountry}
      onChange={(e) => setSelectedCountry(e.target.value)}
      className="country-select w-36"
    >
      <option value="united states">United States</option>
      <option value="japan">Japan</option>
      <option value="germany">Germany</option>
      <option value="china">China</option>
      <option value="canada">Canada</option>
    </select>
    <input
      type="date"
      value={selectedDate}
      onChange={(e) => setSelectedDate(e.target.value)}
      className="date-input w-36"
    />
  </div>

  <div className="live-analysis shrink-0 flex flex-col justify-center ml-4">

    <div className="flex items-center justify-between gap-2">
      <h3 className="font-medium whitespace-nowrap">
        ! Live Demo: NFP Impact Analysis
      </h3>
    </div>
    <p className="text-gray-600 text-xs mt-1">
      See how our AI predicts and analyzes the market impact of Non-Farm Payrolls data in real-time.
    </p>
    <button className="watch-button bg-green-900 text-white px-3 py-1 text-xs rounded">
        Watch Demo
      </button>
  </div>
</div>
              {/* 6 options */}
  {/* Earnings */}
  <div className="option-container flex gap-2 shrink-0 ml-4">
  <select className="w-36 option-select">
    <option value="">Earnings</option>
    <option value="today">Today</option>
    <option value="this-week">This Week</option>
    <option value="next-week">Next Week</option>
  </select>

  {/* Dividends */}
  <select className="w-36 option-select">
    <option value="">Dividends</option>
    <option value="upcoming">Upcoming</option>
    <option value="past">Past</option>
  </select>

  {/* Splits */}
  <select className="w-36 option-select">
    <option value="">Splits</option>
    <option value="upcoming">Upcoming</option>
    <option value="recent">Recent</option>
  </select>

  {/* Economic Events */}
  <select className="w-36 option-select">
    <option value="">Economic Events</option>
    <option value="today">Today</option>
    <option value="this-week">This Week</option>
    <option value="next-week">Next Week</option>
  </select>

  {/* IPO */}
  <select className="w-36 option-select">
    <option value="">IPO</option>
    <option value="upcoming">Upcoming</option>
    <option value="recent">Recent</option>
  </select>

  {/* ETF */}
  <select className="w-36 option-select">
    <option value="">ETF</option>
    <option value="popular">Popular</option>
    <option value="new">New</option>
  </select>
  </div>

            <section className="live-indicators">
              <ul>
                <li>📈 CPI: {liveData.cpi ?? 'Loading...'}</li>
                <li>🛍️ Retail Sales: {liveData.retail ?? 'Loading...'}</li>
                <li>📊 GDP: {liveData.gdp ?? 'Loading...'}</li>
              </ul>
            </section>

           

            <div className="indicator-header-row">
              <h3 className="overview-title">Economic Indicators Overview</h3>
              <span className="search-container2">
                <img
                  src={Searchlogo}
                  alt="Search Icon"
                  className="search-icon2"
                />
              <input
                type="text"
                placeholder="Search Symbols"
                className="search-symbols"
              />
              </span>
            
            <h3 className="overview-title">Filter</h3>
            </div>

            <section className="indicator-overview">
              <p className="upcoming-title">Upcoming Economic Releases</p>
              <div className="economic-layout">
              <section className="economic-report-section">
                {/* CPI Report */}
                <div className="report-card">
                <div className="report-left">
                <span className="report-icon" aria-hidden="true">
        <svg
          role="img"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="#6b7280"
        >
          <title>Google Sheets</title>
          <path d="M11.318 12.545H7.91v-1.909h3.41v1.91zM14.728 0v6h6l-6-6zm1.363 10.636h-3.41v1.91h3.41v-1.91zm0 3.273h-3.41v1.91h3.41v-1.91zM20.727 6.5v15.864c0 .904-.732 1.636-1.636 1.636H4.909a1.636 1.636 0 0 1-1.636-1.636V1.636C3.273.732 4.005 0 4.909 0h9.318v6.5h6.5zm-3.273 2.773H6.545v7.909h10.91v-7.91zm-6.136 4.636H7.91v1.91h3.41v-1.91z" />
        </svg>
      </span>
      <div className="report-info">
        <h3 className="report-title">CPI Report</h3>
        <p className="report-date">2024-02-15 at 8:30 AM EST</p>
      </div>
    </div>

    <div className="report-right">
      <div className="report-values">
        <div className="forecast">
          <span className="label">Forecast</span>
          <span className="value">3.3%</span>
        </div>
        <div className="previous">
          <span className="label">Previous</span>
          <span className="value">3.4%</span>
        </div>
      </div>
      <span className="impact-tag high">high</span>
    </div>
  </div>

  {/* Retail Sales */}
  <div className="report-card">
    <div className="report-left">
      <span className="report-icon" aria-hidden="true">
        <svg
          role="img"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="#6b7280"
        >
          <title>Google Sheets</title>
          <path d="M11.318 12.545H7.91v-1.909h3.41v1.91zM14.728 0v6h6l-6-6zm1.363 10.636h-3.41v1.91h3.41v-1.91zm0 3.273h-3.41v1.91h3.41v-1.91zM20.727 6.5v15.864c0 .904-.732 1.636-1.636 1.636H4.909a1.636 1.636 0 0 1-1.636-1.636V1.636C3.273.732 4.005 0 4.909 0h9.318v6.5h6.5zm-3.273 2.773H6.545v7.909h10.91v-7.91zm-6.136 4.636H7.91v1.91h3.41v-1.91z" />
        </svg>
      </span>
      <div className="report-info">
        <h3 className="report-title">Retail Sales</h3>
        <p className="report-date">2024-02-12 at 8:30 AM EST</p>
      </div>
    </div>

    <div className="report-right">
      <div className="report-values">
        <div className="forecast">
          <span className="label">Forecast</span>
          <span className="value">0.4%</span>
        </div>
        <div className="previous">
          <span className="label">Previous</span>
          <span className="value">0.6%</span>
        </div>
      </div>
      <span className="impact-tag medium">medium</span>
    </div>
  </div>

  {/* GDP */}
  <div className="report-card">
    <div className="report-left">
      <span className="report-icon" aria-hidden="true">
        <svg
          role="img"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="#6b7280"
        >
          <title>Google Sheets</title>
          <path d="M11.318 12.545H7.91v-1.909h3.41v1.91zM14.728 0v6h6l-6-6zm1.363 10.636h-3.41v1.91h3.41v-1.91zm0 3.273h-3.41v1.91h3.41v-1.91zM20.727 6.5v15.864c0 .904-.732 1.636-1.636 1.636H4.909a1.636 1.636 0 0 1-1.636-1.636V1.636C3.273.732 4.005 0 4.909 0h9.318v6.5h6.5zm-3.273 2.773H6.545v7.909h10.91v-7.91zm-6.136 4.636H7.91v1.91h3.41v-1.91z" />
        </svg>
      </span>
      <div className="report-info">
        <h3 className="report-title">GDP</h3>
        <p className="report-date">2024-02-28 at 8:30 AM EST</p>
      </div>
    </div>

    <div className="report-right">
      <div className="report-values">
        <div className="forecast">
          <span className="label">Forecast</span>
          <span className="value">2.2%</span>
        </div>
        <div className="previous">
          <span className="label">Previous</span>
          <span className="value">2.1%</span>
        </div>
      </div>
      <span className="impact-tag high">high</span>
    </div>
  </div>
</section>
<section className="calendar-section">
              <div className="calendar-header">
                <img src={Calendar} alt="Calendar Logo" className="calendar-logo" />
                <h4>Economic Calendar & News Impact</h4>
              </div>

              <table className="calendar-table">
                <thead>
                  <tr>
                    <th>Date/Time</th>
                    <th>Event</th>
                    <th>Impact</th>
                    <th>Previous</th>
                    <th>Forecast</th>
                    <th>Phi Forecast</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>06 08:30 EST</td><td>Initial Jobless Claims</td><td className="high">High</td><td>224K</td><td>220K</td><td>215K</td></tr>
                  <tr><td>07 10:00 EST</td><td>ISM Services PMI</td><td className="medium">Medium</td><td>52.6</td><td>53.1</td><td>52.8</td></tr>
                  <tr><td>08 08:30 EST</td><td>Non-Farm Payrolls</td><td className="high">High</td><td>206K</td><td>190K</td><td>198K</td></tr>
                  <tr><td>09 08:30 EST</td><td>Core CPI MoM</td><td className="high">High</td><td>0.2%</td><td>0.3%</td><td>0.25%</td></tr>
                  <tr><td>10 10:00 EST</td><td>Michigan Consumer Sentiment</td><td className="low">Low</td><td>65.5</td><td>66.0</td><td>65.7</td></tr>
                </tbody>
              </table>
            </section>
            </div>
                
              <div className="indicator-grid">
                {indicatorData.map((item) => (
                  <div className="indicator-card high" key={item.name}>
                    <div className="indicator-title">{item.name.replace(/\byoy\b/i, '').toUpperCase()}</div>
                    <div className="indicator-value">{item.value}%</div>
                    <div className="indicator-desc">Previous: {item.previous ? item.previous + '%' : 'N/A'}</div>
                  </div>
                ))}
              </div>
            </section>

            

            <section className="market-impact">
              <h3>Market Impact Analysis</h3>
              <div className="impact-boxes">
                <div className="impact-box potential-rate">
                  <h4>Potential Rate Changes</h4>
                  <p>Current inflation trends suggest a 65% probability of rate cuts in Q2 2024.</p>
                </div>
                <div className="impact-box sector-sensitivity">
                  <h4>Sector Sensitivity</h4>
                  <p>Energy and Tech sectors most impacted by rate shifts.</p>
                </div>
                <div className="impact-box currency-impact">
                  <h4>Currency Impact</h4>
                  <p>USD expected to remain volatile post-Jackson Hole meeting.</p>
                </div>
              </div>
            </section>
          </div>

          {/* Right: Premium Tables sidebar */}
          <section className="premium-tables">
      {[
        {
      title: "Swing Phi Price Alerts",
      options: ["NIO CP Tgt Pr Pct Change", "TSLA CP Tgt Pr Pct Change"],
    },
    {
      title: "Breaking News",
      options: ["Headline 1", "Headline 2"],
    },
    {
      title: "Recently Viewed",
      options: [
        "TSLA CP Daily HL Pct %",
        "NIO CP Daily HL Pct %",
        "COIN CP Daily HL Pct %",
        "AAPL CP Daily HL Pct %",
        "AI CP Daily HL Pct %",
      ],
    },
  ].map((section, index) => {
    const isBreakingNews = section.title === "Breaking News";

    return (
      <div
        key={index}
        className="premium-table"
        style={{
          marginBottom: "32px",
          backgroundColor: isBreakingNews ? "#006400" : "white",
          padding: "16px",
          borderRadius: "8px",
        }}
      >
        {/* Selector instead of static title */}
        <select
          className="premium-select"
          style={{
            backgroundColor: isBreakingNews ? "#006400" : "white",
            color: isBreakingNews ? "white" : "black",
            width: "100%",
            marginBottom: "12px",
          }}
        >
          <option>{section.title}</option>
          {section.options.map((option, i) => (
            <option key={i}>{option}</option>
          ))}
        </select>

        {/* Display option items */}
        <div className="option-items">
          {section.options.map((item, i) => (
            <div
              key={i}
              className="option-item"
              style={{
                padding: "8px",
                backgroundColor: "white",
                border: "1px solid #ccc",
                borderRadius: "6px",
                marginBottom: "8px",
                fontSize: "14px",
              }}
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    );
  })}

  <hr style={{ margin: "32px 0", borderTop: "1px solid #ddd" }} />

  <div className="premium-table" style={{ marginBottom: "32px" }}>
    <div className="flex items-center justify-between">
      <h3>Release Notes</h3>
      <img src={Adjustment} alt="adjust" style={{ width: "18px", height: "18px" }} />
    </div>
    <div
      style={{
        height: "0px",
        background: "#f8f8f8",
        marginTop: "12px",
        marginBottom: "12px",
      }}
    ></div>
  </div>
</section>

        </main>
      </div>
    </div>
  );
};

export default EconomicIndicatorPage;