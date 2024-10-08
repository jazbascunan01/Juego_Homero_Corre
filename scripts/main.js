"use strict";

let runner = new Runner();
runner.quieto(); // Iniciar en estado quieto

document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') { // Detectar la flecha derecha
        runner.correr(); // Hacer correr al personaje cuando se presiona la flecha
    }

    if (event.key === ' ' || event.key==='ArrowUp') { // Si se presiona espacio, saltar
        runner.saltar();
    }
});

document.addEventListener('keyup', (event) => {
    if (event.key === 'ArrowRight') { // Si se deja de presionar la flecha derecha
        runner.quieto(); // Cambiar al estado de quieto
    }
});

let enemigos = [];

let vidas = 3;

/* cada 50 milisegundos verifica estado del juego */
setInterval(gameLoop, 50);

/* cada 1 segundo genera un enemigo */
setInterval(generarEnemigo, 1000);

/**
 * Chequear estado del runner y de los enemigos
 */
function gameLoop() {
    // Si el personaje choca con un enemigo pierde una vida
}

function generarEnemigo() {
    let enemigo = new Enemigo();
    enemigos.push(enemigo);
    document.getElementById("contenedor").appendChild(enemigo.enemigo);
}
