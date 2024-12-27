// level 3 connected to the main.js
export function startLevel3(ctx, player, updateGameTitle, moveToNextLevel) {
    const gridSize = 17;
    const cellSize = ctx.canvas.width / gridSize;
    const mazeImage = new Image();
    mazeImage.src = "images/maze3-background.jpg";

    let grid = [];
    const startTile = { row: 0, col: 0 };
    const endTile = { row: gridSize - 1, col: gridSize - 1 };

    // Ddfine multiple shards (enemies) with movement but a little more randomized tghan in level2
    const shards = Array.from({ length: 10 }, () => ({
        row: Math.floor(Math.random() * gridSize),
        col: Math.floor(Math.random() * gridSize),
        directionRow: Math.random() > 0.5 ? 1 : -1, // Random direction (up/down)
        directionCol: Math.random() > 0.5 ? 1 : -1, // Random direction (left/right)
    }));

    let shardInterval; // Store the interval ID

    // create the grid
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

    // generate the maze using randomized Prim's algorithm
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

        redrawMazeElements(); // draw the maze after generating it
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
        [-1, 0, 0], // up
        [0, 1, 1],  // right
        [1, 0, 2],  // down
        [0, -1, 3], // left
    ];

    // Redraw the maze, walls, and characters
    function redrawMazeElements() {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        // Draw the background
        if (mazeImage.complete) {
            ctx.drawImage(mazeImage, 0, 0, ctx.canvas.width, ctx.canvas.height);
        } else {
            mazeImage.onload = () => {
                ctx.drawImage(mazeImage, 0, 0, ctx.canvas.width, ctx.canvas.height);
                redrawMazeElements();
            };
            return;
        }

        // draing walls for each cell
        grid.forEach((row, r) => {
            row.forEach((cell, c) => {
                const x = c * cellSize;
                const y = r * cellSize;
                ctx.strokeStyle = "white"; // Wall color set to white because background is too dark
                ctx.lineWidth = 3.5;

                if (cell.walls[0]) drawWall(x, y, x + cellSize, y);
                if (cell.walls[1]) drawWall(x + cellSize, y, x + cellSize, y + cellSize);
                if (cell.walls[2]) drawWall(x, y + cellSize, x + cellSize, y + cellSize);
                if (cell.walls[3]) drawWall(x, y, x, y + cellSize);
            });
        });

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

        // draw the shards (enemies) with blue blur effect for easier visualization purposes
        shards.forEach((shard) => {
            drawBlurredEmoji("🖤", shard.row, shard.col);
        });


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
// shard movement function
    function moveShards() {
        shards.forEach((shard) => {
            shard.row += shard.directionRow;
            shard.col += shard.directionCol;

            // Reverse direction if the shard reaches bounds
            if (shard.row < 0 || shard.row >= gridSize) {
                shard.directionRow *= -1;
            }
            if (shard.col < 0 || shard.col >= gridSize) {
                shard.directionCol *= -1;
            }
        });
    }

    function checkPlayerState() {
        // Check if the player touches any shard
        for (const shard of shards) {
            if (player.row === shard.row && player.col === shard.col) {
                alert("You were struck by a shard! Returning to the start.");
                player.row = startTile.row;
                player.col = startTile.col;
                redrawMazeElements();
                return;
            }
        }

        // Check if the player reaches the end goal
        if (player.row === endTile.row && player.col === endTile.col) {
            alert("Congratulations! You have completed all levels!");
            clearInterval(shardInterval); // Stop the shard movement
            document.removeEventListener("keydown", checkPlayerState);
            endGame(true); // Call endGame after finishing Level 3
        }
    }

    // Start shard movement
    shardInterval = setInterval(() => {
        moveShards();
        checkPlayerState(); // ensure collision is checked at every interval
        redrawMazeElements();
    }, 500); // adjust speed of shard movement

    document.addEventListener("keydown", () => {
        checkPlayerState();
    });

    mazeImage.onload = generateMaze;

    return { grid, redrawMazeElements };
}
