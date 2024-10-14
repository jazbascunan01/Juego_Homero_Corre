class Runner extends Personaje {

    constructor() {
        super();
        this.personaje = document.getElementById("personaje");
        this.corriendo = true;  // El personaje comienza corriendo
        /* this.moverFondo(true);  // El fondo comienza a moverse */
        /* this.cambiarAnimacionEnemigos("correr");  // Cambiar animación a correr */
    }

    status() {
        return this.personaje.getBoundingClientRect();
    }

    correr() {
            this.clean();
            this.personaje.classList.add("correr");
           /*  this.moverFondo(true);  // Comenzar a mover el fondo */
           /*  this.cambiarAnimacionEnemigos("correr");
    } */
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
        this.personaje.classList.add("parpadeo");

        // Después de 2 segundos, removemos el efecto de parpadeo
        setTimeout(() => {
            this.personaje.classList.remove("parpadeo");
        }, 2000);
    }

    clean() {
        this.personaje.classList.remove("correr"); 
        this.personaje.classList.remove("saltar");
        this.personaje.classList.remove("caer"); 
        //this.personaje.style.background = ""; // Elimina la imagen de fondo
        this.personaje.removeEventListener("animationend", () => {}); 
    }
    

/*     moverFondo(activar) {
        const elementosFondo = ['sky', 'clouds', 'fondoLejano', 'vereda', 'montania'];
        elementosFondo.forEach((id) => {
            const elem = document.getElementById(id);
            elem.style.animationPlayState = activar ? 'running' : 'paused';
        });
    } */

  /*   cambiarAnimacionEnemigos(estado) {
        const enemigos = document.querySelectorAll('.enemigo');
    
        if (enemigos.length === 0) {
            console.log("No hay enemigos aún. Reintentando...");
            setTimeout(() => this.cambiarAnimacionEnemigos(estado), 1000);
            return;
        }
    
        enemigos.forEach((enemigo) => {
            cancelAnimationFrame(enemigo.movementFrame); 
            const computedStyle = getComputedStyle(enemigo);
            const currentPosition = parseFloat(computedStyle.left); 
            let velocidad = estado === "correr" ? 4 : 2;
    
            const moverEnemigo = () => {
                const nuevaPosicion = parseFloat(enemigo.style.left || currentPosition) - velocidad;
                enemigo.style.left = `${nuevaPosicion}px`;
                if (nuevaPosicion <= -enemigo.offsetWidth) {
                    enemigo.style.left = `${window.innerWidth}px`;
                }
                enemigo.movementFrame = requestAnimationFrame(moverEnemigo);
            };
    
            moverEnemigo();  
            enemigo.style.animation = `caminarSelma 1s steps(5) infinite`;
        });
    } */
}
