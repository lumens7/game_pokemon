
const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use(express.json());

app.get('/placar', (req, res) => {
  fs.readFile('placar.json', (err, data) => {
    if (err) return res.status(500).send('Erro ao ler placar');
    res.json(JSON.parse(data));
  });
});

app.post('/placar', (req, res) => {
  const novoResultado = req.body;
  fs.readFile('placar.json', (err, data) => {
    let placar = [];
    if (!err) placar = JSON.parse(data);
    placar.push(novoResultado);
    placar.sort((a, b) => b.pontos - a.pontos);
    fs.writeFile('placar.json', JSON.stringify(placar, null, 2), err => {
      if (err) return res.status(500).send('Erro ao salvar');
      res.send('Placar salvo!');
    });
  });
});

app.listen(PORT, () => {
});
