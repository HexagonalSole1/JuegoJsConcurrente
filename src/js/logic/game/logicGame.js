export const player = {
    position: { x: 50, y: 50 },
    velocity: 7,
    life: 400,
    maxLife: 400,
    range: 50,
    rangeBullet: 200,
    damage: 1, // Añadir daño del jugador
};

export function shootProjectile(targetX, targetY, player, projectiles) {
    const dx = targetX - (player.position.x + 10);
    const dy = targetY - (player.position.y + 10);
    const distance = Math.hypot(dx, dy);

    // Asegurarse de que la distancia no sea cero para evitar división por cero
    if (distance > 0) {
        const speed = 5;
        const velocityX = (dx / distance) * speed;
        const velocityY = (dy / distance) * speed;

        const projectile = {
            x: player.position.x + 10,
            y: player.position.y + 10,
            velocityX: velocityX,
            velocityY: velocityY,
            size: 5,
            traveledDistance: 0,
            maxDistance: player.rangeBullet,
        };

        projectiles.push(projectile);
    }
}

export function updateProjectiles(ctx, projectiles, enemies, player) {
    for (let index = projectiles.length - 1; index >= 0; index--) {
        const projectile = projectiles[index];

        // Mover proyectil
        projectile.x += projectile.velocityX;
        projectile.y += projectile.velocityY;

        // Dibujar el proyectil
        ctx.fillStyle = 'blue'; // Color del proyectil
        ctx.beginPath();
        ctx.arc(projectile.x, projectile.y, projectile.size, 0, Math.PI * 2);
        ctx.fill();

        // Verificar colisión con cada enemigo
        for (let enemyIndex = 0; enemyIndex < enemies.length; enemyIndex++) {
            const enemy = enemies[enemyIndex];
            if (enemy.life > 0) {
                // Aumentar el tamaño del área de colisión
                const collisionBuffer = 5; 
                const distanceToEnemy = Math.hypot(enemy.position.x - projectile.x, enemy.position.y - projectile.y);
                
                if (distanceToEnemy < (enemy.size / 2) + collisionBuffer) {
                    enemy.life -= player.damage;  // Reducir la vida del enemigo
                    console.log(`Vida del enemigo ${enemyIndex} reducida. Vida restante: ${enemy.life}`);
                    projectiles.splice(index, 1);  // Eliminar proyectil tras impacto

                    if (enemy.life <= 0) {
                        console.log('¡Enemigo derrotado!');
                    }
                    break; // Salir del bucle al colisionar
                }
            }
        }

        // Eliminar el proyectil si sale de los límites del canvas
        if (projectile.x < 0 || projectile.x > ctx.canvas.width || 
            projectile.y < 0 || projectile.y > ctx.canvas.height) {
            projectiles.splice(index, 1);
        }
    }
}

export function takeDamage(amount, ctx, canvas, gameLoopId, shootProjectile, waveNumber, elapsedTime, timerWorker) {
    player.life -= amount;
    if (player.life <= 0) {
        player.life = 0; 
        gameOver(ctx, canvas, gameLoopId, shootProjectile, waveNumber, elapsedTime, timerWorker);
    }
}

export function drawHealthBar(ctx, player) {
    const barWidth = 100; 
    const barHeight = 10;  
    const lifePercentage = player.life / player.maxLife;  
    const currentBarWidth = barWidth * lifePercentage;    

    ctx.fillStyle = 'green';
    ctx.fillRect(10, 10, currentBarWidth, barHeight);

    ctx.strokeStyle = 'black';
    ctx.strokeRect(10, 10, barWidth, barHeight);
}

export function gameOver(ctx, canvas, gameLoopId, shootProjectile, waveNumber, elapsedTime, timerWorker) {
    // Detener el loop de juego
    cancelAnimationFrame(gameLoopId); 
    ctx.clearRect(0, 0, canvas.width, canvas.height); 

    // Detener el worker del temporizador
    timerWorker.terminate(); // Detener el worker

    ctx.fillStyle = 'black';
    ctx.font = '30px Arial';
    ctx.textAlign = 'center';
    
    // Mensaje de derrota
    ctx.fillText('¡El jugador ha sido derrotado!', canvas.width / 2, canvas.height / 2 - 30);
    
    // Mostrar la oleada y el tiempo
    ctx.font = '20px Arial';
    ctx.fillText(`Oleada: ${waveNumber - 1}`, canvas.width / 2, canvas.height / 2);
    ctx.fillText(`Tiempo: ${elapsedTime.toFixed(2)} segundos`, canvas.width / 2, canvas.height / 2 + 30);

    // Eliminar el listener de clic
    canvas.removeEventListener('click', shootProjectile);
}
