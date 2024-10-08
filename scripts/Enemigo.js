class Enemigo extends Personaje {


    constructor() {
        super();
        
        this.enemigo = document.createElement("div");
        this.enemigo.classList.add("enemigo");
      


    }

    status() {
        super.status();
    }
}