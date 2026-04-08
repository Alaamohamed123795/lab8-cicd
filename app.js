const express = require('express');
const os = require('os');
const { Pool } = require('pg');

const app = express();
const PORT = 3000;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

app.get('/', (req, res) => {
  res.json({
    app:  'CISC 886 Lab 8',
    mode: process.env.MODE || 'local',
    node: process.version,
    host: os.hostname(),
  });
});

app.get('/tasks', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tasks ORDER BY id');
    const grouped = result.rows.reduce((acc, task) => {
      acc[task.status] = acc[task.status] || [];
      acc[task.status].push(task);
      return acc;
    }, {});
    res.json(grouped);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log('--------------------------------------------------');
  console.log(`  CISC 886 Lab 8 — App started`);
  console.log(`  Port : ${PORT}`);
  console.log(`  Mode : ${process.env.MODE || 'local'}`);
  console.log(`  Node : ${process.version}`);
  console.log(`  Host : ${os.hostname()}`);
  console.log('--------------------------------------------------');
});
