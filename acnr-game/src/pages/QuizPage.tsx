import React, { useState, useEffect } from 'react';

type Question = {
  id: number;
  question: string;
  options: string[];
  answer: string;
};

type LeaderboardEntry = {
  name: string;
  score: number;
};

const QuizPage: React.FC = () => {
  const [quizData, setQuizData] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [timeLeft, setTimeLeft] = useState(10);
  const [playerName, setPlayerName] = useState('');
  const [nameEntered, setNameEntered] = useState(false);
  const [scoreSubmitted, setScoreSubmitted] = useState(false);

  useEffect(() => {
    fetch('${process.env.REACT_APP_API_BASE}/questions')
      .then(res => res.json())
      .then(data => setQuizData(data))
      .catch(err => console.error('Failed to load questions:', err));
  }, []);

  useEffect(() => {
    if (quizData.length === 0 || showSummary || !nameEntered) return;

    setTimeLeft(10);  // Reset timer

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAnswer('');  // Auto move on if no answer
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentIndex, quizData.length, showSummary, nameEntered]);

  const handleAnswer = (option: string) => {
    if (quizData.length === 0) return;

    if (option) {
      const isCorrect = option === quizData[currentIndex].answer;
      if (isCorrect) setScore(prev => prev + 1);
    }

    setUserAnswers(prev => [...prev, option || 'No Answer']);

    if (currentIndex < quizData.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setShowSummary(true);
    }
  };
  useEffect(() => {
  if (showLeaderboard && !scoreSubmitted) {
    fetch('${process.env.REACT_APP_API_BASE}/leaderboard', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: playerName, score })
    })
      .then(() => {
        setScoreSubmitted(true);  // ✅ Mark score as submitted
        return fetch('${process.env.REACT_APP_API_BASE}/leaderboard');
      })
      .then(res => res.json())
      .then(data => setLeaderboard(data))
      .catch(err => console.error('Failed to load leaderboard:', err));
  }
}, [showLeaderboard, scoreSubmitted, score, playerName]);

  if (!nameEntered) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
        color: 'white',
        fontFamily: "'Rubik', sans-serif",
        flexDirection: 'column'
      }}>
        <h2 style={{ marginBottom: '1rem' }}>Enter your name to start the quiz</h2>
        <input
          type="text"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          style={{
            padding: '0.5rem',
            fontSize: '1rem',
            borderRadius: '0.5rem',
            border: '1px solid #ccc',
            marginBottom: '1rem'
          }}
        />
        <button
          onClick={() => {
            if (playerName.trim()) {
              setNameEntered(true);
            } else {
              alert("Please enter your name!");
            }
          }}
          style={{
            padding: '0.5rem 1rem',
            fontSize: '1rem',
            borderRadius: '0.5rem',
            border: 'none',
            background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
            color: 'white',
            fontWeight: '700',
            cursor: 'pointer'
          }}
        >
          Start Quiz
        </button>
      </div>
    );
  }

  if (quizData.length === 0) {
    return <div style={{ color: 'white', textAlign: 'center', paddingTop: '2rem' }}>Loading questions...</div>;
  }

  if (showSummary) {
    return (
      <div style={{
        padding: '2rem',
        textAlign: 'center',
        backgroundColor: '#000',
        minHeight: '100vh',
        color: 'white',
        fontFamily: "'Rubik', sans-serif"
      }}>
        <h2 style={{
          background: 'linear-gradient(90deg, #f43f5e, #f97316, #3b82f6)',
          WebkitBackgroundClip: 'text',
          color: 'transparent',
          fontSize: '2.8rem',
          fontWeight: '900',
          marginBottom: '2rem'
        }}>
          Quiz Summary
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1rem',
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          {quizData.map((q, idx) => (
            <div key={q.id} style={{
              padding: '1rem',
              background: '#111',
              borderRadius: '0.75rem',
              boxShadow: '0 0 10px rgba(255, 255, 255, 0.1)'
            }}>
              <strong style={{ color: 'red', fontSize: '1.1rem' }}>
                {idx + 1}. {q.question}
              </strong><br />
              <span style={{ color: '#fff' }}>
                Your Answer:{' '}
                <span style={{ color: '#34d399' }}>
                  {userAnswers[idx]}
                </span>
              </span><br />
              <span style={{ color: '#fff' }}>
                Correct Answer:{' '}
                <span style={{ color: '#fbbf24' }}>
                  {q.answer}
                </span>
              </span>
            </div>
          ))}
        </div>

        <button
          onClick={() => setShowLeaderboard(true)}
          style={{
            marginTop: '2rem',
            padding: '0.75rem 1.5rem',
            fontSize: '1rem',
            borderRadius: '0.5rem',
            border: 'none',
            background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
            color: 'white',
            fontWeight: '700',
            cursor: 'pointer',
            boxShadow: '0 0 15px #3b82f655, 0 0 30px #8b5cf655',
            transition: 'all 0.3s ease',
          }}
        >
          Show Leaderboard
        </button>

        {showLeaderboard && (
          <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'linear-gradient(135deg,rgb(249, 168, 168),rgb(209, 191, 254))',
            padding: '3rem',
            borderRadius: '1rem',
            boxShadow: '0 0 50px white',
            zIndex: 1000,
            width: '80%',
            maxWidth: '600px',
            textAlign: 'center'
          }}>
            <h3 style={{
  color: '#111',
  marginBottom: '1rem',
  fontSize: '2rem',
  fontWeight: '900',
  textTransform: 'uppercase',
  letterSpacing: '1px'
}}>
  🚀 Top 10 for this week!
</h3>
<p style={{
  color: '#555',
  fontSize: '1rem',
  marginBottom: '1.5rem'
}}>
  Can you beat the best? Stay on top of your slang game!
</p>
<table style={{
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: '1.2rem'
}}>
  <thead>
    <tr>
      <th style={{ borderBottom: '2px solid #ccc', padding: '0.5rem', textAlign: 'center' }}>Rank</th>
      <th style={{ borderBottom: '2px solid #ccc', padding: '0.5rem', textAlign: 'center' }}>Name</th>
      <th style={{ borderBottom: '2px solid #ccc', padding: '0.5rem', textAlign: 'center' }}>Score</th>
    </tr>
  </thead>
  <tbody>
    {leaderboard.map((entry, idx) => (
      <tr key={idx}>
        <td style={{ padding: '0.5rem', color: 'navy'}}>{idx + 1}</td>
        <td style={{ padding: '0.5rem', color: 'navy', fontWeight: '700' }}>{entry.name}</td>
        <td style={{ padding: '0.5rem', color: 'navy' }}>{entry.score}</td>
      </tr>
    ))}
  </tbody>
</table>
            <button
              onClick={() => setShowLeaderboard(false)}
              style={{
                marginTop: '1.5rem',
                padding: '0.75rem 1.5rem',
                border: 'none',
                borderRadius: '0.5rem',
                background: 'black',
                color: '#fff',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              Close
            </button>
          </div>
        )}
      </div>
    );
  }

  const currentQuestion = quizData[currentIndex];

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '2rem',
      backgroundColor: '#000',
      fontFamily: "'Rubik', sans-serif"
    }}>
      <div style={{
        width: '100%',
        maxWidth: '600px',
        marginBottom: '1rem'
      }}>
        <div style={{
          width: '100%',
          height: '10px',
          backgroundColor: '#333',
          borderRadius: '5px',
          overflow: 'hidden',
        }}>
          <div style={{
            width: `${(timeLeft / 10) * 100}%`,
            height: '100%',
            backgroundColor: '#3b82f6',
            transition: 'width 1s linear'
          }} />
        </div>
      </div>

      <h2 style={{
        color: '#fff',
        fontSize: '2.8rem',
        fontWeight: '900',
        marginBottom: '2rem',
        textAlign: 'center',
      }}>
        {currentIndex + 1}. {currentQuestion.question}
      </h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1rem',
        width: '100%',
        maxWidth: '600px'
      }}>
        {currentQuestion.options.map(opt => (
          <button
            key={opt}
            onClick={() => handleAnswer(opt)}
            style={{
              padding: '1rem',
              fontSize: '1.2rem',
              borderRadius: '1rem',
              border: 'none',
              color: '#fff',
              fontWeight: '700',
              background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
              boxShadow: '0 0 15px #3b82f655, 0 0 30px #8b5cf655',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
            onMouseOver={e => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.background = 'linear-gradient(135deg, #f43f5e, #f97316)';
              e.currentTarget.style.boxShadow = '0 0 20px #f43f5e88, 0 0 40px #f9731688';
            }}
            onMouseOut={e => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.background = 'linear-gradient(135deg, #8b5cf6, #3b82f6)';
              e.currentTarget.style.boxShadow = '0 0 15px #3b82f655, 0 0 30px #8b5cf655';
            }}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuizPage;
