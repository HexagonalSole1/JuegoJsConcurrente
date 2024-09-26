const enemyPositions = {};
const minDistance = 30; // Distancia mínima para evitar el solapamiento

function moveEnemy(playerPosition, enemyIndex, speed) {
    const enemyPosition = enemyPositions[enemyIndex];
    const directionX = playerPosition.x - enemyPosition.x;
    const directionY = playerPosition.y - enemyPosition.y;

    const distanceToPlayer = Math.hypot(directionX, directionY);

    if (distanceToPlayer > 0) {
        // Normalizar la dirección hacia el jugador
        const normalizedX = (directionX / distanceToPlayer);
        const normalizedY = (directionY / distanceToPlayer);

        // Probar el nuevo movimiento
        const newPosition = {
            x: enemyPosition.x + normalizedX * speed,
            y: enemyPosition.y + normalizedY * speed,
        };

        let canMove = true;
        for (const otherIndex in enemyPositions) {
            if (otherIndex != enemyIndex) {
                const otherPosition = enemyPositions[otherIndex];
                const distanceToOther = Math.hypot(newPosition.x - otherPosition.x, newPosition.y - otherPosition.y);
                if (distanceToOther < minDistance) {
                    canMove = false;
                    break; // No se puede mover, salir del bucle
                }
            }
        }

        if (canMove) {
            enemyPosition.x = newPosition.x;
            enemyPosition.y = newPosition.y;
        }
    }

    postMessage({ position: { ...enemyPosition }, index: enemyIndex });
}

onmessage = function (e) {
    const { playerPosition, enemy, index } = e.data;

    if (!enemyPositions[index]) {
        enemyPositions[index] = { ...enemy.position }; // Hacer una copia para evitar referencias directas
    }
    console.log(enemy.speed)
    // Llamar a moveEnemy pasando la velocidad del enemigo
    moveEnemy(playerPosition, index, enemy.speed);
};
