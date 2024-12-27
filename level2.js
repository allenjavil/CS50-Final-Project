// start of level 2 - connected by main.js doc
export function startLevel2(ctx, player, updateGameTitle, moveToNextLevel) {
    const gridSize = 17;
    const cellSize = ctx.canvas.width / gridSize;
    const mazeImage = new Image();
    mazeImage.src = "images/maze2-background.jpg";

    let grid = [];
    const startTile = { row: 0, col: 0 };
    const endTile = { row: gridSize - 1, col: gridSize - 1 };
// implementation of enemies and their movements in the maze canvas
    const enemies = [
        { row: Math.floor(gridSize / 2), col: 0, directionRow: 0, directionCol: 1 },
        { row: 0, col: Math.floor(gridSize / 2), directionRow: 1, directionCol: 0 },
        { row: gridSize - 1, col: Math.floor(gridSize / 3), directionRow: -1, directionCol: 0 },
        { row: Math.floor(gridSize / 3), col: gridSize - 1, directionRow: 0, directionCol: -1 },
    ];

    let enemyInterval;
// grid - maze generation (very similar to level1)
    function createGrid() {
        for (let row = 0; row < gridSize; row++) {
            grid[row] = [];
            for (let col = 0; col < gridSize; col++) {
                grid[row][col] = {
                    visited: false,
                    walls: [true, true, true, true],
                };
            }
        }
    }

    function generateMaze() {
        createGrid();
        player.row = startTile.row;
        player.col = startTile.col;

        grid[player.row][player.col].visited = true;

        const walls = [];
        addWalls(player.row, player.col, walls);

        while (walls.length > 0) {
            const randomIndex = Math.floor(Math.random() * walls.length);
            const [row, col, direction] = walls.splice(randomIndex, 1)[0];
            const [dRow, dCol] = directions[direction];
            const newRow = row + dRow;
            const newCol = col + dCol;

            if (isInBounds(newRow, newCol) && !grid[newRow][newCol].visited) {
                grid[row][col].walls[direction] = false;
                grid[newRow][newCol].walls[(direction + 2) % 4] = false;
                grid[newRow][newCol].visited = true;
                addWalls(newRow, newCol, walls);
            }
        }

        redrawMazeElements();
    }

    function addWalls(row, col, walls) {
        directions.forEach(([dRow, dCol, dir]) => {
            const newRow = row + dRow;
            const newCol = col + dCol;
            if (isInBounds(newRow, newCol) && !grid[newRow][newCol].visited) {
                walls.push([row, col, dir]);
            }
        });
    }

    function isInBounds(row, col) {
        return row >= 0 && row < gridSize && col >= 0 && col < gridSize;
    }

    const directions = [
        [-1, 0, 0],
        [0, 1, 1],
        [1, 0, 2],
        [0, -1, 3],
    ];
// ensuring that the background works in maze2 canvas
    function redrawMazeElements() {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        if (mazeImage.complete) {
            ctx.drawImage(mazeImage, 0, 0, ctx.canvas.width, ctx.canvas.height);
        } else {
            mazeImage.onload = () => {
                ctx.drawImage(mazeImage, 0, 0, ctx.canvas.width, ctx.canvas.height);
                redrawMazeElements();
            };
            return;
        }

        grid.forEach((row, r) => {
            row.forEach((cell, c) => {
                const x = c * cellSize;
                const y = r * cellSize;

                if (cell.walls[0]) drawWall(x, y, x + cellSize, y);
                if (cell.walls[1]) drawWall(x + cellSize, y, x + cellSize, y + cellSize);
                if (cell.walls[2]) drawWall(x, y + cellSize, x + cellSize, y + cellSize);
                if (cell.walls[3]) drawWall(x, y, x, y + cellSize);
            });
        });
// te enemies are in the maze and following their assigned movement
        enemies.forEach((enemy) => {
            drawBlurredEmoji("⛰️", enemy.row, enemy.col);
        });
// other emojis obtain their roles
        drawBlurredEmoji("🚩", startTile.row, startTile.col);
        drawBlurredEmoji("🎯", endTile.row, endTile.col);
        drawBlurredEmoji("🧔🏽‍♀️", player.row, player.col);
    }

    function drawWall(x1, y1, x2, y2) {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }
// for visibility/aesthetic purpsoes
    function drawBlurredEmoji(emoji, row, col) {
        ctx.save();
        ctx.shadowColor = "blue";
        ctx.shadowBlur = 15;
        ctx.font = `${cellSize * 0.8}px Arial`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(
            emoji,
            col * cellSize + cellSize / 2,
            row * cellSize + cellSize / 2
        );
        ctx.restore();
    }
// movements of the enemies
    function moveEnemies() {
        enemies.forEach((enemy) => {
            enemy.row += enemy.directionRow;
            enemy.col += enemy.directionCol;

            if (enemy.row < 0 || enemy.row >= gridSize) {
                enemy.directionRow *= -1;
            }
            if (enemy.col < 0 || enemy.col >= gridSize) {
                enemy.directionCol *= -1;
            }
        });
    }
// if player collides with an enemy, they must return back to the start and redo the level until they aren't catched
    function checkPlayerState() {
        for (const enemy of enemies) {
            if (player.row === enemy.row && player.col === enemy.col) {
                alert("You were crushed by the mountains! Returning to the start.");
                player.row = startTile.row;
                player.col = startTile.col;
                redrawMazeElements();
                return;
            }
        }
// if they manage to avoid collision, and reach the goal, they go to the next level.
        if (player.row === endTile.row && player.col === endTile.col) {
            clearInterval(enemyInterval);
            cleanup(); // Clear resources
            moveToNextLevel(true);
        }
    }
// cleaning up canvas to avoid weird dynamics
    function cleanup() {
        clearInterval(enemyInterval);
        document.removeEventListener("keydown", handleKeydown);
    }

    function handleKeydown() {
        checkPlayerState();
    }

    enemyInterval = setInterval(() => {
        moveEnemies();
        redrawMazeElements();
    }, 500);

    document.addEventListener("keydown", handleKeydown);

    mazeImage.onload = generateMaze;

    return { grid, redrawMazeElements, cleanup };
}
