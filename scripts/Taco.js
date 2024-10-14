// Taco.js
class Taco {
    constructor() {
        this.taco = document.createElement("div");
        this.taco.classList.add("taco");
        this.posX = window.innerWidth; // Inicia fuera de la pantalla
        this.posY = (Math.random() * (window.innerHeight * 0.1)) + (window.innerHeight * 0.5);
        this.taco.style.left = `${this.posX}px`;
        this.taco.style.top = `${this.posY}px`;
        document.getElementById("contenedor").appendChild(this.taco);

        this.mover();
    }

    mover() {
        const moverTaco = () => {
            this.posX -= 5; // Mover el taco hacia la izquierda
            this.taco.style.left = `${this.posX}px`;

            if (this.posX < -50) { // Si el taco sale de la pantalla
                this.taco.remove(); // Eliminar el taco
            } else {
                requestAnimationFrame(moverTaco); // Continuar el movimiento
            }
        };

        moverTaco();
    }

    status() {
        return this.taco.getBoundingClientRect();
    }
}
