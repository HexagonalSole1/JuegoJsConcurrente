let elapsedTime = 0;

function startTimer() {
    setInterval(() => {
        elapsedTime++;
        postMessage(elapsedTime);  // Envía el tiempo transcurrido al hilo principal
    }, 1000);  // Incrementa cada segundo
}

startTimer();
