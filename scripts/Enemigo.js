class Enemigo extends Personaje {
    constructor() {
        super();
        
        this.enemigo = document.createElement("div");
        this.enemigo.classList.add("enemigo");

        // Posicionar al enemigo fuera de los límites del contenedor inicialmente
        this.enemigo.style.right = '-128px'; // Fuera del borde derecho del contenedor
        this.posX = window.innerWidth;  // Posición inicial de Selma
    }

    mover() {
    }

    status() {
        return this.enemigo.getBoundingClientRect(); // Para verificar las colisiones
    }
}
