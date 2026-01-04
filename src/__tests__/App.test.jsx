import { render, screen } from '@testing-library/react';
import App from '../App';

describe('App (Landing Page)', () => {
  describe('Basic Rendering', () => {
    it('renders without crashing', () => {
      render(<App />);
      // Basic test to ensure component renders without errors
      expect(screen.getByText('Gry dla XY')).toBeInTheDocument();
    });

    it('shows navigation menu', () => {
      render(<App />);
      
      // Check that navigation elements are present
      expect(screen.getByRole('navigation')).toBeInTheDocument();
      expect(screen.getByRole('banner')).toBeInTheDocument();
      expect(screen.getByRole('main')).toBeInTheDocument();
    });

    it('shows menu items', () => {
      render(<App />);
      
      // Check that menu items are present using link selectors
      expect(screen.getByRole('link', { name: 'Strona główna' })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Gra matematyczna' })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Kontakt' })).toBeInTheDocument();
    });
  });
});
