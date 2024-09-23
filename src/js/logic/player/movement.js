const Movement = {
    speed: 4,
    boundaries: { width: 1000, height: 600, playerSize: 20 },
    playerPosition: { x: 50, y: 200 },
    velocity: { x: 0, y: 0 },

    move(direction) {
        switch (direction) {
            case 'ArrowUp':
                this.velocity.y = -this.speed;
                break;
            case 'ArrowDown':
                this.velocity.y = this.speed;
                break;
            case 'ArrowLeft':
                this.velocity.x = -this.speed;
                break;
            case 'ArrowRight':
                this.velocity.x = this.speed;
                break;
        }
    },

    stop(direction) {
        this.velocity.x = 0;
        this.velocity.y = 0; // Detener el movimiento
    },

    updatePosition() {
        this.playerPosition.x = Math.max(0, Math.min(this.boundaries.width - this.boundaries.playerSize, this.playerPosition.x + this.velocity.x));
        this.playerPosition.y = Math.max(0, Math.min(this.boundaries.height - this.boundaries.playerSize, this.playerPosition.y + this.velocity.y));
    }
};

