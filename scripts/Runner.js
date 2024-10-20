class Runner extends Personaje {

    constructor() {
        super();
        this.personaje = document.getElementById("personaje");
        this.corriendo = true; // El personaje comienza corriendo
        this.estaInmune = false;
        this.runnerElement = document.getElementById("personaje");
        this.balas = []; // Arreglo para almacenar las balas
    } // Fin del constructor

    // Devuelve el rectángulo delimitador del personaje en la pantalla
    status() {
        return this.personaje.getBoundingClientRect();
    } // Fin de status

    // Inicia la animación de correr
    correr() {
        this.clean();
        this.personaje.classList.add("correr");
    } // Fin de correr

    // Inicia la animación de agacharse
    agacharse() {
        this.personaje.classList.remove("saltar", "caer");
        this.personaje.classList.add("agachado");
        this.estaAgachado = true;
    } // Fin de agacharse

    // Termina la animación de agacharse y vuelve a correr
    levantarse() {
        this.personaje.classList.remove("agachado");
        this.estaAgachado = false;
        this.correr();
    } // Fin de levantarse

    // Inicia la animación de salto si el personaje no está saltando ni cayendo
    saltar() {
        if (!this.personaje.classList.contains("saltar") && !this.personaje.classList.contains("caer")) {
            this.clean();
            this.personaje.classList.add("saltar");
            this.personaje.addEventListener("animationend", () => {
                this.caer(); // Inicia la caída después del salto
            });
        }
    } // Fin de saltar

    // Inicia la animación de caída
    caer() {
        this.clean();
        this.personaje.classList.add("caer");
        this.personaje.addEventListener("animationend", () => {
            this.correr(); // Regresa a correr después de caer
        });
    } // Fin de caer

    // Activa el efecto visual de perder vida
    efectoPerderVida() {
        if (this.estaInmune) return; // No pierde vida si es inmune
        this.personaje.classList.add("parpadeo");

        // Remueve el parpadeo después de 2 segundos
        setTimeout(() => {
            this.personaje.classList.remove("parpadeo");
        }, 2000);
    } // Fin de efectoPerderVida

    // Activa la inmunidad temporal del personaje
    efectoInmunidad() {
        if (!this.runnerElement) {
            console.error("runnerElement no está definido");
            return;
        }

        if (this.estaInmune) return; // No hacer nada si ya es inmune

        this.estaInmune = true;
        this.runnerElement.classList.add("inmunidad");

        // Desactiva la inmunidad después de 10 segundos
        setTimeout(() => {
            this.estaInmune = false;
            this.runnerElement.classList.remove("inmunidad");
        }, 10000);
    } // Fin de efectoInmunidad

    // Elimina el efecto visual de inmunidad
    quitarEfectoInmunidad() {
        if (!this.runnerElement) return;
        this.runnerElement.classList.remove("inmunidad");
    } // Fin de quitarEfectoInmunidad

    // Limpia las animaciones actuales del personaje
    clean() {
        this.personaje.classList.remove("correr", "saltar", "caer", "puno", "agachado");
        this.personaje.removeEventListener("animationend", () => { });
    } // Fin de clean

    // Dispara una bala desde la posición del personaje
    disparar() {
        setTimeout(() => {
            const bala = document.createElement("div");
            bala.classList.add("bala");
            bala.style.left = `${this.status().right}px`; // Posición inicial de la bala
            bala.style.top = `${this.status().top + this.status().height / 3}px`; // A la altura del personaje
            document.body.appendChild(bala);
            this.balas.push(bala);
            this.moverBala(bala);
        }, 500);
    } // Fin de disparar

    // Mueve la bala y verifica colisiones con enemigos
    moverBala(bala) {
        const velocidadBala = 10;
        const mover = () => {
            const nuevaPosicion = parseFloat(bala.style.left) + velocidadBala;
            bala.style.left = `${nuevaPosicion}px`;

            // Verificar colisión con enemigos
            const enemigos = document.querySelectorAll(".enemigo, .abuelo, .muerte");
            enemigos.forEach((enemigo) => {
                const enemigoRect = enemigo.getBoundingClientRect();
                const balaRect = bala.getBoundingClientRect();
                if (this.detectarColision(balaRect, enemigoRect)) {
                    enemigo.remove(); // Elimina al enemigo si hay colisión
                    eliminarEnemigo();
                    bala.remove(); // Elimina la bala
                }
            });

            // Elimina la bala si sale de la pantalla
            if (nuevaPosicion > 1300) {
                bala.remove();
            } else {
                requestAnimationFrame(mover);
            }
        };
        mover();
    } // Fin de moverBala

    // Detecta si hay colisión entre dos rectángulos
    detectarColision(rect1, rect2) {
        return !(rect1.right < rect2.left ||
                 rect1.left > rect2.right ||
                 rect1.bottom < rect2.top ||
                 rect1.top > rect2.bottom);
    } // Fin de detectarColision

    // Ejecuta un puñetazo y verifica colisiones con enemigos
    puno() {
        this.clean();
        this.personaje.classList.add("puno");
        this.verificarColisionConEnemigos();

        // Listener para manejar el final de la animación del puñetazo
        const onAnimationEnd = () => {
            this.personaje.removeEventListener("animationend", onAnimationEnd);
            this.personaje.classList.remove("puno");
            this.correr();
        };

        this.personaje.addEventListener("animationend", onAnimationEnd);
    } // Fin de puno

    // Verifica colisiones con enemigos durante el puñetazo
    verificarColisionConEnemigos() {
        const enemigos = document.querySelectorAll(".enemigo, .abuelo, .muerte");
        const runnerRect = this.status();
        const margenExtraX = 30; // Ampliar el área de colisión en el eje X
        const margenExtraY = 30; // Ampliar el área de colisión en el eje Y

        enemigos.forEach((enemigo) => {
            const enemigoRect = enemigo.getBoundingClientRect();
            if (this.detectarColisionAmpliada(runnerRect, enemigoRect, margenExtraX, margenExtraY)) {
                eliminarEnemigo(enemigo);
                console.log("Enemigo eliminado por el puñetazo");
            }
        });
    } // Fin de verificarColisionConEnemigos

    // Detecta colisiones con márgenes adicionales
    detectarColisionAmpliada(rect1, rect2, margenX, margenY) {
        return !(rect1.right + margenX < rect2.left ||
                 rect1.left - margenX > rect2.right ||
                 rect1.bottom + margenY < rect2.top ||
                 rect1.top - margenY > rect2.bottom);
    } // Fin de detectarColisionAmpliada

} // Fin de la clase Runner
