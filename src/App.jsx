import React from 'react';
import MathGame from './MathGame';

function App() {
  return (
    <div style={{
      textAlign: 'center',
      minHeight: '100vh',
      backgroundColor: '#f8f9fa'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '20px'
      }}>
        <MathGame />
      </div>
    </div>
  );
}

export default App;
