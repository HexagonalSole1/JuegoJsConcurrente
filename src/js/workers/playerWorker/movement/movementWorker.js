importScripts('/src/js/logic/player/movement.js');

onmessage = function (e) {
    const { action, direction } = e.data;

    console.log(direction)

    if (action === 'move') {
        Movement.move(direction);
    } else if (action === 'stop') {
        Movement.stop(direction);
    }

    Movement.updatePosition();
    postMessage(Movement.playerPosition);  // Devolver la nueva posición
};
