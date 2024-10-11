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

setInterval(gameLoop, 50);
setInterval(generarEnemigo, 5000);

function gameLoop() {
    enemigos.forEach((enemigo, index) => {
        let posEnemigo = enemigo.status();
        let posRunner = runner.status();

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

            enemigos.splice(index, 1);
            enemigo.enemigo.remove();
        } */
    });
}

function generarEnemigo() {
    let enemigo = new Enemigo();
    enemigos.push(enemigo);
    document.getElementById("contenedor").appendChild(enemigo.enemigo);
}
