import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

app.get('/', (req, res) => {
  res.send('API is running');
});

app.get('/questions', async (req, res) => {
  const result = await pool.query('SELECT * FROM questions');
  res.json(result.rows);
});

app.post('/leaderboard', async (req, res) => {
  const { name, score } = req.body;
  const result = await pool.query(
    'INSERT INTO leaderboard (name, score) VALUES ($1, $2) RETURNING *',
    [name, score]
  );
  res.json(result.rows[0]);
});

app.get('/leaderboard', async (req, res) => {
  const result = await pool.query(
    'SELECT * FROM leaderboard ORDER BY score DESC LIMIT 10'
  );
  res.json(result.rows);
});


app.listen(5000, '0.0.0.0',() => console.log('Server running on port 5000'));
