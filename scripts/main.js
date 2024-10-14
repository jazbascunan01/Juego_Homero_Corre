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
    if (!juegoActivo) return;

    enemigos.forEach((enemigo, index) => {
        detectarColisionConEnemigo(enemigo);

        let posEnemigo = enemigo.status();
        if (posEnemigo.right < 0) {
            enemigos.splice(index, 1);
            enemigo.enemigo.remove();
        }
    });
}

function detectarColisionConEnemigo(enemigo) {
    let posEnemigo = enemigo.status();
    let posRunner = runner.status();

    let margenColisionEnemigoX = 15;
    let margenColisionEnemigoY = 20;
    let margenColisionRunnerX = 10;
    let margenColisionRunnerY = 15;

    if (
        !runner.estaSaltando &&
        posRunner.left < (posEnemigo.right - margenColisionEnemigoX) &&
        posRunner.right > (posEnemigo.left + margenColisionEnemigoX) &&
        posRunner.top < (posEnemigo.bottom - margenColisionEnemigoY) &&
        posRunner.bottom > (posEnemigo.top + margenColisionEnemigoY)
    ) {
        if (!enemigo.haChocado && !estaInmune) {
            vidas -= 1;
            enemigo.haChocado = true;
            console.log("¡Chocaste con un enemigo! Vidas restantes: " + vidas);
            runner.efectoPerderVida();
            actualizarBarraDeVidas();

            if (vidas === 0) {
                detenerJuego();
            }
        }
    } else {
        enemigo.haChocado = false;
    }
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

let intervalGenerarObjeto = setInterval(generarObjetoAleatorio, 10000); // Generar un objeto cada 10 segundos
function generarObjetoAleatorio() {
    if (!juegoActivo) return;

    // Probabilidades: 70% taco, 20% cerveza Duff, 10% dona
    const random = Math.random();
    if (random < 0.7) {
        generarTaco();
    } else if (random < 0.9) {
        generarCervezaDuff();
    } else {
        generarDona();
    }
}
function generarCervezaDuff() {
    if (!juegoActivo) return;

    let cerveza = new CervezaDuff(); // Crear nueva cerveza Duff
    alert("cerveza");
    detectarColisionConCervezaDuff(cerveza); // Verificar colisiones
}
function detectarColisionConCervezaDuff(cerveza) {
    const verificarColision = () => {
        let posCerveza = cerveza.status();
        let posRunner = runner.status();

        // Ajustar el área de colisión
        let margenColisionCervezaX = 20;
        let margenColisionCervezaY = 20;

        // Verificar si Homero colisiona con la cerveza Duff
        if (
            posRunner.left < (posCerveza.right - margenColisionCervezaX) &&
            posRunner.right > (posCerveza.left + margenColisionCervezaX) &&
            posRunner.top < (posCerveza.bottom - margenColisionCervezaY) &&
            posRunner.bottom > (posCerveza.top + margenColisionCervezaY)
        ) {
            // Homero ha recogido la cerveza Duff
            activarInmunidad();
            cerveza.remove(); // Eliminar la cerveza Duff
            return; // Salir del chequeo
        }

        // Si la cerveza Duff no ha sido recogida, seguir verificando
        requestAnimationFrame(verificarColision);
    };

    verificarColision();
}

let estaInmune = false;
function activarInmunidad() {
    if (estaInmune) return; // No activar si ya está inmune

    estaInmune = true;
    runner.efectoInmunidad(); // Cambiar la apariencia de Homero para indicar inmunidad

    // Desactivar la inmunidad después de 5 segundos
    setTimeout(() => {
        estaInmune = false;
        runner.quitarEfectoInmunidad(); // Volver a la apariencia normal
    }, 5000);
}


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
    }else if (tiempoRestante >=30) {
        imagenCronometro.src = "images/30seg.png";
    }

    // Actualizar el número de segundos en pantalla
    document.getElementById("tiempo-restante").textContent = tiempoRestante;
}

/* TACO */
function generarTaco() {
    if (!juegoActivo) return;

    let taco = new Taco(); // Crear un nuevo taco
    detectarColisionConTaco(taco); // Verificar colisiones
}

function detectarColisionConTaco(taco) {
    const verificarColision = () => {
        let posTaco = taco.status();
        let posRunner = runner.status();

        // Ajustar el área de colisión
        let margenColisionTacoX = 20;
        let margenColisionTacoY = 20;

        // Verificar si Homero colisiona con el taco
        if (
            posRunner.left < (posTaco.right - margenColisionTacoX) &&
            posRunner.right > (posTaco.left + margenColisionTacoX) &&
            posRunner.top < (posTaco.bottom - margenColisionTacoY) &&
            posRunner.bottom > (posTaco.top + margenColisionTacoY)
        ) {
            // Homero ha recogido el taco
            tiempoRestante += 30; // Incrementar el tiempo en 5 segundos
            actualizarCronometro(); // Actualizar el cronómetro
            taco.taco.remove(); // Eliminar el taco
            return; // Salir del chequeo
        }

        // Si el taco no ha sido recogido, seguir verificando
        requestAnimationFrame(verificarColision);
    };

    verificarColision();
}
