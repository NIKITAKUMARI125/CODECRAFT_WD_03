# 🎮 Tic-Tac-Toe Web App (with Unbeatable AI)

A modern, neon-themed Tic-Tac-Toe game built with **HTML, CSS, and JavaScript** — playable either as 2-player or against an AI opponent powered by the **Minimax algorithm**.

🔗 **Live Demo:** _add your deployed link here after Step 3 (GitHub Pages / Netlify)_/[file:///C:/Users/sunil/Downloads/tic-tac-toe%20(2)/tic-tac-toe/index.html]
file:///C:/Users/sunil/Downloads/tic-tac-toe%20(2)/tic-tac-toe/index.html

---

## ✨ Features

- ✅ **2-Player Mode** — play with a friend on the same device
- 🤖 **Vs AI Mode** — challenge the computer with 3 difficulty levels:
  - 😴 **Easy** — AI picks random moves
  - 😐 **Medium** — AI blocks your winning move / takes its own winning move when available
  - 🔥 **Unbeatable** — AI uses the **Minimax algorithm** to play perfectly (best you can do is draw)
- 🔁 **Alternating Starter** — the starting player switches every round (Round 1 = ❌ starts, Round 2 = ⭕ starts, and so on)
- 📊 **Live Scoreboard** — tracks wins for X, wins for O, and draws
- 😄 **Emoji Reactions** — dynamic emoji panel reflects the current game state (turn, thinking, win, draw)
- 🎨 **Custom Neon UI** — glowing panels, custom background image, responsive grid layout
- 🏆 **Winning Cell Highlight** — winning combination glows/pulses when a player wins

---

## 🛠️ Tech Stack

- **HTML5** — page structure
- **CSS3** — Flexbox/Grid layout, animations, glassmorphism-style panels
- **JavaScript (Vanilla)** — game logic, state management, Minimax AI algorithm

---

## 📂 Project Structure

```
tic-tac-toe/
├── index.html       # Page structure & layout
├── style.css         # Styling, animations, background, responsive design
├── script.js          # Game logic, AI (Minimax), scoring, round handling
└── background.png    # Background image
```

---

## 🚀 How to Run Locally

1. Clone or download this repository
2. Make sure all 4 files are in the **same folder**
3. Open `index.html` in your browser (or use "Live Server" in VS Code)

No build steps, no dependencies — just open and play.

---

## 🧠 How the AI Works (Minimax)

On **Unbeatable** difficulty, the AI evaluates every possible future game state recursively:

- It simulates all possible moves for both itself and the human player
- Scores each resulting game state (+10 for an AI win, -10 for a human win, 0 for a draw), adjusted by how many moves deep the outcome is
- Picks the move that **maximizes its guaranteed outcome**, assuming the human also plays optimally

This is a classic game-theory algorithm and guarantees the AI will never lose — at best, a human can force a draw.

---

## 🔮 Possible Future Improvements

- [ ] Sound effects for moves, wins, and draws
- [ ] Animated strikethrough line through the winning combination
- [ ] Persistent scores using local storage
- [ ] Full mobile responsiveness pass
- [ ] Rebuild in React as a learning exercise

---

## 👤 Author

Built as a personal web development project — feel free to fork, modify, and use for learning.
