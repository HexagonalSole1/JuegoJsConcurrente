// Crear una bolita de vida
export function createLifeOrb(x, y, lifeOrbs) {
    const lifeOrb = {
        position: { x, y },
        size: 10,
        lifeValue: 20,
        active: true, // Para controlar si la bolita de vida está activa
    };
    lifeOrbs.push(lifeOrb);
}

export function updateLifeOrbs(ctx, lifeOrbs) {
    // Filtrar las bolitas de vida activas y dibujarlas
    lifeOrbs.forEach((orb) => {
        if (orb.active) {
            ctx.fillStyle = 'purple'; 
            ctx.beginPath();
            ctx.arc(orb.position.x, orb.position.y, orb.size, 0, Math.PI * 2);
            ctx.fill();
        }
    });

    // Filtrar las bolitas de vida inactivas y devolver el nuevo arreglo
    return lifeOrbs.filter(orb => orb.active);
}

export function checkLifeOrbCollection(lifeOrbs, player) {
    lifeOrbs.forEach((orb) => {
        const distance = Math.hypot(orb.position.x - player.position.x, orb.position.y - player.position.y);
        if (distance < player.range) {
            player.life += orb.lifeValue; 
            orb.active = false; // Desactivar la bolita de vida al ser recogida
        }
    });
}
