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

  test('calls backend API with correct payload for thumbs up and displays response with slider functionality', async () => {
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

    // Check that slider appears
    const slider = await screen.findByTestId('level-slider');
    expect(slider).toBeInTheDocument();

    // Initially, currentLevel is 1: check for level_1 response card
    await waitFor(() => {
      expect(screen.getByTestId('response-card-level_1')).toBeInTheDocument();
    });
    const level1Card = screen.getByTestId('response-card-level_1');

    // Change slider value to 4
    fireEvent.change(slider, { target: { value: '4' } });
    await waitFor(() => {
      const level4Card = screen.getByTestId('response-card-level_4');
      expect(level4Card).toBeInTheDocument();
    });
    expect(consoleLogSpy).toHaveBeenCalledWith('Backend API Response:', mockResponseData);
  });

  test('calls backend API with correct payload for thumbs down and displays response with slider functionality', async () => {
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

    // Check that slider appears
    const slider = await screen.findByTestId('level-slider');
    expect(slider).toBeInTheDocument();

    // Initially, currentLevel is 1: check for level_1 response card
    await waitFor(() => {
      expect(screen.getByTestId('response-card-level_1')).toBeInTheDocument();
    });
    const level1Card = screen.getByTestId('response-card-level_1');

    // Change slider value to 6
    fireEvent.change(slider, { target: { value: '6' } });
    await waitFor(() => {
      const level6Card = screen.getByTestId('response-card-level_6');
      expect(level6Card).toBeInTheDocument();
    });
    expect(consoleLogSpy).toHaveBeenCalledWith('Backend API Response:', mockResponseData);
  });
    test('resets to initial state when reset button is clicked', async () => {
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
    render(<PromptCard />);
    const thumbsUpButton = screen.getByRole('button', { name: /👍/i });
    fireEvent.click(thumbsUpButton);

    // Wait for response view to appear
    await waitFor(() => {
      expect(screen.getByTestId('response-card-level_1')).toBeInTheDocument();
    });

    // Click the reset button
    const resetButton = screen.getByRole('button', { name: /reset/i });
    expect(resetButton).toBeInTheDocument();
    fireEvent.click(resetButton);

    // After reset, prompt card should be visible again
    await waitFor(() => {
      expect(screen.getByTestId('prompt-content')).toBeInTheDocument();
    });
    // Slider and response card should no longer be visible
    expect(screen.queryByTestId('level-slider')).toBeNull();
    expect(screen.queryByTestId('response-card-level_1')).toBeNull();
  });
});
