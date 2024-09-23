import { takeDamage, player, drawHealthBar, gameOver } from "./logic/game/logicGame.js";
import { handlePlayerMovement } from "./logic/player/movementWithKeys.js";
import { shootProjectile, updateProjectiles } from "./logic/game/logicBullet.js";
import { createLifeOrb, updateLifeOrbs, checkLifeOrbCollection } from "./logic/game/logicBallsHealth.js";
import { startNextWave, createWave } from "./logic/game/logicWaves.js";

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const playerWorker = new Worker('/src/js/workers/playerWorker/movement/movementWorker.js');
const enemyWorker = new Worker('/src/js/workers/enemieWorker/movement/enemyMovementWorker.js');
const timerWorker = new Worker('/src/js/workers/utils/timerWorker.js');

let elapsedTime = 0;
let projectiles = [];
let lastTimestamp = 0;
const FPS = 120;
const frameDuration = 1000 / FPS;

let waveNumber = 1;
let enemies = [];
let waveInProgress = false;
let lifeOrbs = [];

// Cargar imágenes
const playerImage = new Image();
playerImage.src = '/src/imgs/prota.png';

const enemyImage = new Image();
enemyImage.src = '/src/imgs/enemy1.png';

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dibujar al jugador
    ctx.drawImage(playerImage, player.position.x, player.position.y, 50, 50);

    // Dibujar enemigos
    enemies.forEach((enemy) => {
        if (enemy.life > 0) {
            ctx.drawImage(enemyImage, enemy.position.x, enemy.position.y, enemy.size, enemy.size);
        }
    });

    // Mostrar información en pantalla
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText(`Oleadas: ${waveNumber - 1}`, canvas.width - 120, 60);
    ctx.fillText(`Tiempo: ${elapsedTime.toFixed(2)}s`, canvas.width - 120, 30);

    drawHealthBar(ctx, player);
    updateProjectiles(ctx, projectiles, enemies,player);
    lifeOrbs = updateLifeOrbs(ctx, lifeOrbs);
    checkLifeOrbCollection(lifeOrbs, player);

    if (enemies.length > 0 && enemies.every(enemy => enemy.life <= 0)) {
        if (!waveInProgress) {
            iniciarOleada();
        }
    }
}

canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const targetX = event.clientX - rect.left;
    const targetY = event.clientY - rect.top;

    shootProjectile(targetX, targetY, player, projectiles);
});

playerWorker.onmessage = (e) => {
    player.position = e.data;
};

enemyWorker.onmessage = (e) => {
    const enemyIndex = e.data.index;
    if (enemyIndex >= 0 && enemyIndex < enemies.length) {
        enemies[enemyIndex].position = e.data.position;

        if (enemies[enemyIndex].life <= 0 && !enemies[enemyIndex].lifeOrbCreated) {
            const orbType = Math.random() < 0.5 ? 'LIFE' : Math.random() < 0.5 ? 'SPEED' : 'RANGE'; // Elegir tipo aleatorio
            createLifeOrb(enemies[enemyIndex].position.x, enemies[enemyIndex].position.y, orbType, lifeOrbs);
            enemies[enemyIndex].lifeOrbCreated = true;
        }
    }
};

timerWorker.onmessage = (e) => {
    elapsedTime = e.data;
};

let gameLoopId;

function gameLoop(timestamp) {
    const deltaTime = timestamp - lastTimestamp;

    if (deltaTime >= frameDuration) {
        lastTimestamp = timestamp;

        handlePlayerMovement(playerWorker);
        // Suponiendo que `enemies` es un array de objetos enemigo
        enemies.forEach((enemy, index) => {
            if (enemy.life > 0) {
                enemyWorker.postMessage({
                    playerPosition: player.position,
                    enemy: { position: enemy.position, speed: enemy.speed },
                    index: index
                });
            }
        });

        drawGame();

        enemies.forEach(enemy => {
            if (enemy.life > 0) {
                const distance = Math.hypot(enemy.position.x - player.position.x, enemy.position.y - player.position.y);
                if (distance < player.range - 20) {
                    takeDamage(1, ctx, canvas, gameLoopId, shootProjectile, waveNumber, elapsedTime, timerWorker);
                }
            }
        });
    }

    gameLoopId = requestAnimationFrame(gameLoop);
}

function iniciarOleada() {
    if (waveInProgress) return;

    waveInProgress = true;
    console.log(`¡Oleada ${waveNumber} comenzando en 1 segundos!`);

    setTimeout(() => {
        enemies = createWave(waveNumber, canvas);
        waveNumber++;
        waveInProgress = false;
    }, 1000);
}

// Iniciar el juego cuando las imágenes se hayan cargado
let imagesLoaded = 0;
const totalImages = 2; // Cambia esto si añades más imágenes

const checkImagesLoaded = () => {
    imagesLoaded++;
    if (imagesLoaded === totalImages) {
        iniciarOleada();
        requestAnimationFrame(gameLoop);
    }
};

playerImage.onload = checkImagesLoaded;
enemyImage.onload = checkImagesLoaded;
