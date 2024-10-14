class CervezaDuff {
    constructor() {
        this.cervezaDuff = document.createElement("div");
        this.cervezaDuff.classList.add("cerveza-duff");
        this.posX = window.innerWidth; // Inicia fuera de la pantalla
        this.posY = (Math.random() * (window.innerHeight * 0.1)) + (window.innerHeight * 0.5); // Posición vertical aleatoria
        this.cervezaDuff.style.left = `${this.posX}px`;
        this.cervezaDuff.style.top = `${this.posY}px`;
        document.getElementById("contenedor").appendChild(this.cervezaDuff);

        this.mover();
    }

    mover() {
        const moverCerveza = () => {
            this.posX -= 5; // Mover la cerveza hacia la izquierda
            this.cervezaDuff.style.left = `${this.posX}px`;

            if (this.posX < -50) { // Si la cerveza sale de la pantalla
                this.cervezaDuff.remove(); // Eliminar la cerveza
            } else {
                requestAnimationFrame(moverCerveza); // Continuar el movimiento
            }
        };

        moverCerveza();
    }

    status() {
        return this.cervezaDuff.getBoundingClientRect();
    }

    remove() {
        this.cervezaDuff.remove();
    }
}
