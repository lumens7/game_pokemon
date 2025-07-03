const express = require('express');
const { createClient } = require('@libsql/client');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json());

// Configurar o client do Turso
const db = createClient({
  url: process.env.TURSO_DB_URL,
  authToken: process.env.TURSO_DB_TOKEN,
});

// GET /placar => lista geral
app.get('/placar', async (req, res) => {
  try {
    const result = await db.execute('SELECT nome, pontos, dificuldade FROM placares ORDER BY pontos DESC LIMIT 20');
    res.json(result.rows);
  } catch (err) {
    res.status(500).send('Erro ao acessar o banco');
  }
});

// POST /placar => adiciona nova entrada
app.post('/placar', async (req, res) => {
  const { nome, pontos, dificuldade } = req.body;

  try {
    await db.execute({
      sql: 'INSERT INTO placares (nome, pontos, dificuldade) VALUES (?, ?, ?)',
      args: [nome, pontos, dificuldade],
    });

    res.send('Placar salvo!');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao salvar placar');
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
