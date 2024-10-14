"use strict";

let runner = new Runner();
runner.correr();

// Funciones para manejar los event listeners
function agregarEventosPersonaje() {
    document.addEventListener('keydown', manejarTeclas);
    document.addEventListener('keyup', manejarTeclas);
}

function quitarEventosPersonaje() {
    document.removeEventListener('keydown', manejarTeclas);
    document.removeEventListener('keyup', manejarTeclas);
}

// Función para manejar los eventos de teclado
function manejarTeclas(event) {
    if (!juegoActivo) return;  // Si el juego no está activo, ignorar los eventos

    if (event.type === 'keydown') {
        if (event.key === ' ' || event.key === 'ArrowUp') {
            runner.saltar();
        }
    }
}

// Al iniciar el juego
agregarEventosPersonaje();
let enemigos = [];
let vidas = 3;
let puntos = 0; // Añadimos puntos para el sistema futuro
const maxEnemigosEnPantalla = 3;  // Máximo de enemigos en pantalla
let juegoActivo = true; // Para saber si el juego está activo

let intervalGameLoop = setInterval(gameLoop, 50);
let intervalGenerarEnemigo = setInterval(generarEnemigo, 6000);
// Función para actualizar la barra de vidas
function actualizarBarraDeVidas() {
    const barraVidas = document.getElementById("vidas");
    switch (vidas) {
        case 3:
            barraVidas.style.backgroundImage = 'url("images/barras\ de\ estado_lleno.png")';
            break;
        case 2:
            barraVidas.style.backgroundImage = 'url("images/barras\ de\ estado_lleno-3.png")';
            break;
        case 1:
            barraVidas.style.backgroundImage = 'url("images/barras\ de\ estado_mitad-2.png")';
            break;
        case 0:
            barraVidas.style.backgroundImage = 'url("images/barras\ de\ estado_mitad-6.png")';
            break;
    }
}

// Función para detener el juego
function detenerJuego() {
    clearInterval(intervalGameLoop);
    clearInterval(intervalGenerarEnemigo);
    juegoActivo = false;

    // Mostrar cartel de "Perdiste"
    const cartelPerdiste = document.getElementById("cartel-perdiste");
    cartelPerdiste.classList.add("visible");

    // Mostrar los puntos finales (se calcularán después)
    document.getElementById("puntos-finales").textContent = `Puntos: ${puntos}`;
    quitarEventosPersonaje();
}

// Función para reiniciar el juego
function reiniciarJuego() {
    // Reiniciar variables
    vidas = 3;
    puntos = 0;  // Reiniciar puntos
    juegoActivo = true;

    // Ocultar cartel de "Perdiste"
    const cartelPerdiste = document.getElementById("cartel-perdiste");
    cartelPerdiste.classList.remove("visible");

    // Reiniciar barra de vidas
    actualizarBarraDeVidas();

    // Limpiar enemigos de pantalla
    enemigos.forEach(enemigo => enemigo.enemigo.remove());
    enemigos = [];

    // Reiniciar bucles
    intervalGameLoop = setInterval(gameLoop, 50);
    intervalGenerarEnemigo = setInterval(generarEnemigo, 5000);
    agregarEventosPersonaje();
}

// Añadimos evento al botón de reiniciar
document.getElementById("btn-reiniciar").addEventListener("click", reiniciarJuego);

function gameLoop() {
    if (!juegoActivo) return;  // Detener lógica si el juego no está activo

    enemigos.forEach((enemigo, index) => {
        let posEnemigo = enemigo.status();
        let posRunner = runner.status();

        // Ajustamos aún más el área de colisión
        let margenColisionEnemigoX = 15; // Reducimos más el área de colisión en los laterales del enemigo
        let margenColisionEnemigoY = 20; // Reducimos más el área de colisión en la parte superior e inferior del enemigo
        let margenColisionRunnerX = 10; // También ajustamos el área de colisión de Homero
        let margenColisionRunnerY = 15;

        // Verificamos si Homero colisiona con Selma, solo si no está en el aire
        if (!runner.estaSaltando &&
            posRunner.left < (posEnemigo.right - margenColisionEnemigoX) &&
            posRunner.right > (posEnemigo.left + margenColisionEnemigoX) &&
            posRunner.top < (posEnemigo.bottom - margenColisionEnemigoY) &&
            posRunner.bottom > (posEnemigo.top + margenColisionEnemigoY)
        ) {
            if (!enemigo.haChocado) {  // Si no ha chocado aún con este enemigo
                vidas -= 1;
                enemigo.haChocado = true;  // Marcamos que ha habido colisión con este enemigo
                console.log("¡Chocaste con Selma! Vidas restantes: " + vidas);
                runner.efectoPerderVida();
                // Actualizamos la barra de vidas
                actualizarBarraDeVidas();

                if (vidas === 0) {
                    console.log("¡Has perdido!");
                    detenerJuego();  // Detenemos el juego cuando las vidas llegan a 0
                }
            }
        } else {
            enemigo.haChocado = false;  // Resetear cuando ya no colisiona
        }

        // Si el enemigo ya salió de la pantalla, lo eliminamos
        if (posEnemigo.right < 0) {
            enemigos.splice(index, 1);
            enemigo.enemigo.remove();
        }
    });
}


let ultimoTiempoGeneracion = Date.now(); // Marca de tiempo de la última generación
const tiempoMinimoGeneracion = 3000;  // Aumenté el tiempo mínimo a 4 segundos
let distanciaMinima = 1000;  // Aumenté la distancia mínima entre enemigos

function generarEnemigo() {
    if (!juegoActivo) return;

    if (enemigos.length < maxEnemigosEnPantalla) {
        let tiempoActual = Date.now();

        // Verificar si ha pasado suficiente tiempo desde la última generación
        if (tiempoActual - ultimoTiempoGeneracion > tiempoMinimoGeneracion) {
            let ultimoEnemigo = enemigos[enemigos.length - 1];

            // Si hay enemigos, comprobar la distancia al último generado
            if (ultimoEnemigo) {
                let posUltimoEnemigo = ultimoEnemigo.status();

                // Verificar si el último enemigo está lo suficientemente lejos
                if (posUltimoEnemigo.right < window.innerWidth - distanciaMinima) {
                    crearNuevoEnemigo();
                    ultimoTiempoGeneracion = tiempoActual;  // Actualizar el tiempo de la última generación
                } else {
                    console.log("El último enemigo está demasiado cerca, esperando...");
                }
            } else {
                // Si no hay enemigos en pantalla, generar uno de inmediato
                crearNuevoEnemigo();
                ultimoTiempoGeneracion = tiempoActual;  // Actualizar el tiempo de la última generación
            }
        } else {
            console.log("Esperando para generar otro enemigo...");
        }
    }
}

function crearNuevoEnemigo() {
    let ultimoEnemigo = enemigos[enemigos.length - 1];

    // Verificar si el último enemigo está lo suficientemente lejos antes de crear uno nuevo
    if (ultimoEnemigo) {
        let posUltimoEnemigo = ultimoEnemigo.status();
        if (posUltimoEnemigo.right > window.innerWidth - distanciaMinima) {
            console.log("El último enemigo está demasiado cerca. No se generará otro.");
            return;  // No generar enemigo si están demasiado cerca
        }
    }

    // Seleccionar aleatoriamente el tipo de enemigo
    const tipoEnemigo = Math.random() < 0.5 ? 'selma' : 'abuelo';

    // Crear el nuevo enemigo si la distancia es suficiente
    let enemigo = new Enemigo(tipoEnemigo);
    enemigo.haChocado = false;
    enemigos.push(enemigo);
    document.getElementById("contenedor").appendChild(enemigo.enemigo);
}


function detenerJuego() {
    clearInterval(intervalGameLoop);  // Detener el loop del juego
    clearInterval(intervalGenerarEnemigo);  // Detener la generación de enemigos
    juegoActivo = false;

    // Mostrar cartel de "Perdiste"
    const cartelPerdiste = document.getElementById("cartel-perdiste");
    cartelPerdiste.classList.add("visible");

    // Pausar todas las animaciones del contenedor y los personajes
    const contenedor = document.getElementById("container");
    contenedor.classList.add("pausado");
    const personaje = document.getElementById("personaje");
    personaje.classList.add("pausado");

    // Pausar todos los enemigos y eliminarlos
    enemigos.forEach(enemigo => enemigo.enemigo.remove());
    enemigos = [];  // Limpiar el array de enemigos

    // Mostrar los puntos finales
    document.getElementById("puntos-finales").textContent = `Puntos: ${puntos}`;
}



function reiniciarJuego() {
    // Reiniciar variables
    vidas = 3;
    puntos = 0;
    juegoActivo = true;

    // Ocultar cartel de "Perdiste"
    const cartelPerdiste = document.getElementById("cartel-perdiste");
    cartelPerdiste.classList.remove("visible");

    // Reiniciar barra de vidas
    actualizarBarraDeVidas();

    // Limpiar enemigos de pantalla
    enemigos.forEach(enemigo => enemigo.enemigo.remove());
    enemigos = [];

    // Reiniciar bucles
    intervalGameLoop = setInterval(gameLoop, 50);
    intervalGenerarEnemigo = setInterval(generarEnemigo, 5000);

    // Quitar pausa de las animaciones
    const contenedor = document.getElementById("container");
    contenedor.classList.remove("pausado");

        // Reiniciar cronómetro
        tiempoRestante = 30;
        document.getElementById("imagen-cronometro").src = "images/30seg.png";
        document.getElementById("tiempo-restante").textContent = tiempoRestante;
        intervalCronometro = setInterval(actualizarCronometro, 1000);
}

let intervalGenerarDona = setInterval(generarDona, 10000); // Generar una dona cada 10 segundos

function generarDona() {
    if (!juegoActivo) return;

    let dona = new Dona(); // Crear nueva dona
    detectarColisionConDona(dona); // Verificar colisiones
}

function detectarColisionConDona(dona) {
    const verificarColision = () => {
        let posDona = dona.status();
        let posRunner = runner.status();

        // Ajustar el área de colisión
        let margenColisionDonaX = 20;
        let margenColisionDonaY = 20;

        // Verificar si Homero colisiona con la dona
        if (
            posRunner.left < (posDona.right - margenColisionDonaX) &&
            posRunner.right > (posDona.left + margenColisionDonaX) &&
            posRunner.top < (posDona.bottom - margenColisionDonaY) &&
            posRunner.bottom > (posDona.top + margenColisionDonaY)
        ) {
            // Homero ha recogido la dona
            vidas += 1; // Incrementar vidas
            actualizarBarraDeVidas(); // Actualizar barra de vidas
            dona.dona.remove(); // Eliminar la dona
            return; // Salir del chequeo
        }

        // Si la dona no ha sido recogida, seguir verificando
        requestAnimationFrame(verificarColision);
    };

    verificarColision();
}

/* CRONOMETRO */
// Variables para el temporizador
let tiempoRestante = 30;
let intervalCronometro = setInterval(actualizarCronometro, 1000);

// Función para actualizar el cronómetro
function actualizarCronometro() {
    if (!juegoActivo) return;

    tiempoRestante--;

    // Actualizar la imagen del cronómetro cada 5 segundos
    let imagenCronometro = document.getElementById("imagen-cronometro");
    if (tiempoRestante === 25) {
        imagenCronometro.src = "images/25seg.png";
    } else if (tiempoRestante === 20) {
        imagenCronometro.src = "images/20seg.png";
    } else if (tiempoRestante === 15) {
        imagenCronometro.src = "images/15seg.png";
    } else if (tiempoRestante === 10) {
        imagenCronometro.src = "images/10seg.png";
    } else if (tiempoRestante === 5) {
        imagenCronometro.src = "images/5seg.png";
    } else if (tiempoRestante === 0) {
        imagenCronometro.src = "images/0seg.png";
        detenerJuego(); // Detener el juego cuando el tiempo llega a 0
    }

    // Actualizar el número de segundos en pantalla
    document.getElementById("tiempo-restante").textContent = tiempoRestante;
}

