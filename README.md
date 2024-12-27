# Mictlan Maze Game
Hi! My name is Allen Garcia! I tried to create a game based on aztec mythology, check it out! Thank you for reading.

## Introduction

The idea for this project came from the Aztec mythological journey through Mictlán, where souls had to pass through nine levels filled with challenges to reach their final destination. In this game, you, as the player, will traverse through mazes inspired by this myth. Each level's design dynamics are inspired by the actual myth stories. I'd have liked to include more details/explanation prompts throughout the game, but I am happy to explain them here.

This project was created using HTML, CSS, and JavaScript, along with dynamic modules for level loading and user state management. The game features grid-based movement, dynamic maze generation, and progress tracking using localStorage.

## Gameplay Overview

- **Objective:** Navigate through a series of mazes to reach the goal 🎯, to go farther ahead into reaching the end of the journey. For some levels, the player must collect an item or avoid enemies.
- **Player Movement:** The player uses the arrow keys (up/down/right/left) to move their character through the maze.
- **Progress Tracking:** Your progress is saved using localStorage, so you can pick up where you left off (as long as the log in information is the same). On regards to this area, there were some slight complications but it should work as of my last check!


## Features

1. **Dynamic Maze Generation:**
   - Each maze is randomly generated using Randomized Prim's Algorithm. This part was especially difficult, but I'll explain in design!
   - This ensures a unique and perfect maze every time, with no loops or inaccessible areas.

2. **Themed Backgrounds:**
   - Each level has its own stylized Aztec-inspired background to set the tone. I relied on AI-generated art websites to generate these backgrounds. Just for context, I used the website: https://deepdreamgenerator.com/

3. **Interactive Elements:**
   - Dog Collectible (🐺): Found at a random location in the maze. You cannot proceed without collecting it!
   - Start (`🚩`) and Goal (`🎯`) Tiles: Clearly marked locations to guide players.
   - Enemies and collisions: Once the player touched the enemies (shards/mountains), it would return back to the start position.

4. **Login and Signup System:**
   - Each player has their own username and password.
   - Progress is tied to individual accounts.

---

## Levels

### Level 1: The Beginning (I)
- **Grid Size:** 17x17
- **Challenge:** Find the dog and reach the goal.
- **Background:** A simple maze in which the player's only goal is to find the dog which will act as the guide to cross to the next level. In the myth, dogs were very important as they would allow souls to cross the river and proceed to other levels of the Mictlan.

### Level 2: The Obstacle Path
- **Grid Size:** 17x17
- **Challenge:** Avoid being hit by the hills
- **Background:** A maze in which the player must reach the goal without being crushed by the hills. According to the myth, this level had angry hills that would open and close, so the soul crossign had to find the perfect time to run through the middle of the hills to avoid being crushed.

### Level 3: Final Challenge
- **Grid Size:** 17x17
- **Challenge:** Avoid being hit by the shards.
- **Background:** A maze in which obsidian shards are the obstacle/enemy. They have a more randomized apparation compared to the hills. According to the myth, this level had the god of punishment and obsidian, "Itztépetl."

Last note:

Thank you so much for playing this game! and reviewing it. I had a lot of issues while actually getting to finish it. I'd solve certain aspects and other ones would mess up at times. I'm sure there's some inefficiencies/bugs I didn't get to solve, but either way I am extremely happy with my CS50 experience. At the beginning of the semester, even creating something of this sort seemed impossible, but here we are ;D. I hope to one of these days implement some of the "better" features that I had set as my goal for this project.

Best,
Allen 


