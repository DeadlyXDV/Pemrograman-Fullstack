// Marcelo Jonathan Holle - 411222083
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 3000;

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '', // sesuaikan dengan password MySQL kamu
  database: 'motorcycle_manager'
}).promise();

app.use(cors());
app.use(express.json());

// ====== READ ======
app.get('/api/motorcycles', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM motorcycles');
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Kesalahan Server' });
  }
});

app.get('/api/motorcycles/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM motorcycles WHERE id = ?', [req.params.id]);
    if (rows.length > 0) res.json(rows[0]);
    else res.status(404).json({ message: 'Motor tidak ditemukan' });
  } catch {
    res.status(500).json({ message: 'Kesalahan Server' });
  }
});

// ====== CREATE ======
app.post('/api/motorcycles', async (req, res) => {
  const { brand, model } = req.body;
  if (!brand || !model) return res.status(400).json({ message: 'Brand dan Model harus diisi' });
  try {
    const [result] = await db.query('INSERT INTO motorcycles (brand, model) VALUES (?, ?)', [brand, model]);
    res.status(201).json({ id: result.insertId, brand, model });
  } catch {
    res.status(500).json({ message: 'Kesalahan Server' });
  }
});

// ====== UPDATE ======
app.put('/api/motorcycles/:id', async (req, res) => {
  const { brand, model } = req.body;
  const id = req.params.id;
  try {
    const [result] = await db.query('UPDATE motorcycles SET brand = ?, model = ? WHERE id = ?', [brand, model, id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Motor tidak ditemukan' });
    res.json({ id, brand, model });
  } catch {
    res.status(500).json({ message: 'Kesalahan Server' });
  }
});

// ====== DELETE ======
app.delete('/api/motorcycles/:id', async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM motorcycles WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Motor tidak ditemukan' });
    res.status(204).send();
  } catch {
    res.status(500).json({ message: 'Kesalahan Server' });
  }
});

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
