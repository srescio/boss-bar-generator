import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../App';

test('renders boss bar generator title', () => {
  render(<App />);
  const titleElement = screen.getByText(/Boss Bar Generator/i);
  expect(titleElement).toBeInTheDocument();
});

test('renders game style selector', () => {
  render(<App />);
  const gameStyleElement = screen.getByText(/Game Style/i);
  expect(gameStyleElement).toBeInTheDocument();
});

test('renders live preview section', () => {
  render(<App />);
  const previewElement = screen.getByText('Live Preview', { selector: '#preview-title' });
  expect(previewElement).toBeInTheDocument();
});
