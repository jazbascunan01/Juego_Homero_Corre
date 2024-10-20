class Enemigo extends Personaje {
    constructor(tipo = 'selma') {
        super();

        this.enemigo = document.createElement("div");
        this.tipo = tipo;

        // Añadir la clase correspondiente al enemigo
        if (tipo === 'abuelo') {
            this.enemigo.classList.add('abuelo');
        } else if (tipo === 'pajaro') {
            this.enemigo.classList.add('pajaro');
            console.log("pajaro");
        } else if (tipo === 'muerte') {
            this.enemigo.classList.add('muerte'); // Clase para La Muerte
        } else {
            this.enemigo.classList.add('enemigo'); // Selma u otros enemigos
        }

        // Posicionar al enemigo fuera de los límites del contenedor inicialmente
        this.enemigo.style.right = '-128px'; // Fuera del borde derecho del contenedor
        this.posX = window.innerWidth;  // Posición inicial del enemigo
    }

    mover() {
        
    }

    status() {
        return this.enemigo.getBoundingClientRect(); // Para verificar las colisiones
    }
    efectoEspecial() {
        return this.tipo === 'muerte';
    }
}
