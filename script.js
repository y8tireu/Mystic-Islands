
let player = document.getElementById('player');
let creature = document.getElementById('creature');
let resource = document.getElementById('resource');
let obstacles = document.querySelectorAll('.obstacle');

let health = 100;
let energy = 100;
let resources = 0;

document.getElementById('health').textContent = health;
document.getElementById('energy').textContent = energy;
document.getElementById('resources').textContent = resources;

let movingInterval;
let energyRegenInterval;

// Player movement with WASD and arrow keys
document.addEventListener('keydown', function(event) {
    if (energy > 0) {
        let playerPosition = player.getBoundingClientRect();
        let containerPosition = document.querySelector('.game-container').getBoundingClientRect();

        if ((event.key === 'ArrowUp' || event.key === 'w') && playerPosition.top > containerPosition.top) {
            movePlayer(0, -10);
        }
        if ((event.key === 'ArrowDown' || event.key === 's') && playerPosition.bottom < containerPosition.bottom) {
            movePlayer(0, 10);
        }
        if ((event.key === 'ArrowLeft' || event.key === 'a') && playerPosition.left > containerPosition.left) {
            movePlayer(-10, 0);
        }
        if ((event.key === 'ArrowRight' || event.key === 'd') && playerPosition.right < containerPosition.right) {
            movePlayer(10, 0);
        }
        updateStats();
    }
});

// Move player function with obstacle detection
function movePlayer(dx, dy) {
    let newPosition = player.getBoundingClientRect();
    let containerPosition = document.querySelector('.game-container').getBoundingClientRect();

    player.style.top = newPosition.top + dy - containerPosition.top + 'px';
    player.style.left = newPosition.left + dx - containerPosition.left + 'px';

    if (checkObstacleCollision()) {
        // Revert move if collided with an obstacle
        player.style.top = newPosition.top - containerPosition.top + 'px';
        player.style.left = newPosition.left - containerPosition.left + 'px';
    } else {
        energy -= 1;
    }
}

// Creature AI movement toward player
function moveCreature() {
    let playerPosition = player.getBoundingClientRect();
    let creaturePosition = creature.getBoundingClientRect();

    let dx = playerPosition.left - creaturePosition.left;
    let dy = playerPosition.top - creaturePosition.top;

    creature.style.left = creaturePosition.left + Math.sign(dx) * 10 + 'px';
    creature.style.top = creaturePosition.top + Math.sign(dy) * 10 + 'px';

    checkCreatureCollision();
}

// Check collision with creature
function checkCreatureCollision() {
    if (isColliding(player, creature)) {
        health -= 5;
        updateStats();
        if (health <= 0) {
            alert("Game Over! You ran out of health.");
            resetGame();
        }
    }
}

// Check if player collides with obstacles
function checkObstacleCollision() {
    for (let obstacle of obstacles) {
        if (isColliding(player, obstacle)) {
            return true;
        }
    }
    return false;
}

// Resource collection
function collectResource() {
    if (isColliding(player, resource)) {
        resources += 1;
        energy = Math.min(energy + 20, 100);
        moveResource();
        updateStats();
    }
}

// Randomly relocate resource
function moveResource() {
    let container = document.querySelector('.game-container');
    let containerRect = container.getBoundingClientRect();

    let newTop = Math.random() * (containerRect.height - resource.offsetHeight);
    let newLeft = Math.random() * (containerRect.width - resource.offsetWidth);

    resource.style.top = newTop + 'px';
    resource.style.left = newLeft + 'px';
}

// Collision detection helper
function isColliding(el1, el2) {
    let rect1 = el1.getBoundingClientRect();
    let rect2 = el2.getBoundingClientRect();

    return !(
        rect1.top > rect2.bottom ||
        rect1.bottom < rect2.top ||
        rect1.left > rect2.right ||
        rect1.right < rect2.left
    );
}

// Update game stats
function updateStats() {
    document.getElementById('health').textContent = health;
    document.getElementById('energy').textContent = energy;
    document.getElementById('resources').textContent = resources;
}

// Reset game
function resetGame() {
    health = 100;
    energy = 100;
    resources = 0;
    player.style.top = '50%';
    player.style.left = '50%';
    moveResource();
    updateStats();
}

// Initialize creature movement and energy regeneration
function startGame() {
    movingInterval = setInterval(moveCreature, 500); // Creature movement every 0.5s
    energyRegenInterval = setInterval(() => {
        if (energy < 100) energy += 1;
        updateStats();
    }, 1000); // Regenerate energy every second
}

// Start the game
startGame();
