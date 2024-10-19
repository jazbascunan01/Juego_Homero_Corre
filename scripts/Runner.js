class Runner extends Personaje {

    constructor() {
        super();
        this.personaje = document.getElementById("personaje");
        this.corriendo = true;  // El personaje comienza corriendo
        this.estaInmune = false;
        this.runnerElement = document.getElementById("personaje");
        this.balas = []; // Arreglo para almacenar las balas
    }

    status() {
        return this.personaje.getBoundingClientRect();
    }

    correr() {
        this.clean();
        this.personaje.classList.add("correr");
    }
    agacharse() {
        this.personaje.classList.add("agachado");
        this.estaAgachado = true;
    }

    levantarse() {
        this.personaje.classList.remove("agachado");
        this.estaAgachado = false;
    }
    saltar() {
        if (!this.personaje.classList.contains("saltar") && !this.personaje.classList.contains("caer")) {
            this.clean();
            this.personaje.classList.add("saltar");

            this.personaje.addEventListener("animationend", () => {
                this.caer();
            });
        }
    }

    caer() {
        this.clean();
        this.personaje.classList.add("caer");

        this.personaje.addEventListener("animationend", () => {
            this.correr();
        });
    }



    efectoPerderVida() {
        if (this.estaInmune) return; // Si el personaje es inmune, no pierde vida
        this.personaje.classList.add("parpadeo");

        // Después de 2 segundos, removemos el efecto de parpadeo
        setTimeout(() => {
            this.personaje.classList.remove("parpadeo");
        }, 2000);
    }

    efectoInmunidad() {
        if (!this.runnerElement) {
            console.error("runnerElement no está definido");
            return;
        }

        if (this.estaInmune) return; // Si ya es inmune, no hacer nada

        this.estaInmune = true; // Activar la inmunidad
        this.runnerElement.classList.add("inmunidad"); // Agregar una clase para el efecto visual (animación o brillo)

        // Desactivar la inmunidad después de 5 segundos
        setTimeout(() => {
            this.estaInmune = false;
            this.runnerElement.classList.remove("inmunidad"); // Quitar la clase de efecto visual
        }, 10000);
    }
    quitarEfectoInmunidad() {
        if (!this.runnerElement) return;
        this.runnerElement.classList.remove("inmunidad");
    }

    clean() {
        this.personaje.classList.remove("correr", "saltar", "caer", "puno", "agachado");
        this.personaje.removeEventListener("animationend", () => { });
    }
    // Método para disparar
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
    }

    // Método para mover la bala y detectar colisiones
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

            // Eliminar la bala si sale de la pantalla
            if (nuevaPosicion > 1300) {
                bala.remove();
            } else {
                requestAnimationFrame(mover);
            }
        };
        mover();
    }

    // Función para detectar colisiones
    detectarColision(rect1, rect2) {
        return !(rect1.right < rect2.left ||
            rect1.left > rect2.right ||
            rect1.bottom < rect2.top ||
            rect1.top > rect2.bottom);
    }
    // Método para atacar con un puñetazo
    puno() {
        this.clean();
        this.personaje.classList.add("puno");

        // Verificar colisiones con enemigos
        this.verificarColisionConEnemigos();

        // Remover cualquier event listener existente para evitar acumulaciones
        const onAnimationEnd = () => {
            this.personaje.removeEventListener("animationend", onAnimationEnd);
            this.personaje.classList.remove("puno"); // Remover la clase del puñetazo
            this.correr(); // Regresa a la animación de correr una vez que termina el puñetazo
        };

        // Agregar el listener para manejar el final de la animación
        this.personaje.addEventListener("animationend", onAnimationEnd);
    }
    // Verificar colisiones con enemigos durante el puñetazo
    verificarColisionConEnemigos() {
        const enemigos = document.querySelectorAll(".enemigo, .abuelo, .muerte");
        const runnerRect = this.status();

        // Definir márgenes adicionales para la detección del puñetazo
        const margenExtraX = 30; // Añadir 20 píxeles a los lados del área de colisión
        const margenExtraY = 30; // Añadir 10 píxeles arriba y abajo del área de colisión

        enemigos.forEach((enemigo) => {
            const enemigoRect = enemigo.getBoundingClientRect();
            // Ampliar el área de colisión del puñetazo
            if (this.detectarColisionAmpliada(runnerRect, enemigoRect, margenExtraX, margenExtraY)) {
                eliminarEnemigo(enemigo); // Pasar el enemigo específico a eliminar
                console.log("Enemigo eliminado por el puñetazo");
            }
        });
    }
    // Método para detectar colisiones con márgenes adicionales
    detectarColisionAmpliada(rect1, rect2, margenX, margenY) {
        return !(rect1.right + margenX < rect2.left ||
            rect1.left - margenX > rect2.right ||
            rect1.bottom + margenY < rect2.top ||
            rect1.top - margenY > rect2.bottom);
    }
}
