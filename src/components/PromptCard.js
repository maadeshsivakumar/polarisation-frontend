// src/components/PromptCard.js
import React, { useState } from 'react';
import './PromptCard.css';

const predefinedPrompts = [
  "Investing in renewable energy is essential for reducing our dependence on fossil fuels and protecting our planet.",
  "Universal public healthcare should be a fundamental right to ensure everyone has access to quality medical services.",
  "Increasing taxes on the wealthy can help address income inequality and fund essential public services.",
  "Reducing regulations on businesses can spur economic growth and create more job opportunities for everyone.",
  "Enhancing law enforcement funding is necessary to ensure public safety and protect communities from crime.",
  "Investing more in education will provide equal opportunities and strengthen our society for future generations.",
  "Privatizing select state-owned enterprises might lead to greater efficiency and innovation in our economy.",
  "Protecting workers’ rights and enforcing fair wages is crucial for a just and equitable society.",
  "Lowering taxes can empower individuals and stimulate a more dynamic, competitive market.",
  "Stricter immigration policies are needed to safeguard national security and preserve our cultural identity."
];

const levelColors = {
  level_1: "#ffe6e6",
  level_2: "#ffcccc",
  level_3: "#ffb3b3",
  level_4: "#ff9999",
  level_5: "#ff8080",
  level_6: "#ff6666",
};

const PromptCard = () => {
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [backendResponse, setBackendResponse] = useState(null);
  const [currentLevel, setCurrentLevel] = useState(1);

  const handleShuffle = () => {
    setCurrentPromptIndex((prevIndex) => (prevIndex + 1) % predefinedPrompts.length);
    setBackendResponse(null);
  };

  const handleFeedback = async (feedbackValue) => {
    const payload = {
      text: predefinedPrompts[currentPromptIndex],
      feedback: feedbackValue,
    };

    try {
      const response = await fetch('http://localhost:8000/transform', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Backend API Response:', data);
      setBackendResponse(data.outputs);
      setCurrentLevel(1);
    } catch (error) {
      console.error('Error calling backend API:', error);
    }
  };

  const handleThumbsUp = () => {
    handleFeedback(true);
  };

  const handleThumbsDown = () => {
    handleFeedback(false);
  };

  const handleSliderChange = (event) => {
    setCurrentLevel(Number(event.target.value));
  };

  const handleReset = () => {
    setBackendResponse(null);
    setCurrentLevel(1);
  };

  if (backendResponse) {
    const levelKey = `level_${currentLevel}`;
    return (
      <div className="response-container" style={{ backgroundColor: levelColors[levelKey] }}>
        <div className="response-card" data-testid={`response-card-${levelKey}`}>
          <h3>{levelKey.replace('_', ' ').toUpperCase()}</h3>
          <p>{backendResponse[levelKey]}</p>
        </div>
        <div className="slider-container">
          <input
            type="range"
            min="1"
            max="6"
            value={currentLevel}
            onChange={handleSliderChange}
            data-testid="level-slider"
            list="tickmarks"
          />
          <datalist id="tickmarks">
            <option value="1" label="1" />
            <option value="2" label="2" />
            <option value="3" label="3" />
            <option value="4" label="4" />
            <option value="5" label="5" />
            <option value="6" label="6" />
          </datalist>
          <div className="slider-labels">
            <span>Level 1</span>
            <span>Level 6</span>
          </div>
        </div>
        <button className="reset-button" onClick={handleReset}>
          Reset
        </button>
      </div>
    );
  }

  return (
    <div className="prompt-card">
      <div className="prompt-content" data-testid="prompt-content">
        {predefinedPrompts[currentPromptIndex]}
      </div>
      <div className="button-group">
        <button className="shuffle-button" onClick={handleShuffle}>
          Shuffle
        </button>
        <button className="thumbs-up-button" onClick={handleThumbsUp}>
          👍
        </button>
        <button className="thumbs-down-button" onClick={handleThumbsDown}>
          👎
        </button>
      </div>
    </div>
  );
};

export default PromptCard;
