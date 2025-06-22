import React from 'react';
import { Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/Homepage';
import QuizPage from './pages/QuizPage';

const App: React.FC = () => (
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/quiz" element={<QuizPage />} />
  </Routes>
);

export default App;
