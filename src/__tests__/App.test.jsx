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

    it('shows landing page heading with expanded game list', () => {
      render(<App />);
      expect(screen.getByText('Wybierz grę z menu')).toBeInTheDocument();
      // Verify that the game list is present and expanded (sub-items visible)
      const list = screen.getByRole('list');
      expect(list).toBeInTheDocument();
      // Verify that sub-items are visible initially (expanded state)
      expect(screen.getByRole('link', { name: 'Poziom 1' })).toBeInTheDocument();
    });
  });
});
