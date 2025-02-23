import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/Political Polarization Transformer/);
  console.log(linkElement);

  expect(linkElement).toBeInTheDocument();
});
