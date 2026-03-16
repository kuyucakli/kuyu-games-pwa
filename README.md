# Kuyu Games

**Kuyu Games** is a multi-game platform built to explore the intersection of web technologies and 3D physics. The platform supports various physics-based experiences with a focus on performance and tactile feedback.

## Featured Games

### 1. Tahterevallis
The flagship title where precision is key. 
* **Status:** Playable
* **Content:** 3 unique levels with increasing difficulty and complex obstacle configurations.
* **Goal:** Navigate the ball to the green goal while avoiding red traps and falling off the edge.

### 2. Pinball
A classic arcade experience reimagined for the web.
* **Status:** In Development 
* **Planned Features:** Multi-ball support, bumper physics, and high-score tracking.

---

## Gameplay Demo
Check out the Tahterevallis intro:
**[Watch the Gameplay Intro on YouTube](https://www.youtube.com/watch?v=f4brBwoCj3E)**

---

## Key Technical Features
* **Custom Game Engine:** Built on a modular architecture that allows for easy addition of new games (like the upcoming Pinball).
* **High-Performance Physics:** Powered by **Rapier3d** (Rust-based physics for JS) for deterministic and stable simulations.
* **Immersive 3D Rendering:** Developed with **Three.js**, featuring dynamic lighting, shadows, and optimized GLTF assets.
* **Velocity-Based Audio:** A dynamic sound system where audio **pitch** and **gain** are mapped to the physical speed of game objects.

---

## Technical Stack
* **Framework:** React (Tanstackstart.js)
* **3D Engine:** Three.js
* **Physics Engine:** Rapier3d
* **Event System:** Mitt
* **Styling:** Tailwind CSS
* **Modeling:** GLTF (Blender)

## Music & Sound Credits

The atmospheric background music in **Kuyu Games** is provided courtesy of **mobygratis.com**.

* **Track:** All simple things ab oz inst
* **Artist:** Moby
* **Source:** [mobygratis.com](https://www.mobygratis.com)
---

## Architecture
The project follows a **System-based Architecture** to keep the game logic decoupled from the rendering engine:
* **BallSystem**: Handles physical entities and their properties.
* **HoleSystem**: Goal/Trap detection and scoring logic.
* **AudioSystem**: Real-time manipulation of audio buffers based on game state.
* **LevelSystem**: Dynamic level loading via configuration files.

---

## Installation & Setup

1. Clone the repository:
   ```bash
   git clone [https://github.com/kuyucakli/kuyu-games-pwa.git](https://github.com/kuyucakli/kuyu-games-pwa.git)