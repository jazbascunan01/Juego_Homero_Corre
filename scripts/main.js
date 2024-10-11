"use strict";

let runner = new Runner();
runner.quieto();

document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') {
        runner.correr();
    }

    if (event.key === ' ' || event.key === 'ArrowUp') {
        runner.saltar();
    }
});

document.addEventListener('keyup', (event) => {
    if (event.key === 'ArrowRight') {
        runner.quieto();
    }
});

let enemigos = [];
let vidas = 3;
const maxEnemigosEnPantalla = 3;  // Máximo de enemigos en pantalla

setInterval(gameLoop, 50);
setInterval(generarEnemigo, 5000);

function gameLoop() {
    enemigos.forEach((enemigo, index) => {
        let posEnemigo = enemigo.status();
        let posRunner = runner.status();

        // Verificamos si Homero colisiona con Selma
        /* if (
            posRunner.left < posEnemigo.right &&
            posRunner.right > posEnemigo.left &&
            posRunner.top < posEnemigo.bottom &&
            posRunner.bottom > posEnemigo.top
        ) {
            vidas -= 1;
            console.log("¡Chocaste con Selma! Vidas restantes: " + vidas);

            if (vidas === 0) {
                console.log("¡Has perdido!");
            }

            // Eliminamos al enemigo tras la colisión
            enemigos.splice(index, 1);
            enemigo.enemigo.remove();
        } */

        // Si el enemigo ya salió de la pantalla, lo eliminamos
        if (posEnemigo.right < 0) {
            enemigos.splice(index, 1);
            enemigo.enemigo.remove();
        }
    });
}

function generarEnemigo() {
    // Verificamos si ya hay 3 enemigos en pantalla
    if (enemigos.length <= maxEnemigosEnPantalla) {
        let enemigo = new Enemigo();
        enemigos.push(enemigo);
        document.getElementById("contenedor").appendChild(enemigo.enemigo);
    } else {
        console.log("Esperando a que salga un enemigo para generar otro.");
    }
}
