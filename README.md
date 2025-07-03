# 🕹️ Jogo Pokémon DS - Quiz Interativo

Um jogo estilo *Nintendo DS* onde o jogador precisa identificar corretamente os Pokémon com base em suas imagens. Inspirado no visual retrô e na dinâmica clássica de quiz, com trilha de pontuação e rankings separados por dificuldade.

[🎮 **JOGUE AGORA**](https://game-pokemon-g88l.onrender.com/)

---

## 📚 Objetivo do Projeto

Este jogo foi criado com os seguintes objetivos:

- 🧠 Desenvolver lógica de programação aplicada em um projeto completo
- 🌐 Trabalhar com APIs públicas reais (PokeAPI)
- 💾 Praticar persistência de dados com banco de dados (Turso)
- 🎨 Criar uma interface interativa e responsiva usando HTML/CSS/JS
- 🚀 Compreender o ciclo completo de desenvolvimento web: frontend, backend e deploy

---

## 🕹️ Como funciona o jogo

1. O jogador digita seu nome e escolhe um **nível de dificuldade**:
   - 🟢 Fácil: Pokémon da 1ª geração (ID 1–151)
   - 🟡 Médio: Gerações intermediárias (ID 152–493)
   - 🔴 Difícil: Pokémon mais recentes (ID 494–898)

2. Em cada rodada, aparece um Pokémon com 3 nomes possíveis:
   - Se acertar, ganha **+10 pontos**
   - Se errar, perde **–5 pontos**

3. Ao final do jogo, o jogador vê sua **pontuação final e posição no ranking**.

---

## 🏆 Ranking inteligente

- Cada partida salva automaticamente a pontuação no banco de dados.
- O ranking é separado por **nível de dificuldade**.
- Clicando em “Menu”, o jogador pode visualizar:
  - 👑 Ranking geral
  - 💪 Ranking Difícil
  - 🧠 Ranking Médio
  - 😊 Ranking Fácil

---

## 🚀 Tecnologias utilizadas

| Camada       | Tecnologias                                               |
|--------------|------------------------------------------------------------|
| Frontend     | HTML, CSS (estático retrô), JavaScript puro               |
| Backend      | Node.js + Express                                          |
| Banco de Dados | [Turso](https://turso.tech/) (SQLite moderno em nuvem)    |
| API externa  | [PokeAPI](https://pokeapi.co/) para dados e imagens        |
| Hospedagem   | [Render.com](https://render.com/)                          |


---
> ✅ **Este projeto foi desenvolvido no [IFTM – Instituto Federal de Educação, Ciência e Tecnologia do Triângulo Mineiro]**
> como parte da disciplina **Projeto Integrador Extensionista I** (Curso Técnico em Informática).
