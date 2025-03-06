// src/App.test.js
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import App from './App';

describe('App Component', () => {
  beforeEach(() => {
    jest.spyOn(global, 'fetch');
  });

  afterEach(() => {
    global.fetch.mockRestore();
  });

  test('displays loading spinner during backend warmup and then removes', async () => {
    // Simulate a successful backend ping
    global.fetch.mockResolvedValueOnce({
      status: 200,
      json: jest.fn().mockResolvedValue({}),
    });

    render(<App />);

    // Initially, the loading indicator should be visible
    expect(screen.getByText(/warming up backend/i)).toBeInTheDocument();
    expect(screen.getByText(/warming up backend/i)).toBeVisible();

    // Wait until the backend is warmed (PromptCard is rendered)
    await waitFor(() => {
      expect(screen.queryByText(/warming up backend/i)).toBeNull();
    });
  });
});
