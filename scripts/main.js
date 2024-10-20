"use strict";
let enemigos = [];
let runner = new Runner();
runner.correr();
let puedeDisparar = true;  // Variable para controlar si el personaje puede disparar
const puntosSistema = new Puntos(); // Instancia de la clase Puntos

// Funciones para manejar los event listeners
function agregarEventosPersonaje() {
    document.addEventListener('keydown', manejarTeclas);
    document.addEventListener('keyup', manejarTeclas);
}

function quitarEventosPersonaje() {
    document.removeEventListener('keydown', manejarTeclas);
    document.removeEventListener('keyup', manejarTeclas);
}
function eliminarEnemigo() {
    enemigos.forEach((enemigo, index) => {
        enemigos.splice(index, 1);
        enemigo.enemigo.remove();
    });
}
// Función para manejar los eventos de teclado
function manejarTeclas(event) {
    if (!juegoActivo) return;  // Si el juego no está activo, ignorar los eventos

    if (event.type === 'keydown') {
        if (event.key === 'ArrowUp') {
            runner.saltar();
        }
        if (event.code === "Space" && puedeDisparar && enemigoLejos()) {
            puedeDisparar = false;
            runner.disparar();
            document.getElementById("personaje").classList.add("disparando");

            let contadorDisparo = document.getElementById("contador-disparo");
            let segundosRestantes = 5;  // Tiempo de espera para volver a disparar

            // Mostrar el contador de disparo y actualizar cada segundo
            contadorDisparo.textContent = segundosRestantes;
            contadorDisparo.classList.remove("oculto");

            let intervaloDisparo = setInterval(() => {
                segundosRestantes--;
                contadorDisparo.textContent = segundosRestantes;

                // Si ya se puede disparar, ocultar el contador
                if (segundosRestantes <= 0) {
                    clearInterval(intervaloDisparo);
                    puedeDisparar = true;
                    document.getElementById("personaje").classList.remove("disparando");
                    contadorDisparo.classList.add("oculto");
                }
            }, 1000);  // Actualiza el contador cada segundo
            // Rehabilitar el evento después de 5 segundos
            setTimeout(() => {
                puedeDisparar = true;
                document.getElementById("personaje").classList.remove("disparando");
            }, 5000);
        }
        if (event.key === 'ArrowDown') {
            runner.agacharse();
        }
        if (event.key === 'a' || event.key === 'A') {
            runner.puno();
        }
    }
    if (event.type === 'keyup') {
        if (event.code === "Space") {
            setTimeout(() => {
                document.getElementById("personaje").classList.remove("disparando");
            }, 500);
        }
        if (event.key === 'ArrowDown') {
            runner.levantarse();
        }
    }

}
// Función para verificar si el enemigo más cercano está lejos
function enemigoLejos() {
    const distanciaMinimaParaDisparar = 300; // Define la distancia mínima para poder disparar
    let enemigoMasCercano = null;
    let distanciaMasCorta = Infinity;

    enemigos.forEach(enemigo => {
        let posEnemigo = enemigo.status();
        let posRunner = runner.status();
        let distancia = posEnemigo.left - posRunner.right; // Calcular distancia en el eje horizontal

        if (distancia > 0 && distancia < distanciaMasCorta) {
            distanciaMasCorta = distancia;
            enemigoMasCercano = enemigo;
        }
    });

    // Retorna true si no hay enemigos cercanos o si la distancia más corta es mayor que la mínima requerida
    return enemigoMasCercano === null || distanciaMasCorta > distanciaMinimaParaDisparar;
}
// Al iniciar el juego
agregarEventosPersonaje();

let vidas = 3;
let puntos = 0; // Añadimos puntos para el sistema futuro
let maxEnemigosEnPantalla = 6;  // Máximo de enemigos en pantalla
let juegoActivo = false; // Para saber si el juego está activo

let intervalGameLoop = setInterval(gameLoop, 50);
let intervalGenerarEnemigo = setInterval(generarEnemigo, 6000);
let tiempoMinimoGeneracion = 6000;  // Tiempo inicial de generación de enemigos (en milisegundos)
let tiempoReduccion = 200;  // Reducción del tiempo de generación en cada actualización (en milisegundos)
let tiempoMinimoLimite = 900;
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

    document.getElementById("puntos-finales").textContent = `Puntos: ${puntosSistema.puntos}`;
    quitarEventosPersonaje();
}

// Función para reiniciar el juego
function reiniciarJuego() {
    // Reiniciar variables
    vidas = 3;
    puntosSistema.puntos = 0;  // Reiniciar puntos
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
let intervalSumarPuntosPorTiempo = setInterval(sumarPuntosPorTiempo, 1000); // Sumar puntos cada segundo

function sumarPuntosPorTiempo() {
    if (!juegoActivo) return;

    puntosSistema.aumentar(1);  // Añadir 1 punto por cada segundo
    console.log("Puntos por tiempo: " + puntosSistema.puntos);
}
function gameLoop() {
    if (!juegoActivo) return;

    // Inicializar el estado de colisión
    let haColisionado = false;

    enemigos.forEach((enemigo, index) => {
        // Detectar colisiones con el enemigo
        if (detectarColisionConEnemigo(enemigo)) {
            haColisionado = true; // Marcar que hubo colisión
        }

        let posEnemigo = enemigo.status();

        // Si el enemigo sale de la pantalla
        if (posEnemigo.right < 0) {
            // Solo sumar puntos si no hubo colisión
            if (!enemigo.haChocado && !haColisionado) {
                puntosSistema.aumentar(10);  // Añadir puntos solo si no hubo colisión
                console.log("¡Puntos por esquivar enemigo!");
            }
            // Eliminar el enemigo del array y del DOM
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
            if (enemigo.efectoEspecial()) {
                // Si el efecto especial es "muerte", el jugador pierde todas las vidas
                vidas = 0;
                console.log("¡La Muerte te ha atrapado! Vidas restantes: " + vidas);
                actualizarBarraDeVidas();
                detenerJuego();
            } else {
                vidas -= 1;
                puntosSistema.disminuir(10); // Restar 10 puntos al perder una vida
                enemigo.haChocado = true;
                console.log("¡Chocaste con un enemigo! Vidas restantes: " + vidas);
                runner.efectoPerderVida();
                actualizarBarraDeVidas();
                // Quitar los eventos mientras Homero está parpadeando
                quitarEventosPersonaje();

                // Temporizador para restablecer eventos después del parpadeo (ajusta el tiempo según la duración del parpadeo)
                setTimeout(() => {
                    agregarEventosPersonaje();
                    console.log("Eventos restaurados después del parpadeo.");
                }, 2000);
                if (vidas === 0) {
                    detenerJuego();
                }
            }
            return true; // Retornar true si hubo colisión
        }
    }
    return false; // Retornar false si no hubo colisión
}


let ultimoTiempoGeneracion = Date.now(); // Marca de tiempo de la última generación
//const tiempoMinimoGeneracion = 3000;  // Aumenté el tiempo mínimo a 4 segundos
let distanciaMinima = 1000;

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
                    aumentarDificultad();
                } else {
                    console.log("El último enemigo está demasiado cerca, esperando...");
                }
            } else {
                // Si no hay enemigos en pantalla, generar uno de inmediato
                crearNuevoEnemigo();
                ultimoTiempoGeneracion = tiempoActual;  // Actualizar el tiempo de la última generación
                aumentarDificultad();
            }
        } else {
            console.log("Esperando para generar otro enemigo...");
        }
    }
}
let incrementoVelocidad = 0.1;  // La cantidad en que aumentará la velocidad
let intervaloAumentoVelocidad = 5000; // Cada cuánto tiempo aumentará la velocidad (en milisegundos)

// Función para aumentar la velocidad del juego
function aumentarVelocidadJuego() {
    let incremento = Math.floor(puntosSistema.puntos / 100) * incrementoVelocidad;
    // Aumentar la velocidad de los enemigos
    enemigos.forEach(enemigo => {
        enemigo.velocidad += incremento;
    });
    runner.velocidad += incremento; // Aumentar la velocidad del runner
    console.log("Velocidad aumentada: " + incremento);
}


setInterval(() => {
    if (juegoActivo) {
        aumentarDificultad();
    }
}, 10000); // Cada 10 segundos aumenta la dificultad
function calcularTiempoGeneracion() {
    // Aumenta la frecuencia reduciendo el tiempo de generación basado en los puntos
    let nuevoTiempo = Math.max(tiempoMinimoLimite, 6000 - (puntosSistema.puntos * 10));
    return nuevoTiempo;
}
clearInterval(intervalGenerarEnemigo);
intervalGenerarEnemigo = setInterval(generarEnemigo, calcularTiempoGeneracion());

function aumentarDificultad() {
    // Reducir el tiempo mínimo de generación hasta alcanzar el límite
    if (tiempoMinimoGeneracion > tiempoMinimoLimite) {
        tiempoMinimoGeneracion -= tiempoReduccion;
        distanciaMinima -= 500;
        // Reiniciar el intervalo para reflejar el nuevo tiempo mínimo de generación
        clearInterval(intervalGenerarEnemigo);
        intervalGenerarEnemigo = setInterval(generarEnemigo, tiempoMinimoGeneracion);
        console.log("Nueva dificultad: tiempo de generación reducido a " + tiempoMinimoGeneracion + " ms");
    }
    // Aumentar el número máximo de enemigos en pantalla cada cierto número de puntos
    if (puntosSistema.puntos % 50 === 0) {
        maxEnemigosEnPantalla += 1;
    }
    // Aumentar la velocidad de los enemigos
    enemigos.forEach(enemigo => {
        enemigo.velocidad += incrementoVelocidad;  // Incrementar la velocidad
    });
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
    const tiposEnemigo = ['selma', 'abuelo', 'pajaro', 'muerte'];
    const tipoEnemigo = tiposEnemigo[Math.floor(Math.random() * tiposEnemigo.length)];

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
    document.getElementById("puntos-finales").textContent = `Puntos: ${puntosSistema.puntos}`;
}


// Función para iniciar el juego
function iniciarJuego() {
    if (juegoActivo) return;  // No iniciar el juego si ya está activo

    juegoActivo = true;  // Marcar el juego como activo
    vidas = 3;  // Reiniciar vidas
    puntosSistema.puntos = 0;  // Reiniciar puntos

    // Iniciar los intervalos
    intervalGameLoop = setInterval(gameLoop, 50);
    intervalGenerarEnemigo = setInterval(generarEnemigo, 6000);
    intervalSumarPuntosPorTiempo = setInterval(sumarPuntosPorTiempo, 1000);
    intervalGenerarObjeto = setInterval(generarObjetoAleatorio, 10000);

    // Activar los eventos del personaje
    agregarEventosPersonaje();

    // Actualizar visualmente los puntos
    document.getElementById("puntos-valor").textContent = puntosSistema.puntos;
}

function reiniciarJuego() {
    // Reiniciar variables
    vidas = 3;
    puntosSistema.puntos = 0;  // Reiniciar puntos
    juegoActivo = true;
    // Actualizar visualmente los puntos en la pantalla
    document.getElementById("puntos-valor").textContent = puntosSistema.puntos;
    // Limpiar el intervalo del cronómetro si existe
    clearInterval(intervalCronometro);
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
            puntosSistema.aumentar(70);
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
            puntosSistema.aumentar(50);
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
    } else if (tiempoRestante >= 30) {
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
            puntosSistema.aumentar(20);
            return; // Salir del chequeo
        }

        // Si el taco no ha sido recogido, seguir verificando
        requestAnimationFrame(verificarColision);
    };

    verificarColision();
}
/* PANTALLA INICIO */
document.addEventListener("DOMContentLoaded", () => {
    const pantallaInicio = document.getElementById("pantalla-inicio");
    const containerJuego = document.getElementById("container");
    const botonJugar = document.getElementById("btn-jugar");
    const botonComoJugar = document.getElementById("btn-como-jugar");

    // Asegúrate de que el juego esté oculto al cargar la página
    containerJuego.style.display = "none";

    // Función para iniciar el juego
    botonJugar.addEventListener("click", () => {
        // Ocultar la pantalla de inicio
        pantallaInicio.style.display = "none";
        // Mostrar el contenedor del juego
        containerJuego.style.display = "block";
        iniciarJuego();
    });
});

document.addEventListener('DOMContentLoaded', function () {
    // Aquí puedes agregar cualquier lógica que necesites para el inicio
    const pantallaInicio = document.getElementById('pantalla-inicio');

    // Podrías ocultar la pantalla de inicio después de un tiempo o un evento
    setTimeout(() => {
        pantallaInicio.classList.add('oculto');
    }, 10000); // Cambia 10000 por el tiempo que desees (en milisegundos)
});
// Abrir modal
document.getElementById('btn-como-jugar').addEventListener('click', function () {
    document.getElementById('modal-como-jugar').classList.add('visible');
    document.getElementById('modal-como-jugar').classList.remove('oculto');
});

// Cerrar modal
document.getElementById('btn-cerrar-modal').addEventListener('click', function () {
    document.getElementById('modal-como-jugar').classList.remove('visible');
    document.getElementById('modal-como-jugar').classList.add('oculto');
});

// También puedes cerrar el modal haciendo clic fuera de él
window.addEventListener('click', function (event) {
    let modal = document.getElementById('modal-como-jugar');
    if (event.target === modal) {
        modal.classList.remove('visible');
        modal.classList.add('oculto');
    }
});
// Obtener los elementos de los botones
const btnNuevoJuego = document.getElementById("nav-nuevo-juego");

// Agregar evento click al botón "Nuevo Juego"
btnNuevoJuego.addEventListener("click", function (event) {
    event.preventDefault(); // Prevenir el comportamiento predeterminado del enlace

    const pantallaInicio = document.getElementById("pantalla-inicio");
    const containerJuego = document.getElementById("container");
    // Ocultar la pantalla de inicio
    pantallaInicio.style.display = "none";
    // Mostrar el contenedor del juego
    containerJuego.style.display = "block";
    iniciarJuego();

    reiniciarJuego(); // Llama a la función para reiniciar el juego
});

// Función para recargar la página
function recargarPagina() {
    location.reload(); // Recargar la página
}

// Obtener el botón de "Inicio"
const btnInicio = document.getElementById("nav-inicio");

// Asignar el evento para recargar la página
btnInicio.addEventListener("click", function (event) {
    event.preventDefault(); // Prevenir el comportamiento predeterminado del enlace
    recargarPagina(); // Llama a la función para recargar la página
});
