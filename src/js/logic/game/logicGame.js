export const player = {
    position: { x: 50, y: 50 },
    velocity: 7,
    life: 400,
    maxLife: 400,
    range: 50,
    rangeBullet: 100,
    damage: 1, // Añadir daño del jugador
};



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
