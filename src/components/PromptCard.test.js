// src/components/PromptCard.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PromptCard from './PromptCard';

describe('PromptCard Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders the initial political statement and both buttons', () => {
        render(<PromptCard />);
        const promptElement = screen.getByTestId('prompt-content');
        expect(promptElement).toBeInTheDocument();
        expect(promptElement.textContent).toMatch(/investing in renewable energy is essential/i);

        const shuffleButton = screen.getByRole('button', { name: /shuffle/i });
        expect(shuffleButton).toBeInTheDocument();

        const thumbsUpButton = screen.getByRole('button', { name: /👍/i });
        expect(thumbsUpButton).toBeInTheDocument();
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

    test('calls backend API when thumbs up button is clicked and logs response', async () => {
        const mockResponseData = {
            outputs: {
                level_1: "Test level 1",
                level_2: "Test level 2",
                level_3: "Test level 3",
                level_4: "Test level 4",
                level_5: "Test level 5",
                level_6: "Test level 6"
            }
        };

        // Mock global.fetch to simulate a successful API call.
        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            json: jest.fn().mockResolvedValue(mockResponseData)
        });

        // Spy on console.log to capture the output.
        const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => { });

        render(<PromptCard />);
        const thumbsUpButton = screen.getByRole('button', { name: /👍/i });
        fireEvent.click(thumbsUpButton);

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledTimes(1);
            expect(consoleLogSpy).toHaveBeenCalledWith('Backend API Response:', mockResponseData);
        });
    });

    test('handles backend API error when thumbs up button is clicked', async () => {
        // Simulate a fetch error.
        global.fetch = jest.fn().mockRejectedValue(new Error('API error'));

        // Spy on console.error to capture error logs.
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

        render(<PromptCard />);
        const thumbsUpButton = screen.getByRole('button', { name: /👍/i });
        fireEvent.click(thumbsUpButton);

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledTimes(1);
            expect(consoleErrorSpy).toHaveBeenCalledWith('Error calling backend API:', expect.any(Error));
        });
    });
});
