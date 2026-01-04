import React, { useState } from 'react';

function MathGame() {
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [num3, setNum3] = useState(null);
  const [operation1, setOperation1] = useState('+');
  const [operation2, setOperation2] = useState('+');
  const [answer, setAnswer] = useState('');
  const [message, setMessage] = useState('');
  const [isCorrect, setIsCorrect] = useState(false);
  const [isThreeNumbers, setIsThreeNumbers] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  const generateQuestion = () => {
    // Randomly decide if we want 2 or 3 numbers (30% chance for 3 numbers)
    const shouldUseThreeNumbers = Math.random() < 0.3;
    setIsThreeNumbers(shouldUseThreeNumbers);
    
    // Randomly choose operations
    const ops = ['+', '-'];
    const op1 = ops[Math.floor(Math.random() * ops.length)];
    const op2 = ops[Math.floor(Math.random() * ops.length)];
    
    let n1, n2, n3;
    
    if (shouldUseThreeNumbers) {
      // Generate three numbers with result 0-20
      n1 = Math.floor(Math.random() * 21);
      
      // For the second number, consider the first operation
      if (op1 === '+') {
        n2 = Math.floor(Math.random() * (21 - n1));
      } else {
        n2 = Math.floor(Math.random() * (n1 + 1));
      }
      
      // Calculate intermediate result
      const intermediate = op1 === '+' ? n1 + n2 : n1 - n2;
      
      // For the third number, consider the second operation and ensure final result 0-20
      if (op2 === '+') {
        n3 = Math.floor(Math.random() * (21 - intermediate));
      } else {
        n3 = Math.floor(Math.random() * (intermediate + 1));
      }
      
      setNum1(n1);
      setNum2(n2);
      setNum3(n3);
      setOperation1(op1);
      setOperation2(op2);
    } else {
      // Two numbers logic (same as before)
      if (op1 === '+') {
        n1 = Math.floor(Math.random() * 21);
        n2 = Math.floor(Math.random() * (21 - n1));
      } else {
        n1 = Math.floor(Math.random() * 21);
        n2 = Math.floor(Math.random() * (n1 + 1));
      }
      
      setNum1(n1);
      setNum2(n2);
      setNum3(null);
      setOperation1(op1);
      setOperation2('+'); // unused for two numbers
    }
    
    setAnswer('');
    setMessage('');
    setIsCorrect(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (answer === '') return;

    const userAnswer = parseInt(answer);
    let correctAnswer;
    
    if (isThreeNumbers) {
      // Calculate three number expression: num1 op1 num2 op2 num3
      const intermediate = operation1 === '+' ? num1 + num2 : num1 - num2;
      correctAnswer = operation2 === '+' ? intermediate + num3 : intermediate - num3;
    } else {
      // Two number expression: num1 op1 num2
      correctAnswer = operation1 === '+' ? num1 + num2 : num1 - num2;
    }

    if (userAnswer === correctAnswer) {
      setMessage('Poprawnie! 🎉');
      setIsCorrect(true);
    } else {
      setMessage('Błędnie! Spróbuj ponownie lub zobacz odpowiedź.');
      setIsCorrect(false);
    }
  };

  const handleShowAnswer = () => {
    let correctAnswer;
    
    if (isThreeNumbers) {
      // Calculate three number expression: num1 op1 num2 op2 num3
      const intermediate = operation1 === '+' ? num1 + num2 : num1 - num2;
      correctAnswer = operation2 === '+' ? intermediate + num3 : intermediate - num3;
    } else {
      // Two number expression: num1 op1 num2
      correctAnswer = operation1 === '+' ? num1 + num2 : num1 - num2;
    }
    
    setMessage(`Poprawna odpowiedź to: ${correctAnswer}`);
    setShowAnswer(true);
  };

  const handleShowHint = () => {
    if (isThreeNumbers) {
      // For three numbers, show the intermediate result
      const intermediate = operation1 === '+' ? num1 + num2 : num1 - num2;
      setMessage(`Podpowiedź: Najpierw oblicz ${num1} ${operation1} ${num2} = ${intermediate}`);
    } else {
      // For two numbers, give a range hint
      const correctAnswer = operation1 === '+' ? num1 + num2 : num1 - num2;
      const hintRange = Math.floor(correctAnswer / 5) * 5;
      setMessage(`Podpowiedź: Odpowiedź jest w pobliżu ${hintRange}`);
    }
  };

  const handleSkip = () => {
    generateQuestion();
  };

  // Initialize with first question
  React.useEffect(() => {
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
            {isThreeNumbers ? (
              <span>
                {num1} {operation1} {num2} {operation2} {num3} = 
              </span>
            ) : (
              <span>
                {num1} {operation1} {num2} = 
              </span>
            )}
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
            onClick={handleShowHint}
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
          {!isCorrect && answer !== '' && (
            <button
              onClick={handleShowAnswer}
              style={{
                padding: '10px 20px',
                fontSize: '1rem',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                marginLeft: '10px'
              }}
            >
              Zobacz odpowiedź
            </button>
          )}
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
