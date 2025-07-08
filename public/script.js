let pontos = 0;
let nomeCorreto = "";
let intervaloIds = [1, 151];
let rodadaAtual = 0;
let totalRodadas = 10;
let jogador = "";
let nivelSelecionado = ""; 
let usadosNaPartida = [];  

function pegarPokemon(id) {
  return fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
    .then(res => res.json())
    .then(data => ({
      nome: data.name.charAt(0).toUpperCase() + data.name.slice(1),
      imagem: data.sprites.other["official-artwork"].front_default
    }));
}

function atualizarPontos() {
  document.getElementById("pontos").innerText = `Pontos: ${pontos}`;
}

function atualizarRodada() {
  document.getElementById("rodada-info").innerText = `Rodada: ${rodadaAtual}/${totalRodadas}`;
}

function iniciarJogo() {
  jogador = document.getElementById("player-name").value.trim();
  if (!jogador) {
    alert("Digite seu nome!");
    return;
  }

  nivelSelecionado = document.getElementById("nivel").value;
  if (nivelSelecionado === "facil") {
    intervaloIds = [1, 151];
    totalRodadas = 10;
  } else if (nivelSelecionado === "medio") {
    intervaloIds = [152, 493];
    totalRodadas = 15;
  } else {
    intervaloIds = [494, 898];
    totalRodadas = 20;
  }

  pontos = 0;
  rodadaAtual = 0;
  usadosNaPartida = [];

  // Remover a tela preta e mostrar o conteúdo
  document.getElementById("top-screen").classList.remove("tela-preta");
  document.getElementById("logo-topo").style.display = "none";
  document.getElementById('rank-buttons').style.display = 'none';
  const msg = document.getElementById("mensagem-abaixo");
  if (msg) msg.style.display = "none";


  ["rodada-info", "pergunta", "pokemon-img", "mensagem-rodada"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = "block";
  });

  document.getElementById("menu").style.display = "none";
  document.getElementById("game").style.display = "flex";
  document.getElementById("ranking").style.display = "none";

  novaRodada();
}

function novaRodada() {
  rodadaAtual++;
  if (rodadaAtual > totalRodadas) {
    finalizarJogo();
    return;
  }

  atualizarPontos();
  atualizarRodada();

  let ids = [];
  let tentativas = 0;
  while (ids.length < 3 && tentativas < 50) {
    let id = Math.floor(Math.random() * (intervaloIds[1] - intervaloIds[0] + 1)) + intervaloIds[0];
    if (!ids.includes(id) && !usadosNaPartida.includes(id)) {
      ids.push(id);
      usadosNaPartida.push(id);
    }
    tentativas++;
  }

  if (ids.length < 3) {
    finalizarJogo();
    return;
  }



  Promise.all(ids.map(pegarPokemon)).then(pokemons => {
    nomeCorreto = pokemons[0].nome;
    document.getElementById("pokemon-img").src = pokemons[0].imagem;

    let opcoes = pokemons.map(p => p.nome).sort(() => Math.random() - 0.5);
    let opcoesDiv = document.getElementById("opcoes");
    opcoesDiv.innerHTML = "";
    opcoes.forEach(nome => {
      let btn = document.createElement("button");
      btn.innerText = nome;
      btn.onclick = () => verificarResposta(nome);
      opcoesDiv.appendChild(btn);
    });
  });
}

function verificarResposta(nome) {
  const mensagemDiv = document.getElementById("mensagem-rodada");
  const imagemPokemon = document.getElementById("pokemon-img");
  const perguntaDiv = document.getElementById("pergunta");

  imagemPokemon.style.display = "none";
  if (perguntaDiv) perguntaDiv.style.display = "none";

  if (nome === nomeCorreto) {
    pontos += 10;
    mensagemDiv.innerText = `🎉 Acertou! Era o ${nomeCorreto}.`;
    mensagemDiv.style.color = "green";
  } else {
    pontos -= 5;
    mensagemDiv.innerText = `❌ Errou! Era o ${nomeCorreto}.`;
    mensagemDiv.style.color = "red";
  }

  setTimeout(() => {
    mensagemDiv.innerText = "";
    imagemPokemon.style.display = "block";
    if (perguntaDiv) perguntaDiv.style.display = "block";
    novaRodada();
  }, 1500);
}

function finalizarJogo() {
  fetch('/placar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome: jogador, pontos: pontos, dificuldade: nivelSelecionado })
  })
  .then(() => fetch('/placar'))
  .then(res => res.json())
  .then(ranking => {
    let posicao = ranking.findIndex(p => p.nome === jogador && p.pontos === pontos) + 1;
    const mensagemFinal = document.getElementById("mensagem-final");
    document.getElementById("pokemon-img").style.display = "none";
    document.getElementById("pergunta").style.display = "none";
    document.getElementById("mensagem-rodada").style.display = "none";
    mensagemFinal.style.display = "block";
    mensagemFinal.style.color = pontos >= 0 ? "lightgreen" : "red";
    mensagemFinal.innerText = pontos >= 0
      ? `🎉 ${jogador}, você ficou em ${posicao}º lugar com ${pontos} pontos!`
      : `😢 ${jogador}, resultado negativo. ${posicao > 0 ? 'Você ficou em ' + posicao + 'º lugar.' : ''}`;

    document.getElementById("game").style.display = "none";
    document.getElementById("btn-reiniciar").style.display = "block";
    document.getElementById("ranking").style.display = "none";
  });
}


function salvarPlacar() {
  fetch('/placar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome: jogador, pontos: pontos })
  }).then(() => mostrarRanking());
}

function mostrarRanking() {
  fetch('/placar')
    .then(res => res.json())
    .then(ranking => {
      // Ordena do maior para menor
      ranking.sort((a, b) => b.pontos - a.pontos);

      // Encontra posição do jogador, se houver
      const posicao = ranking.findIndex(jog => jog.nome === jogador) + 1;

      const mensagemFinal = document.getElementById("mensagem-final");

      if (!jogador || pontos === 0) {
        mensagemFinal.innerHTML = "<p><strong>Ranking geral:</strong></p>";
      } else {
        mensagemFinal.innerHTML = `
          <p>${pontos >= 0 ? "🎉 Parabéns" : "😢 Poxa"}, <strong>${jogador}</strong>!</p>
          <p>Você fez <strong>${pontos} pontos</strong> e ficou na <strong>${posicao}ª posição</strong> do ranking!</p>
        `;
      }

      mensagemFinal.style.display = "block";

      // Atualiza tela
      document.getElementById("btn-reiniciar").style.display = "block";
      document.getElementById("ranking").style.display = "block";
      document.getElementById("menu").style.display = "none";
      document.getElementById("game").style.display = "none";
      document.getElementById("pokemon-img").style.display = "none";
      document.getElementById("rodada-info").style.display = "none";
      document.getElementById("pergunta").style.display = "none";
      document.getElementById("mensagem-rodada").style.display = "none";

      // Preenche ranking
      let lista = document.getElementById("ranking-list");
      lista.innerHTML = "";
      ranking.forEach((item, index) => {
        let li = document.createElement("li");
        li.innerText = `${index + 1}. ${item.nome} = ${item.pontos} pts`;
        lista.appendChild(li);
      });
    });
}



function resetarJogo() {
  pontos = 0;
  rodadaAtual = 0;
  jogador = "";

  // Esconde tudo que é do jogo e ranking
  document.getElementById("ranking").style.display = "none";
  document.getElementById("btn-reiniciar").style.display = "none";
  document.getElementById("game").style.display = "none";
  document.getElementById("menu").style.display = "none";
  document.getElementById("mensagem-final").style.display = "none";
  document.getElementById('rank-buttons').style.display = 'none';
  // Mostra a tela inicial com o botão COMEÇAR
  document.getElementById("tela-inicial").style.display = "flex";

  // Coloca a tela do topo preta e esconde os elementos
  const topScreen = document.getElementById("top-screen");
  topScreen.classList.add("tela-preta");

  document.getElementById("rodada-info").style.display = "none";
  document.getElementById("pergunta").style.display = "none";
  document.getElementById("pokemon-img").style.display = "none";
  document.getElementById("mensagem-rodada").style.display = "none";

  const msg = document.getElementById("mensagem-abaixo");
  if (msg) msg.style.display = "none";


  // Limpa a imagem do Pokémon para não mostrar nada
  document.getElementById("pokemon-img").src = "";
}

function mostrarMenu() {
  
  document.getElementById("tela-inicial").style.display = "none";
  document.getElementById("menu").style.display = "flex";
  document.getElementById('rank-buttons').style.display = 'none';   

  // Mantém a tela preta aqui 
  document.getElementById("top-screen").classList.remove("tela-preta");
  document.getElementById("logo-topo").style.display = "block";

  ["rodada-info", "pergunta", "pokemon-img", "mensagem-rodada", "ranking"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = "none";
  });
}


function abrirMenu() {
  // esconde jogo e afins
  document.getElementById("tela-inicial").style.display = "none";
  document.getElementById("menu").style.display = "none";
  document.getElementById("game").style.display = "none";
  document.getElementById("btn-reiniciar").style.display = "none";
  document.getElementById("mensagem-final").style.display = "none";
  ["rodada-info", "pergunta", "pokemon-img", "mensagem-rodada"].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.display = "none";
  });

  // tela de ranking em cima
  document.getElementById("ranking").style.display = "block";
  // mostra os três botões na tela de baixo
  document.getElementById("rank-buttons").style.display = "block";

  // OCULTA campos de configuração (player/nivel) se quiser:
  document.getElementById("menu").style.display = "none";

  // carrega ranking geral ao abrir
  carregarRanking();         // sem filtro = ranking completo
}

async function carregarRanking(dificuldade = null) {
  try {
    const res = await fetch('/placar');
    let dados = await res.json();

    if (dificuldade) {
      dados = dados.filter(r => r.dificuldade === dificuldade);
    }
    // ordena
    dados.sort((a,b) => b.pontos - a.pontos);

    const ul = document.getElementById('ranking-list');
    ul.innerHTML = '';
    dados.slice(0,10).forEach((p,i) => {
      const li = document.createElement('li');
      li.textContent = `${i+1}. ${p.nome} – ${p.pontos} pts`;
      ul.appendChild(li);
    });
  } catch (e) {
    console.error('Erro ao carregar ranking', e);
  }
}



const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use(express.json());

// Rota GET para todos os placares
app.get('/placar', (req, res) => {
  fs.readFile('placar.json', (err, data) => {
    if (err) return res.status(500).send('Erro ao ler placar');
    res.json(JSON.parse(data));
  });
});

// Rota POST para salvar novo placar
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
  console.log(`Servidor rodando na porta ${PORT}`);
});
