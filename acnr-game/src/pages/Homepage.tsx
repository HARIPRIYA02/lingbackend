import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate('/quiz');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#000', // Black background
      color: 'white',
      textAlign: 'center',
      padding: '2rem',
    }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem', fontWeight: 'bold' }}>
        🚀 LingoCrack
      </h1>
      <p style={{ fontSize: '1.5rem', marginBottom: '2rem', maxWidth: '500px' }}>
        Crack the code of Gen Z slang and acronyms — match the vibe, flex your lingo!
      </p>
      <button
        onClick={handleStart}
        style={{
          padding: '0.75rem 1.5rem',
          fontSize: '1rem',
          fontWeight: 'bold',
          color: '#000',
          backgroundColor: '#fff',
          border: 'none',
          borderRadius: '0.5rem',
          cursor: 'pointer',
        }}
      >
        Get Started
      </button>
    </div>
  );
};

export default HomePage;
