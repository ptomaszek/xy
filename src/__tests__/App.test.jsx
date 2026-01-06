import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

describe('App (Landing Page)', () => {
  describe('Basic Rendering', () => {
    it('renders without crashing', () => {
      render(<App />);
      expect(screen.getByText('Gry dla XY')).toBeInTheDocument();
    });

    it('shows navigation menu', () => {
      render(<App />);
      expect(screen.getByRole('navigation')).toBeInTheDocument();
      expect(screen.getByRole('banner')).toBeInTheDocument();
      expect(screen.getByRole('main')).toBeInTheDocument();
    });

    it('shows menu items and expands sub-items', async () => {
      render(<App />);
      
      // Expect the main "Matematyka" button to be present.
      // Since there are two instances (drawer and main content), use getAllByRole.
      const mathGameButtons = screen.getAllByRole('button', { name: 'Matematyka' });
      expect(mathGameButtons.length).toBeGreaterThanOrEqual(1); // Ensure at least one button is found
      
      // Click the first found button to expand sub-items
      await userEvent.click(mathGameButtons[0]);

      // After clicking, the sub-items should appear as links
      await waitFor(() => {
        expect(screen.getByRole('link', { name: 'Poziom 1' })).toBeInTheDocument();
      });

      // Expect dummy link to be present (it's not nested under MathGame, so it should be a direct link)
      // Use getAllByRole to handle multiple instances
      const dummyLinks = screen.getAllByRole('link', { name: 'Dummy' });
      expect(dummyLinks.length).toBeGreaterThanOrEqual(1);
    });
  });
});
