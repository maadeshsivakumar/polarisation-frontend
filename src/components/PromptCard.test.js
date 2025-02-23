// src/components/PromptCard.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PromptCard from './PromptCard';

describe('PromptCard Component', () => {
    test('renders the initial political statement and shuffle button', () => {
        render(<PromptCard />);
        const promptElement = screen.getByTestId('prompt-content');
        expect(promptElement).toBeInTheDocument();
        expect(promptElement.textContent).toMatch(/investing in renewable energy is essential/i);

        const shuffleButton = screen.getByRole('button', { name: /shuffle/i });
        expect(shuffleButton).toBeInTheDocument();
    });

    test('cycles through political statements on shuffle button click', () => {
        render(<PromptCard />);
        const promptElement = screen.getByTestId('prompt-content');
        const shuffleButton = screen.getByRole('button', { name: /shuffle/i });
        const initialPrompt = promptElement.textContent;

        fireEvent.click(shuffleButton);

        const newPrompt = promptElement.textContent;
        expect(newPrompt).not.toEqual(initialPrompt);
    });
});
