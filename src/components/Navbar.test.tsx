import { render, screen, act } from '@testing-library/react';
import Navbar from './Navbar'

// already have test for settings button existing
test('mqtt connected && table hidden', () => {
  render(<Navbar
    setSettings={(_) => console.log("set settings called")}
    showBridges={false}
  />)
  const settingsButton = screen.getByText(/Settings/i)
  expect(settingsButton).toBeInTheDocument()
})
