# 🎮 Jogo Pokémon DS - Quiz Interativo

Um jogo estilo *Nintendo DS* onde o jogador precisa identificar corretamente os Pokémon com base em suas imagens. Inspirado no visual retrô e na dinâmica clássica de quiz, com trilha de pontuação e rankings separados por dificuldade.

![pokemon-preview](https://your-screenshot-link-if-you-have-one)

---

## 🧠 Como funciona

- O jogador digita seu nome e escolhe um nível de dificuldade:
  - 🟢 **Fácil**: Pokémons da 1ª geração (IDs 1 a 151)
  - 🟡 **Médio**: Gerações intermediárias (IDs 152 a 493)
  - 🔴 **Difícil**: Pokémons mais recentes (IDs 494 a 898)
- A cada rodada, um Pokémon é exibido com **3 opções de nome**.
- Responda corretamente para ganhar pontos.
- Ao final, sua pontuação é salva em um **ranking por nível**.

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

## 📦 Instalação local

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/game-pokemon.git
   cd game-pokemon
