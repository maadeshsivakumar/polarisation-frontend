// src/components/PromptCard.test.js
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import PromptCard from './PromptCard';

describe('PromptCard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  test('renders the initial political statement and all buttons', () => {
    render(<PromptCard />);
    const promptElement = screen.getByTestId('prompt-content');
    expect(promptElement).toBeInTheDocument();
    expect(promptElement.textContent).toMatch(/investing in renewable energy is essential/i);

    const shuffleButton = screen.getByRole('button', { name: /shuffle/i });
    expect(shuffleButton).toBeInTheDocument();

    const thumbsUpButton = screen.getByRole('button', { name: /👍/i });
    expect(thumbsUpButton).toBeInTheDocument();

    const thumbsDownButton = screen.getByRole('button', { name: /👎/i });
    expect(thumbsDownButton).toBeInTheDocument();
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

  test('calls backend API with correct payload for thumbs up and displays response card', async () => {
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
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue(mockResponseData)
    });
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => { });

    render(<PromptCard />);
    const thumbsUpButton = screen.getByRole('button', { name: /👍/i });
    fireEvent.click(thumbsUpButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    // Wait for response card to appear and check level_1 card
    await waitFor(() => {
      expect(screen.getByTestId('response-card-level_1')).toBeInTheDocument();
    });
    const level1Card = screen.getByTestId('response-card-level_1');
    expect(consoleLogSpy).toHaveBeenCalledWith('Backend API Response:', mockResponseData);
  });

  test('calls backend API with correct payload for thumbs down and displays response card', async () => {
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
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue(mockResponseData)
    });
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => { });

    render(<PromptCard />);
    const thumbsDownButton = screen.getByRole('button', { name: /👎/i });
    fireEvent.click(thumbsDownButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    // Wait for response card to appear and check level_1 card
    await waitFor(() => {
      expect(screen.getByTestId('response-card-level_1')).toBeInTheDocument();
    });
    const level1Card = screen.getByTestId('response-card-level_1');
    expect(consoleLogSpy).toHaveBeenCalledWith('Backend API Response:', mockResponseData);
  });
});
