// Función para manejar el movimiento del jugador

let keysPressed = {};
document.addEventListener('keydown', (event) => {
    keysPressed[event.key] = true;
});

document.addEventListener('keyup', (event) => {
    keysPressed[event.key] = false;
});



export function handlePlayerMovement(playerWorker) {
    let direction = null;

    if (keysPressed['ArrowUp'] || keysPressed['w'] ) direction = 'ArrowUp';
    if (keysPressed['ArrowDown'] || keysPressed['s']) direction = 'ArrowDown';
    if (keysPressed['ArrowLeft'] || keysPressed['a']) direction = 'ArrowLeft';
    if (keysPressed['ArrowRight']|| keysPressed['d']) direction = 'ArrowRight';

    if (direction) {
        playerWorker.postMessage({ action: 'move', direction });
    } else {
        playerWorker.postMessage({ action: 'stop' });
    }
}