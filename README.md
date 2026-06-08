# Pipe-Rescue
Assignment for AI game intern - Bombayplay
# Playable Game
**itch.io Link:** https://srevess.itch.io/pipe-rescue

**GitHub Source:** https://github.com/srevess/pipe-rescue
**Cocos Creator: ** https://drive.google.com/drive/folders/1KiBt1huKakNt2tirLbYwpgXO8fBnDdMB?usp=drive_link
---

# What I Built

A pipe-connection puzzle playable ad where the player taps tiles on a 4×4 grid
to rotate them and connect the Water Source to the Goal within 12 moves.

# Features
- 4×4 pipe grid with tap-to-rotate mechanic (90° per tap)
- BFS (Breadth-First Search) path detection running after every tap
- Real-time pipe connection highlight in teal after each rotation
- 12 move limit with live countdown (turns red at 3 moves left)
- Win screen with pulse animation on connected path
- Lose screen when moves run out
- End card with Play Now CTA button
- Portrait 9:16 responsive layout for mobile
- Works on desktop and mobile browsers

---

# How to Run

#  Option 1 — Play instantly (no install)
Open in any browser: **https://srevess.itch.io/pipe-rescue**

# Option 2 — Run locally
1. Download or clone this repository
2. Open `index.html` directly in Chrome or Firefox
3. No server, no install, no build step required

### Option 3 — Run Cocos Creator project
1. Install Cocos Creator 3.8.x from https://www.cocos.com/creator
2. Open the `PipeRescue` project folder in Cocos Dashboard
3. Press Play in the editor to preview
4. Or: Project → Build → Web Mobile → export HTML5 build

---

##  Tools & Technologies Used

| Tool | Purpose |
| Cocos Creator 3.8 | Game engine, scene editor, HTML5 export |
| TypeScript | All game logic scripts |
| Claude AI (Anthropic) | Game architecture, BFS algorithm, all scripts, pipe rendering |
| GitHub | Source code hosting |
| itch.io | Game hosting and submission |
| VS Code | Script editing |

---

##  AI Usage (Claude AI)

Claude AI was used extensively throughout this project:

### What Claude AI generated:
- Complete game architecture and script structure
- `GameData.ts` — bitmask system, puzzle data, BFS path solver
- `TileRenderer.ts` — pipe drawing using Cocos Graphics API
- `GridManager.ts` — grid spawning, tap handling, win/lose logic
- `UIManager.ts` — HUD, buttons, end card control
- Puzzle design with mathematical verification
- HTML5 standalone version (index.html)
- Scene hierarchy setup guide
- This README

### What I did manually:
- Installed and configured Cocos Creator 3.8
- Built the complete scene hierarchy in the editor
- Wired all Inspector property references between nodes
- Debugged rendering issues (pipe arm coordinates)
- Fixed circular dependency between GridManager and UIManager
- Tested in editor and browser
- HTML5 export and deployment to itch.io and GitHub Pages

---

##  Project Structure

```
PipeRescue/
├── assets/
│   └── scripts/
│       ├── GameData.ts        ← Core logic: bitmask, puzzle, BFS
│       ├── TileRenderer.ts    ← Pipe drawing via Cocos Graphics
│       ├── GridManager.ts     ← Grid, input, game loop
│       └── UIManager.ts       ← HUD, buttons, end card
├── index.html                 ← Standalone HTML5 build (no server needed)
└── README.md


---

## How the Game Works (Technical)

### Bitmask System
Each pipe tile's open sides are encoded as a bitmask:
- Top = 1, Right = 2, Bottom = 4, Left = 8
- Example: Straight vertical pipe = Top + Bottom = 1 + 4 = 5
- Example: Elbow top-right = Top + Right = 1 + 2 = 3

### Rotation
Each tap rotates the bitmask 90° clockwise:
Top→Right, Right→Botton, Bottom→Left, Left→Top

### Path Detection (BFS)
After every tap, Breadth-First Search runs from the START tile.
At each tile it checks: does this tile open toward a neighbor
AND does that neighbor open back? If BFS reaches the GOAL → win.

### Puzzle Design
Solution path: START(0,0) → (1,0) → (2,0) → (2,1) → (2,2) → (2,3) → GOAL(3,3)
- Minimum taps to solve: 6
- Move limit: 12
- All other tiles are decoys

---

##  Assessment Checklist

| Requirement | Status |
|-------------|--------|
| Clear first tap, understandable without explanation 
| Pipe puzzle is solvable 
| App detects correct connection 
| HTML5 build opens and plays without errors 
| Portrait mobile layout 9:16 
| README with run steps and AI tool usage 
| Move limit  12 moves 
| Win screen / End card 
| Lose screen / Try again 
| Play Now CTA button 

---

##  What I Would Improve With More Time

- Animated water flow through connected pipes
- Sound effects on tap, win, and lose
- Multiple randomized puzzle levels
- Smoother 90° rotation animation on tiles
- Particle effects on win
- Timer mode (optional per PRD)
- Proper store link on Play Now button

---

##  Cocos Creator Version
3.8.x

---

##  Submitted By
GitHub: https://github.com/srevess
Game: https://srevess.itch.io/pipe-rescue
Cocos Creator: https://drive.google.com/drive/folders/1KiBt1huKakNt2tirLbYwpgXO8fBnDdMB?usp=drive_link

