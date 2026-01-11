import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

describe('App (Landing Page)', () => {
  describe('Basic Rendering', () => {
    it('renders without crashing', () => {
      render(<App />);
      expect(screen.getByText('Cześć!')).toBeInTheDocument();
    });

    it('shows navigation menu', () => {
      render(<App />);
      expect(screen.getByRole('navigation')).toBeInTheDocument();
      expect(screen.getByRole('banner')).toBeInTheDocument();
      expect(screen.getByRole('main')).toBeInTheDocument();
    });
  });
});
