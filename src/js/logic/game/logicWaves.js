export function startNextWave(waveNumber, waveInProgress, enemies, canvas, createWave) {
    if (waveInProgress) return { waveInProgress, enemies, waveNumber }; // Devuelve los valores sin cambios si la oleada está en progreso
    waveInProgress = true;
    console.log(`¡Oleada ${waveNumber} comenzando en 1 segundos!`);

    setTimeout(() => {
        enemies = createWave(waveNumber, canvas);
        waveNumber++; // Incrementar el número de oleada
        waveInProgress = false; // Terminar el progreso de la oleada

        // Devuelve los valores actualizados
        return { waveInProgress, enemies, waveNumber };
    }, 1000);
}


export function createWave(waveNumber, canvas) {
    const numberOfEnemies = waveNumber + 3;
    const enemiesInWave = [];

    for (let i = 0; i < numberOfEnemies; i++) {
        const enemy = {
            position: { x: Math.random() * canvas.width, y: Math.random() * (canvas.height / 2) },
            life: 3 + waveNumber,
            speed: 2 + waveNumber * .7, // Incrementar velocidad con cada oleada
            size: 50,
            lifeOrbCreated: false 
        };
        enemiesInWave.push(enemy);
    }

    return enemiesInWave;
}
