class Dona {
    constructor() {
        this.dona = document.createElement("div");
        this.dona.classList.add("dona");
        this.posX = window.innerWidth; // Inicia fuera de la pantalla
        this.posY = (Math.random() * (window.innerHeight * 0.2)) + (window.innerHeight * 0.5);
        this.dona.style.left = `${this.posX}px`;
        this.dona.style.top = `${this.posY}px`;
        document.getElementById("contenedor").appendChild(this.dona);

        this.mover();
    }

    mover() {
        const moverDona = () => {
            this.posX -= 5; // Mover la dona hacia la izquierda
            this.dona.style.left = `${this.posX}px`;

            if (this.posX < -50) { // Si la dona sale de la pantalla
                this.dona.remove(); // Eliminar la dona
            } else {
                requestAnimationFrame(moverDona); // Continuar el movimiento
            }
        };

        moverDona();
    }

    status() {
        return this.dona.getBoundingClientRect();
    }
}
