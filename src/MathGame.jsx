import React, { useState, useEffect } from 'react';

function MathGame() {
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [operation, setOperation] = useState('+');
  const [answer, setAnswer] = useState('');
  const [message, setMessage] = useState('');
  const [isCorrect, setIsCorrect] = useState(false);

  const generateQuestion = () => {
    // Generate two numbers with result 0-20
    const n1 = Math.floor(Math.random() * 21);
    const ops = ['+', '-'];
    const op = ops[Math.floor(Math.random() * ops.length)];
    
    let n2;
    if (op === '+') {
      n2 = Math.floor(Math.random() * (21 - n1));
    } else {
      n2 = Math.floor(Math.random() * (n1 + 1));
    }
    
    setNum1(n1);
    setNum2(n2);
    setOperation(op);
    setAnswer('');
    setMessage('');
    setIsCorrect(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (answer === '') return;

    const userAnswer = parseInt(answer);
    const correctAnswer = operation === '+' ? num1 + num2 : num1 - num2;

    if (userAnswer === correctAnswer) {
      setMessage('Poprawnie! 🎉');
      setIsCorrect(true);
    } else {
      setMessage('Błędnie! Spróbuj ponownie lub zobacz odpowiedź.');
      setIsCorrect(false);
    }
  };

  const handleShowAnswer = () => {
    const correctAnswer = operation === '+' ? num1 + num2 : num1 - num2;
    setMessage(`Poprawna odpowiedź to: ${correctAnswer}`);
  };

  const handleSkip = () => {
    generateQuestion();
  };

  // Initialize with first question
  useEffect(() => {
    generateQuestion();
  }, []);

  return (
    <div style={{
      textAlign: 'center',
      marginTop: '50px',
      fontFamily: 'Arial, sans-serif',
      maxWidth: '500px',
      margin: '50px auto',
      padding: '20px',
      border: '2px solid #007bff',
      borderRadius: '10px',
      backgroundColor: '#f8f9fa'
    }}>
      <h2>Gra Matematyczna</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <form onSubmit={handleSubmit}>
          <div style={{ fontSize: '1.5rem', marginBottom: '10px' }}>
            <span>
              {num1} {operation} {num2} = 
            </span>
            <input
              type="number"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="?"
              style={{
                padding: '10px',
                fontSize: '1.5rem',
                border: '2px solid #007bff',
                borderRadius: '5px',
                width: '80px',
                textAlign: 'center',
                backgroundColor: isCorrect ? '#d4edda' : 'white'
              }}
              disabled={isCorrect}
            />
          </div>
          <button
            type="submit"
            disabled={isCorrect || answer === ''}
            style={{
              padding: '10px 20px',
              fontSize: '1rem',
              backgroundColor: isCorrect ? '#28a745' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: isCorrect ? 'default' : 'pointer',
              marginRight: '10px'
            }}
          >
            {isCorrect ? 'Poprawnie!' : 'Zatwierdź'}
          </button>
          <br />
          <button
            type="button"
            onClick={handleShowAnswer}
            style={{
              padding: '10px 20px',
              fontSize: '1rem',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              marginTop: '10px'
            }}
          >
            Zobacz odpowiedź
          </button>
        </form>
      </div>

      {message && (
        <div style={{
          marginBottom: '20px',
          padding: '10px',
          borderRadius: '5px',
          backgroundColor: isCorrect ? '#d4edda' : '#f8d7da',
          color: isCorrect ? '#155724' : '#721c24',
          border: `1px solid ${isCorrect ? '#c3e6cb' : '#f5c6cb'}`
        }}>
          {message}
        </div>
      )}

      <button
        onClick={handleSkip}
        style={{
          padding: '10px 20px',
          fontSize: '1rem',
          backgroundColor: '#ffc107',
          color: '#856404',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}
      >
        Pomiń / Nowe pytanie
      </button>

      <div style={{ marginTop: '20px', fontSize: '0.9rem', color: '#6c757d' }}>
        Odpowiedzi są w zakresie 0-20
      </div>
    </div>
  );
}

export default MathGame;
