class Runner extends Personaje {

    constructor() {
        super();
        this.personaje = document.getElementById("personaje");
        this.corriendo = false;
        this.moverFondo(false);
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
        if (this.corriendo) {
            this.clean();
            this.personaje.classList.add("quieto");
            this.corriendo = false;
            this.moverFondo(false);  // Detener el fondo
        }
    }
    caer(estabaCorriendo) {
        this.clean();
        this.personaje.classList.add("caer");
    
        this.personaje.addEventListener("animationend", () => {
            if (estabaCorriendo) {
                this.correr();
            } else {
                this.quieto();
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
        this.personaje.removeEventListener("animationend", () => {}); 
    }
    moverFondo(activar) {
        const elementosFondo = ['sky', 'clouds', 'fondoLejano', 'vereda', 'montania'];
        elementosFondo.forEach((id) => {
            const elem = document.getElementById(id);
            elem.style.animationPlayState = activar ? 'running' : 'paused';
        });
    }
    
}