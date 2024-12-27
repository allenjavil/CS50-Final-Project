// defining user, starting level, basics for maze elements
let userName;
let currentLevel = 1;
let users = JSON.parse(localStorage.getItem("users")) || {}; // retrieve users
let currentUser = null;

// setting up the canvas for drawing the maze and initializing game elements
const canvas = document.getElementById("maze-canvas");
const ctx = canvas.getContext("2d");
const player = { row: 0, col: 0 };
let grid; // Shared grid for the current level
let redrawMazeElements;
let dogTile;
let hasCollectedDog = false; // flag to track dog collection (specific to level1)
let hasShownCompletionMessage = false;

// development of signup form for users
function showSignup() {
    document.getElementById("signup-form").style.display = "block";
    document.getElementById("login-form").style.display = "none";
    document.getElementById("message").textContent = "";
}

// login form for users
function showLogin() {
    document.getElementById("signup-form").style.display = "none";
    document.getElementById("login-form").style.display = "block";
    document.getElementById("message").textContent = "";
}

// condition measures for forms
document.getElementById("signup-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const username = document.getElementById("signup-username").value.trim();
    const password = document.getElementById("signup-password").value;

    if (users[username]) {
        alert("Username already exists. Please log in.");
        return;
    }

    // start progress at Level 1 for new users
    users[username] = { password, progress: 1 };
    localStorage.setItem("users", JSON.stringify(users)); // Store users in localStorage
    alert("Signup successful! Please log in.");
    showLogin();
});

// Login handler that allows for functionality of feature
document.getElementById("login-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const username = document.getElementById("login-username").value.trim();
    const password = document.getElementById("login-password").value;
// validation of credentials. If info is correct, start the game.
    if (!users[username] || users[username].password !== password) {
        alert("Invalid username or password.");
        return;
    }
    currentUser = username;
    currentLevel = users[username].progress || 1;
    startGame();
});

// Update the game title
function updateGameTitle() {
    const gameTitle = document.getElementById("game-title");
    gameTitle.textContent = `Welcome, ${userName}! You are in Level ${currentLevel}`;
}

// Start the game
function startGame() {
    document.getElementById("login-section").style.display = "none";
    document.getElementById("game-section").style.display = "block";
    userName = currentUser;
    updateGameTitle();

    loadLevel(currentLevel); // start the level based on user's progress
}

// Load the appropriate level based on "currentLevel"
function loadLevel(levelNumber) {
    transitioningToNextLevel = false;
    // console commands to see when a level is failing to prompt in inspect
    // redirecting to each all the available levels
    switch (levelNumber) {
        case 1:
            import("./level1.js")
                .then(({ startLevel1 }) => {
                    const level = startLevel1(ctx, player, updateGameTitle, moveToNextLevel);
                    grid = level.grid;
                    redrawMazeElements = level.redrawMazeElements;
                    dogTile = level.dogTile;
                    hasCollectedDog = false; // Reset dog collection for the level (specific to level1)
                })
                .catch((err) => {
                    console.error("Error loading Level 1:", err);
                });
            break;
        case 2:
            import("./level2.js")
                .then(({ startLevel2 }) => {
                    const level = startLevel2(ctx, player, updateGameTitle, moveToNextLevel);
                    grid = level.grid; // Assign grid
                    redrawMazeElements = level.redrawMazeElements; // Assign redraw function
                })
                .catch((err) => {
                    console.error("Error loading Level 2:", err);
                });
            break;
        case 3:
            import("./level3.js")
                .then(({ startLevel3 }) => {
                    const level = startLevel3(ctx, player, updateGameTitle, moveToNextLevel);
                    grid = level.grid; // Assign grid
                    redrawMazeElements = level.redrawMazeElements; // Assign redraw function
                })
                .catch((err) => {
                    console.error("Error loading Level 3:", err);
                });
            break;
        default:
            console.warn("Unexpected level number reached!");
    }
}

// important to ensure good transitions across levels
let transitioningToNextLevel = false; // guards for preventing duplicate transitions
const max_level = 3;

// Move to the next level
function moveToNextLevel(levelCompletedCondition = true) {
    if (!levelCompletedCondition) {
        alert("You need to complete the required task before advancing!");
        return;
    }

    if (transitioningToNextLevel) return; // prevent multiple calls
    transitioningToNextLevel = true;

    if (currentLevel < max_level) {
        // transition to the next level
        currentLevel++;
        console.log(`Moving to Level ${currentLevel}`); // FOR DEBUGGING D;

        if (currentUser) {
            users[currentUser].progress = currentLevel; // saving user's progress
            localStorage.setItem("users", JSON.stringify(users)); // store in localStorage
        }

        alert(`Great job, ${userName}! Moving to Level ${currentLevel}`);
        updateGameTitle();
        loadLevel(currentLevel); // loading the next level

    }

    transitioningToNextLevel = false;
}
// End the game
function endGame(isLevelCompleted = false) {
    if (isLevelCompleted) {
        alert("Congratulations! You have completed all levels!");
    } else {
        alert(`Thanks for playing, ${currentUser}! Your progress has been saved.`);
    }

    // Clear intervals and listeners to stop background logic to avoid weird intersections of levels.
    clearAllIntervals();
    removeEventListeners();

    if (isLevelCompleted) {
        // only reset progress if all levels are completed
        if (currentUser) {
            users[currentUser].progress = 1; // reset progress to Level 1
            localStorage.setItem("users", JSON.stringify(users)); // Save reset progress
        }
    }

    // always reset the current user and go back to homepage
    currentUser = null;
    currentLevel = 1;

    // hide the game section and show the main menu
    document.getElementById("game-section").style.display = "none";
    document.getElementById("login-section").style.display = "block";
}
function clearAllIntervals() {
    const highestIntervalId = setTimeout(() => { /* no-op */ }, 0);
    for (let i = 0; i <= highestIntervalId; i++) {
        clearInterval(i);
        clearTimeout(i);
    }
}
let levelSpecificCheckPlayerState;
function removeEventListeners() {
    if (levelSpecificCheckPlayerState) {
        document.removeEventListener("keydown", levelSpecificCheckPlayerState);
    }
}
// Player movement logic
function movePlayer(dRow, dCol) {
    if (!grid || !redrawMazeElements) {
        console.error("Grid or redraw function not initialized.");
        return;
    }

    const newRow = player.row + dRow;
    const newCol = player.col + dCol;

    // Check bounds and wall collisions
    if (newRow < 0 || newRow >= grid.length || newCol < 0 || newCol >= grid[0]?.length) {
        console.warn("Invalid move: Out of bounds.");
        return;
    }
    const currentCell = grid[player.row][player.col];
    const direction = getWallDirection(dRow, dCol);
    if (direction === -1 || currentCell.walls[direction]) {
        console.warn("Invalid move: Wall blocks the path.");
        return;
    }

    // update player position
    player.row = newRow;
    player.col = newCol;

    // Redraw the maze and player that will be in the level
    redrawMazeElements();
    console.log(`Player moved to: (${player.row}, ${player.col})`);

    // Check if player reached the dog (for level1)
    checkPlayerOnDog();
}

function getWallDirection(dRow, dCol) {
    // right/up/down/left directions
    const directions = [
        [-1, 0, 0],
        [0, 1, 1],
        [1, 0, 2],
        [0, -1, 3],
    ];
    for (let i = 0; i < directions.length; i++) {
        if (directions[i][0] === dRow && directions[i][1] === dCol) {
            return directions[i][2]; // Return the direction index
        }
    }
    return -1; // Invalid direction
}

// feature ensuring the collectible (dog) and obtaining it to pass onto level2
function checkPlayerOnDog() {
    if (!player || !dogTile) return;
    if (player.row === dogTile.row && player.col === dogTile.col) {
        if (!hasCollectedDog) {
            hasCollectedDog = true;
            alert("You found the dog! 🐺");
        }
    }
}

// player movement with arrows
document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp") {
        event.preventDefault();
        movePlayer(-1, 0);
    } else if (event.key === "ArrowRight") {
        event.preventDefault();
        movePlayer(0, 1);
    } else if (event.key === "ArrowDown") {
        event.preventDefault();
        movePlayer(1, 0);
    } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        movePlayer(0, -1);
    }
});
