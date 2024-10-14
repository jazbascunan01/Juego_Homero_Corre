class Enemigo extends Personaje {
    constructor(tipo = 'selma') {
        super();
        
        this.enemigo = document.createElement("div");
        this.tipo = tipo;
        
        // Añadir la clase correspondiente al enemigo
        this.enemigo.classList.add(tipo === 'abuelo' ? 'abuelo' : 'enemigo');

        // Posicionar al enemigo fuera de los límites del contenedor inicialmente
        this.enemigo.style.right = '-128px'; // Fuera del borde derecho del contenedor
        this.posX = window.innerWidth;  // Posición inicial del enemigo
    }

    mover() {
        // Aquí puedes agregar la lógica de movimiento específica del enemigo
    }

    status() {
        return this.enemigo.getBoundingClientRect(); // Para verificar las colisiones
    }
}
