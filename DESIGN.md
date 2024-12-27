# DESIGN.md

## Introduction

Hi, Allen Garcia here again! This design document is meant to give you a closer look at how I implemented the Mictlán Maze Game and why I made certain decisions along the way. This project was both fun and challenging, and I'll try my best to explain the thought process behind its key features and mechanics. From maze generation to level-specific obstacles, each part had its ups and downs, and I’ll break it down.

---

## Dynamic Maze Generation

The most technical part of this project was generating the mazes dynamically. I used Randomized Prim's Algorithm for this. The process starts with a grid where every cell has walls on all four sides, and this is initialized using the createGrid function. Each cell in the grid is represented as an object with a visited property and a walls array to indicate whether the top, right, bottom, or left walls are intact. Starting from a specific cell (in Level 1, the top-left corner), I mark it as "visited" by updating its visited property and add its neighboring walls to a list using the addWalls function. The walls list is then processed by randomly picking a wall, checking if it connects to an unvisited cell, and if so, removing the wall and connecting the two cells. This involves modifying the walls property for both the current cell and the neighboring cell to remove the shared wall.

For example, in the generateMaze function, I use the directions array to track the relationship between cells and their wall, ensuring that the two cells are properly linked. I continue marking cells as visited and adding new walls to the list until there are no walls left to process.

For example, in **Level 1**, I used a 17x17 grid and had to make sure the dog (🐺) and goal (🎯) tiles were accessible. The algorithm made sure every cell was connected to the maze with no dead ends that couldn’t be reached. I had a lot of trouble debugging early on because I forgot to properly link walls between cells, which left gaps in the paths. However, getting to actually have a functional maze was pretty rewarding. This maze structure would be used for the other levels as well!


## Levels and Obstacles

### Level 1: The Beginning
This level is designed to introduce the player to the core mechanics of the game: moving through the maze, finding the dog (🐺), and reaching the goal (🎯). The grid size is 17x17, which keeps the maze simple and manageable for beginners. To make the dog’s position intuitive but still feel like part of the maze, I placed it near the center of the grid. The dog’s position is stored in the dogTile object. Now, the checkPlayerOnDog function is responsible for detecting when the player reaches the dog tile. If the player’s position matches the dogTile position, the function triggers an alert to notify the player. This mechanic ties into the Aztec myth, where dogs helped souls cross rivers. To visually represent this, the background image for Level 1 is warm and earthy, symbolizing the start of the journey.

### Level 2: The Obstacle Path
For this level, I wanted to introduce the idea of avoiding obstacles. This level introduces moving obstacles in the form of "angry hills" that can crush the player if they collide. The grid size remains 17x17, but this time the focus shifts to timing and strategy. The hills are implemented as an array of objects, each with a row and col property to track their position. These hills move automatically at regular intervals using a setInterval function. If a collision is detected by the player, they are sent back to the start point of the game. To pass, the player must reach the end goal without being hit.


### Level 3: Final Challenge
The final level adds randomized obstacles in the form of obsidian shards, which appear and disappear unpredictably. These shards are harder to avoid because they don’t follow a fixed path. I implemented them by using Math.random() to generate random positions for the shards at regular intervals. Similar to level 2, a condition to check the collisions (with shards this time) is implemented. If a colllision between the player and the shards occurs, the player is sent back to re-starting.



## Login and Progress Tracking

I implemented a simple login and signup system using localStorage. Each user has a unique username and password, and their progress is saved under their account. When they log back in, the game loads the level they left off on. This was one of the harder parts to debug because I kept running into issues where progress wasn’t saving correctly or users couldn’t log in after signing up. Eventually, I figured out how to store and retrieve user data in JSON format, which fixed most of the problems.

Here’s how it works:
1. When a new user signs up, their information is stored in localStorage along with their progress, which starts at Level 1.
2. When a user logs in, the game checks their username and password against the stored data.
3. If they log in successfully, the game loads their saved level.

This was a cool learning experience because I got to see how basic state management works in a browser. I also learned about some limitations of localStorage, like how it’s not secure for storing passwords (but it works fine for a small game like this). I do believe that there might still be some bugging issues with this feature, but I have tried my best to solve most of them!


## Challenges and Reflections


Overall, I’m really proud of how this project turned out. It’s not perfect, and there are definitely areas where I could improve (like adding more levels or polishing the UI), but I feel like I learned so much about JavaScript, canvas rendering, and game design. Seeing everything come together, especially the maze generation and dynamic levels, was super rewarding! (As for last note, the sourcing file has the inspiration for css.style features that helped me create a better design. Also, link to my understanding of generating mazes).

Thank you for checking this project,
Allen
