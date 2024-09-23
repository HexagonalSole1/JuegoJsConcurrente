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
            maxDistance: player.rangeBullet, // Asegúrate de que esta propiedad exista en player
        };

        projectiles.push(projectile);
    }
}

export function updateProjectiles(ctx, projectiles, enemies) {
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
                    enemy.life -= 1;  // Reducir la vida del enemigo
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
