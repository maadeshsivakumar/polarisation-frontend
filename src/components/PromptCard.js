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

const PromptCard = () => {
    const [currentPromptIndex, setCurrentPromptIndex] = useState(0);

    const handleShuffle = () => {
        setCurrentPromptIndex((prevIndex) => (prevIndex + 1) % predefinedPrompts.length);
    };

    const handleFeedback = async (feedbackValue) => {
        // Prepare payload with the current prompt and the provided feedback
        const payload = {
            text: predefinedPrompts[currentPromptIndex],
            feedback: feedbackValue, // true for thumbs up, false for thumbs down
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
