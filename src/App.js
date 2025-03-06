// src/App.js
import React, { useEffect, useState } from 'react';
import PromptCard from './components/PromptCard';
import './App.css';

function App() {
  const [backendWarmed, setBackendWarmed] = useState(false);

  useEffect(() => {
    const backendURL = process.env.REACT_APP_BACKEND_URL;
    // Ping the backend with a dummy payload to warm it up
    fetch(`${backendURL}/transform`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: "ping", feedback: true })
    })
      .then(response => {
        console.log("Backend warmed up:", response.status);
        setBackendWarmed(true);
      })
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Political Polarization Transformer</h1>
        <p>
          Transform neutral political statements into progressively polarized versions.
          This project demonstrates how subtle shifts in language can dramatically change perceptions,
          highlighting the impact of algorithmic curation and echo chambers in the digital age.
        </p>
      </header>

      <p className="note">
        Heads up: The very first request might be fashionably late (~1 minute) as the backend shakes off its sleep.
        For now, I only have servers that operate on a strict "hibernate and hope" schedule :'(
        Thank you for your patience !
      </p>
      < PromptCard />
      {!backendWarmed && (
        <div className="loading">
          <p>Warming up backend...</p>
          <div className="spinner"></div>
        </div>
      )}
    </div>
  );
}

export default App;
