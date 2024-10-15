"use strict";

class Puntos {
    constructor() {
        this.puntos = 0;
        this.elementoPuntos = document.getElementById("puntos-valor");
    }

    aumentar(puntos) {
        this.puntos += puntos;
        this.actualizar();
    }

    disminuir(puntos) {
        this.puntos -= puntos;
        this.actualizar();
    }

    actualizar() {
        this.elementoPuntos.textContent = this.puntos;
    }
}
