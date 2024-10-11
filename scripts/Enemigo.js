class Enemigo extends Personaje {
    constructor() {
        super();
        
        this.enemigo = document.createElement("div");
        this.enemigo.classList.add("enemigo");

        // Posicionar al enemigo fuera de los límites del contenedor inicialmente
        this.enemigo.style.right = '-128px'; // Fuera del borde derecho del contenedor
        this.posX = window.innerWidth;  // Posición inicial de Selma
    }

    mover(velocidad) {
/*         // Reduce la posición X de Selma para hacerla avanzar
        this.posX -= velocidad;
        this.enemigo.style.left = `${this.posX}px`;

        // Si Selma sale de la pantalla, la eliminamos
        if (this.posX + this.enemigo.offsetWidth < 0) {
            this.enemigo.remove();
        } */
    }

    status() {
        return this.enemigo.getBoundingClientRect(); // Para verificar las colisiones
    }
}
