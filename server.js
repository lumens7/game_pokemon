const express = require('express');
const { createClient } = require('@libsql/client');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Conexão com Turso
const db = createClient({
  url: process.env.TURSO_DB_URL,
  authToken: process.env.TURSO_DB_TOKEN
});

app.use(express.static('public'));
app.use(express.json());

// POST: salva novo placar
app.post('/placar', async (req, res) => {
  const { nome, pontos, dificuldade } = req.body;

  if (!nome || typeof pontos !== 'number' || !dificuldade) {
    return res.status(400).send('Dados inválidos');
  }

  try {
    await db.execute({
      sql: `INSERT INTO placares (nome, pontos, dificuldade) VALUES (?, ?, ?)`,
      args: [nome, pontos, dificuldade]
    });

    res.send('Placar salvo!');
  } catch (err) {
    console.error('Erro ao salvar placar:', err);
    res.status(500).send('Erro ao salvar no banco');
  }
});

// GET: retorna todos os placares
app.get('/placar', async (req, res) => {
  try {
    const { dificuldade } = req.query;

    let participantesQuery;
    if (dificuldade) {
      // Se for por dificuldade, pega só os 10 melhores
      participantesQuery = await db.execute(
        `SELECT nome, pontos, dificuldade FROM placares WHERE dificuldade = ? ORDER BY pontos DESC LIMIT 10`,
        [dificuldade]
      );
    } else {
      // Ranking geral (todos os participantes)
      participantesQuery = await db.execute(
        `SELECT nome, pontos, dificuldade FROM placares ORDER BY pontos DESC`
      );
    }

    // Sempre busca o total geral de participantes (sem filtro)
    const totalQuery = await db.execute(`SELECT COUNT(*) AS total FROM placares`);
    const total = totalQuery[0][0].total;

    res.json({
      participantes: participantesQuery[0], // para mysql2
      total: total
    });

  } catch (err) {
    console.error('Erro ao buscar placares:', err);
    res.status(500).send('Erro ao buscar do banco');
  }
});


app.listen(PORT, () => {
});
