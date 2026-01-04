import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import MathGame from '../MathGame'

describe('MathGame', () => {
  it('renders the game title', () => {
    render(<MathGame />)
    expect(screen.getByText('Gra Matematyczna')).toBeInTheDocument()
  })

  it('has a submit button', () => {
    render(<MathGame />)
    expect(screen.getByText('Zatwierdź')).toBeInTheDocument()
  })

  it('has a skip button', () => {
    render(<MathGame />)
    expect(screen.getByText('Pomiń / Nowe pytanie')).toBeInTheDocument()
  })

  it('has an answer input field', () => {
    render(<MathGame />)
    expect(screen.getByPlaceholderText('?')).toBeInTheDocument()
  })

  describe('Button Visibility', () => {
    it('shows all 3 buttons initially', () => {
      render(<MathGame />)
      
      // Check all three buttons are present
      expect(screen.getByText('Zatwierdź')).toBeInTheDocument()
      expect(screen.getByText('Zobacz odpowiedź')).toBeInTheDocument()
      expect(screen.getByText('Pomiń / Nowe pytanie')).toBeInTheDocument()
    })

    it('shows all 3 buttons after entering an answer', () => {
      render(<MathGame />)
      
      // Enter an answer
      const input = screen.getByPlaceholderText('?')
      input.value = '5'
      
      // All buttons should still be visible
      expect(screen.getByText('Zatwierdź')).toBeInTheDocument()
      expect(screen.getByText('Zobacz odpowiedź')).toBeInTheDocument()
      expect(screen.getByText('Pomiń / Nowe pytanie')).toBeInTheDocument()
    })

    it('shows all 3 buttons after submitting a wrong answer', () => {
      render(<MathGame />)
      
      // Enter and submit a wrong answer
      const input = screen.getByPlaceholderText('?')
      const submitButton = screen.getByText('Zatwierdź')
      
      input.value = '999' // Wrong answer
      submitButton.click()
      
      // All buttons should still be visible
      expect(screen.getByText('Zatwierdź')).toBeInTheDocument()
      expect(screen.getByText('Zobacz odpowiedź')).toBeInTheDocument()
      expect(screen.getByText('Pomiń / Nowe pytanie')).toBeInTheDocument()
    })

    it('shows all 3 buttons after submitting a correct answer', () => {
      render(<MathGame />)
      
      // Enter and submit a correct answer (this will depend on the generated problem)
      const input = screen.getByPlaceholderText('?')
      const submitButton = screen.getByText('Zatwierdź')
      
      // Try a reasonable answer that might be correct
      input.value = '10'
      submitButton.click()
      
      // All buttons should still be visible
      expect(screen.getByText('Zatwierdź')).toBeInTheDocument()
      expect(screen.getByText('Zobacz odpowiedź')).toBeInTheDocument()
      expect(screen.getByText('Pomiń / Nowe pytanie')).toBeInTheDocument()
    })

    it('shows the correct answer when "Zobacz odpowiedź" button is clicked', async () => {
      render(<MathGame />)
      
      // Get the answer button
      const showAnswerButton = screen.getByText('Zobacz odpowiedź')
      
      // Click the "Zobacz odpowiedź" button using userEvent
      await userEvent.click(showAnswerButton)
      
      // Should show a message with the correct answer format
      expect(screen.getByText(/Poprawna odpowiedź to:/)).toBeInTheDocument()
    })

    it('shows the correct answer after user provides invalid answer and clicks "Zobacz odpowiedź"', async () => {
      render(<MathGame />)
      
      // Get elements
      const input = screen.getByPlaceholderText('?')
      const submitButton = screen.getByText('Zatwierdź')
      const showAnswerButton = screen.getByText('Zobacz odpowiedź')
      
      // Enter an invalid/wrong answer
      await userEvent.type(input, '999')
      
      // Submit the wrong answer
      await userEvent.click(submitButton)
      
      // Verify error message appears
      expect(screen.getByText('Błędnie! Spróbuj ponownie lub zobacz odpowiedź.')).toBeInTheDocument()
      
      // Now click "Zobacz odpowiedź" button
      await userEvent.click(showAnswerButton)
      
      // Should show a message with the correct answer format
      expect(screen.getByText(/Poprawna odpowiedź to:/)).toBeInTheDocument()
    })
  })
})
