class Runner extends Personaje {

    constructor() {
        super();
        this.personaje = document.getElementById("personaje");
        this.corriendo = false;
        this.moverFondo(false);
        this.cambiarAnimacionEnemigos("quieto");
    }

    status() {
        return this.personaje.getBoundingClientRect();
    }

    correr() {
        if (!this.corriendo) {
            this.clean();
            this.personaje.classList.add("correr");
            this.corriendo = true;
            this.moverFondo(true);  // Comenzar a mover el fondo
            this.cambiarAnimacionEnemigos("correr");
        }
    }

    saltar() {
        if (!this.personaje.classList.contains("saltar") && !this.personaje.classList.contains("caer")) {
            const estabaCorriendo = this.corriendo;  // Guarda si estaba corriendo antes del salto

            this.clean();
            this.personaje.classList.add("saltar");

            this.personaje.addEventListener("animationend", () => {
                this.caer(estabaCorriendo);
            });
        }
    }


    quieto() {
        this.clean();
        this.personaje.classList.add("quieto");
        this.corriendo = false;
        this.moverFondo(false);  // Detener el fondo
        this.cambiarAnimacionEnemigos("quieto");
    }
    caer(estabaCorriendo) {
        this.clean();
        this.personaje.classList.add("caer");

        this.personaje.addEventListener("animationend", () => {
            if (estabaCorriendo) {
                console.log(estabaCorriendo);
                this.correr();
            } else {
                this.quieto();
                console.log(estabaCorriendo);
            }
        });
    }


    /**
     * 
     */
    clean() {
        this.personaje.classList.remove("correr");
        this.personaje.classList.remove("saltar");
        this.personaje.classList.remove("caer");
        this.personaje.classList.remove("quieto");
        this.personaje.removeEventListener("animationend", () => { });
    }
    moverFondo(activar) {
        const elementosFondo = ['sky', 'clouds', 'fondoLejano', 'vereda', 'montania'];
        elementosFondo.forEach((id) => {
            const elem = document.getElementById(id);
            elem.style.animationPlayState = activar ? 'running' : 'paused';
        });
    }
    cambiarAnimacionEnemigos(estado) {
        const enemigos = document.querySelectorAll('.enemigo');
    
        if (enemigos.length === 0) {
            console.log("No hay enemigos aún. Reintentando...");
            setTimeout(() => this.cambiarAnimacionEnemigos(estado), 500);
            return;
        }
    
        enemigos.forEach((enemigo) => {
            // Limpiamos cualquier animación o intervalo anterior
            cancelAnimationFrame(enemigo.movementFrame); 
    
            // Obtenemos la posición actual de Selma
            const computedStyle = getComputedStyle(enemigo);
            const currentPosition = parseFloat(computedStyle.left); 
            
            // Velocidad variable dependiendo de si Homero corre o está quieto
            let velocidad = estado === "correr" ? 4 : 2;
    
            // Iniciar el movimiento usando requestAnimationFrame
            const moverEnemigo = () => {
                // Actualizamos la posición
                const nuevaPosicion = parseFloat(enemigo.style.left || currentPosition) - velocidad;
                enemigo.style.left = `${nuevaPosicion}px`;
                
                // Si Selma sale de la pantalla, la reiniciamos al otro lado
                if (nuevaPosicion <= -enemigo.offsetWidth) {
                    enemigo.style.left = `${window.innerWidth}px`;
                }
    
                // Continuar animando en el siguiente frame
                enemigo.movementFrame = requestAnimationFrame(moverEnemigo);
            };
    
            moverEnemigo();  // Iniciar la animación
    
            // Cambiar la animación de los pies de Selma (caminar o detenerse)
            enemigo.style.animation = `caminarSelma 1s steps(5) infinite`;
            console.log(estado === "correr" ? "enemigo rápido" : "enemigo lento");
        });
    
    }
}