import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders app', () => {
  render(<App />);
  //const tableHideButton = screen.getByText(/Hide table view/i);
  //expect(tableHideButton).toBeInTheDocument();
});
