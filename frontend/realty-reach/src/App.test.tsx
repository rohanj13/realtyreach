import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders RealtyReach text', () => {
  render(<App />);
  const linkElement = screen.getByText(/RealtyReach/i);
  expect(linkElement).toBeInTheDocument();
});
