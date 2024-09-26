    // Tipos de bolitas y sus efectos
    const orbTypes = {
        LIFE: { size: 10, lifeValue: 20, color: 'purple', effect: (player) => { player.life = Math.min(player.maxLife, player.life + 20); } },
        SPEED: { size: 10, lifeValue: 0, color: 'green', effect: (player) => { player.velocity += 10; } },
        RANGE: { size: 10, lifeValue: 0, color: 'blue', effect: (player) => { player.range += 20; } },
        DAMAGE: { size: 10, lifeValue: 0, color: 'red', effect: (player) => { player.damage += 1; } }, // Nueva bolita de daño
    };

    // Crear una bolita de vida
    export function createLifeOrb(x, y, orbType, lifeOrbs) {
        const lifeOrb = {
            position: { x, y },
            size: orbTypes[orbType].size,
            lifeValue: orbTypes[orbType].lifeValue,
            color: orbTypes[orbType].color,
            effect: orbTypes[orbType].effect,
            active: true,
        };
        lifeOrbs.push(lifeOrb);
    }

    export function updateLifeOrbs(ctx, lifeOrbs) {
        // Filtrar las bolitas de vida activas y dibujarlas
        lifeOrbs.forEach((orb) => {
            if (orb.active) {
                ctx.fillStyle = orb.color; 
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
                if (orb.lifeValue > 0) {
                    player.life = Math.min(player.maxLife, player.life + orb.lifeValue); 
                } else {
                    orb.effect(player); // Aplicar el efecto de la bolita
                }
                orb.active = false; // Desactivar la bolita de vida al ser recogida
            }
        });
    }
