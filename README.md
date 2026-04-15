<div align="center">

```
   ██████╗ ██████╗ ███╗   ███╗██████╗ ██╗██╗     ███████╗███╗   ██╗███████╗
  ██╔════╝██╔═══██╗████╗ ████║██╔══██╗██║██║     ██╔════╝████╗  ██║██╔════╝
  ██║     ██║   ██║██╔████╔██║██████╔╝██║██║     █████╗  ██╔██╗ ██║███████╗
  ██║     ██║   ██║██║╚██╔╝██║██╔═══╝ ██║██║     ██╔══╝  ██║╚██╗██║╚════██║
  ╚██████╗╚██████╔╝██║ ╚═╝ ██║██║     ██║███████╗███████╗██║ ╚████║███████║
   ╚═════╝ ╚═════╝ ╚═╝     ╚═╝╚═╝     ╚═╝╚══════╝╚══════╝╚═╝  ╚═══╝╚══════╝
```

### ✦ Interactive Compiler Learning Platform ✦

[![Live Demo](https://img.shields.io/badge/🚀%20LIVE%20DEMO-compilens.vercel.app-6d28d9?style=for-the-badge&logoColor=white)](https://compilens.vercel.app/)
[![MIT License](https://img.shields.io/badge/License-MIT-06b6d4?style=for-the-badge)](LICENSE)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://compilens.vercel.app/)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://compilens.vercel.app/)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://compilens.vercel.app/)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://compilens.vercel.app/)

<br/>

> *"Type code. Watch it compile. Understand everything."*

<br/>

---

<!-- TYPING ANIMATION -->
<a href="https://compilens.vercel.app/">
  <img src="https://readme-typing-svg.demolab.com?font=JetBrains+Mono&weight=600&size=20&pause=1000&color=8B5CF6&center=true&vCenter=true&multiline=true&width=600&height=80&lines=Learn+Compiler+Design+Visually+%F0%9F%94%8D;From+Tokens+to+Assembly+%E2%86%92+Step+by+Step;DFA+%7C+NFA+%7C+CFG+%7C+FIRST%2BFOLLOW+%7C+Quiz" alt="Typing SVG" />
</a>

</div>

---

<div align="center">

## ✨ What is Compilens?

</div>

> **Compilens** is a visually stunning, browser-based **interactive compiler learning tool** designed for students, developers, and educators. It transforms the traditionally dry subject of compiler design into an immersive, hands-on experience — complete with live code simulation, animated phase breakdowns, automata visualizations, grammar tools, and a built-in quiz engine.

<div align="center">

**🌐 &nbsp; [Try it Live → compilens.vercel.app](https://compilens.vercel.app/)**

</div>

---

## 🚀 Features

<table>
<tr>
<td width="50%">

### 📖 Learning Modules
- **Compiler Basics** — What is a compiler, vs interpreters
- **Six Phases of Compilation** — From lexical to code generation
- **Parsing Techniques** — LL(1), LR, top-down vs bottom-up
- **Grammar & CFG** — Production rules, derivations, ambiguity
- **FIRST & FOLLOW Sets** — Step-by-step LL(1) parse table builder

</td>
<td width="50%">

### ⚡ Interactive Tools
- **Live Compiler Simulator** — Type real code, watch all 6 phases
- **Automata Visualizer** — DFA/NFA transition tables & conversion
- **Quiz Engine** — Instant feedback, score tracking
- **Error Detection** — Lexical, syntax & semantic errors shown live
- **Responsive Sidebar Navigation** — Smooth, mobile-friendly UI

</td>
</tr>
</table>

---

## 🔁 The Six Compiler Phases — Visualized

```
Source Code
     │
     ▼
┌────────────────────┐
│  1. Lexical        │  ←  Tokenizes your code into keywords, identifiers, literals
│     Analysis       │
└────────┬───────────┘
         │  Token Stream
         ▼
┌────────────────────┐
│  2. Syntax         │  ←  Builds a Parse Tree, checks grammar rules
│     Analysis       │
└────────┬───────────┘
         │  Parse Tree
         ▼
┌────────────────────┐
│  3. Semantic       │  ←  Type checking, scope resolution, symbol table
│     Analysis       │
└────────┬───────────┘
         │  Annotated AST
         ▼
┌────────────────────┐
│  4. Intermediate   │  ←  Three-Address Code / IR generation
│     Code Gen       │
└────────┬───────────┘
         │  IR Code
         ▼
┌────────────────────┐
│  5. Code           │  ←  Loop unrolling, constant folding, dead code elimination
│     Optimization   │
└────────┬───────────┘
         │  Optimized IR
         ▼
┌────────────────────┐
│  6. Code           │  ←  Target machine code / assembly output
│     Generation     │
└────────────────────┘
         │
         ▼
   Machine Code 🎯
```

---

## 🏗️ Project Structure

```
compilens/
├── 📄 index.html          # Main app shell — all 8 sections, sidebar, topbar
├── 🎨 style.css           # Full design system — dark theme, animations, layout
└── ⚙️  script.js           # All interactivity — simulator, quiz, automata, FIRST/FOLLOW
```

> **Zero dependencies.** Pure HTML + CSS + JavaScript. No build step required.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Structure** | HTML5 (semantic, 2100+ lines) |
| **Styling** | CSS3 — custom properties, grid, flexbox, keyframe animations |
| **Logic** | Vanilla JavaScript — no frameworks, no dependencies |
| **Fonts** | Syne (display) + JetBrains Mono (code) via Google Fonts |
| **Deployment** | Vercel (auto-deploy from Git) |

---

## ⚡ Getting Started

### Option 1 — Just Open It (No Setup)
```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/compilens.git

# Navigate into the folder
cd compilens

# Open directly in browser
open index.html
# or on Linux:
xdg-open index.html
# or on Windows:
start index.html
```

### Option 2 — Local Dev Server (Recommended)
```bash
# Using Python
python -m http.server 3000

# Using Node.js / npx
npx serve .

# Using VS Code
# Install "Live Server" extension → Right-click index.html → Open with Live Server
```

Then visit: **`http://localhost:3000`**

---

## 📚 Modules Overview

| # | Module | Description | Level |
|---|--------|-------------|-------|
| 🏠 | **Home** | Dashboard with all topic cards & stats | — |
| 📖 | **Compiler Basics** | Compiler vs interpreter, structure overview | 🟢 Beginner |
| 🔁 | **Phases of Compiler** | All 6 phases with examples and animations | 🔵 Core |
| 🌳 | **Parsing Techniques** | LL(1), LR(0), left recursion, parse trees | 🟡 Intermediate |
| 🤖 | **Automata (DFA/NFA)** | Transition tables, NFA→DFA conversion | 🔴 Advanced |
| 📐 | **Grammar & CFG** | Production rules, derivations, ambiguity | 🟣 Theory |
| 📊 | **FIRST & FOLLOW** | Set computation, LL(1) parse table builder | 🔴 Advanced |
| ⚡ | **Compiler Simulator** | Live 6-phase visualization of real code | 🟢 Interactive |
| 🧠 | **Quiz Mode** | 10+ questions, score tracking, instant feedback | 🧩 Quiz |

---

## 🌐 Live Deployment

<div align="center">

[![Deploy with Vercel](https://vercel.com/button)](https://compilens.vercel.app/)

**🔗 https://compilens.vercel.app/**

Deployed on **Vercel** with automatic deployments on every push to `main`.

</div>

### Deploy Your Own Fork

```bash
# 1. Fork this repository on GitHub

# 2. Go to vercel.com → New Project → Import your fork

# 3. Framework Preset: Other
#    Build Command: (leave empty)
#    Output Directory: . (root)

# 4. Click Deploy ✅
```

---

## 🤝 Contributing

Contributions are warmly welcome! Here's how to get started:

```bash
# 1. Fork the repo
# 2. Create a feature branch
git checkout -b feature/your-feature-name

# 3. Make your changes
# 4. Commit with a clear message
git commit -m "feat: add LR(1) parsing visualization"

# 5. Push and open a Pull Request
git push origin feature/your-feature-name
```

### 💡 Ideas for Contributions
- [ ] Add syntax highlighting to the code editor
- [ ] Add more quiz questions across topics
- [ ] LR(1) / LALR parser simulator
- [ ] Export parse trees as SVG/PNG
- [ ] Dark/light theme toggle
- [ ] Localization (multi-language support)

---

## 📄 License

This project is licensed under the **MIT License** — free for personal and educational use.

---

## 🙏 Acknowledgements

- **[JetBrains Mono](https://www.jetbrains.com/lp/mono/)** — Beautiful monospace font for code displays
- **[Syne](https://fonts.google.com/specimen/Syne)** — Display typeface for the UI
- **[Vercel](https://vercel.com/)** — Seamless free hosting for the live demo
- All the **compiler design textbooks** (Dragon Book 🐉, Purple Book) that inspired the content

---

<div align="center">

<!-- FOOTER WAVE -->
<img width="100%" src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=12,20,25,30&height=120&section=footer&animation=twinkling" />

**Made with 💜 for students who want to truly understand how compilers work**

⭐ **Star this repo if it helped you learn!** ⭐

[![GitHub stars](https://img.shields.io/github/stars/YOUR_USERNAME/compilens?style=social)](https://github.com/YOUR_USERNAME/compilens)
&nbsp;
[![GitHub forks](https://img.shields.io/github/forks/YOUR_USERNAME/compilens?style=social)](https://github.com/YOUR_USERNAME/compilens/fork)

</div>

