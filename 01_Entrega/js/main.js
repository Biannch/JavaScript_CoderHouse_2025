// alert("Hola")

/*========================================================
 Simulador de recursos para un videojuego de supervivencia
==========================================================*/
/*
El usuario administra los recursos de una base de supervivientes en un mundo postapocalíptico.
Debe registrar recolecciones (alimentos, agua, medicinas) y consumos diarios.
El simulador le muestra cuántos días puede sobrevivir con los recursos actuales, advierte si
está en riesgo,y le permite consultar el consumo por categoría.
*/

const recursos_total = {
    alimento: 20,
    agua: 10,
    medicamentos: 5,
    materiales: [madera=20, piedra=10, tela=5],
    armas: 10,
    defensas: 4
}

const base = {
    supervivientes: 10,
    seguridad: recursos_total.armas + recursos_total.defensas,
}
base.esperanza_vida = parseInt((recursos_total.alimento + recursos_total.agua + recursos_total.medicamentos)/base.supervivientes)

// funciones

function ver_recursos(){
    let index = 1
    console.log("Recursos de la base:")
    for(let recurso in recursos_total){
        console.log(index + ". " + recurso + ": " + recursos_total[recurso]);
        if(recurso == "materiales"){
            console.log("madera: " + recursos_total.materiales[0])
            console.log("piedra: " + recursos_total.materiales[1])
            console.log("tela: " + recursos_total.materiales[2])
        }
        index++
    }
}

function recoleccion(){
    for(let recurso in recursos_total){
        if(recurso == "materiales"){
            let materiales = ["madera", "piedra", "tela"];
            for(let i = 0; i < materiales.length; i++){
                let cantidad = parseInt(prompt("¿Cuánto recolectó de " + materiales[i] + "?"));
                recursos_total.materiales[i] += cantidad;
            }
            continue;
        }
        let cantidad = parseInt(prompt("¿Cuánto recolectó de " + recurso +"?"));
        recursos_total[recurso] += cantidad;
    }
    ver_recursos();
}

function simular_dia(dias = 1){
    let peligro = parseInt(Math.random() * ((dias + base.seguridad + 5) - 1) + 1)

    if(peligro >= base.seguridad){
        base.supervivientes -= 1;
        alert("¡Sufrimos un ataque!");

        // Se pierden recursos tras el ataque
        recursos_total.alimento = Math.max(0, recursos_total.alimento - 2);
        recursos_total.agua = Math.max(0, recursos_total.agua - 1);
        recursos_total.medicamentos = Math.max(0, recursos_total.medicamentos - 1);
        recursos_total.materiales[0] = Math.max(0, recursos_total.materiales[0] - 3); // madera
        recursos_total.materiales[1] = Math.max(0, recursos_total.materiales[1] - 2); // piedra
        recursos_total.materiales[2] = Math.max(0, recursos_total.materiales[2] - 1); // tela
        recursos_total.armas = Math.max(0, recursos_total.armas - 1);
        recursos_total.defensas = Math.max(0, recursos_total.defensas - 1);

        console.log("¡Se han perdido recursos tras el ataque!");
    }

    // Consumo diario por superviviente
    const consumo = {
        alimento: 1,
        agua: 1,
        medicamentos: 0.2
    };
    recursos_total.alimento = Math.max(0, recursos_total.alimento - consumo.alimento * base.supervivientes * dias);
    recursos_total.agua = Math.max(0, recursos_total.agua - consumo.agua * base.supervivientes * dias);
    recursos_total.medicamentos = Math.max(0, recursos_total.medicamentos - consumo.medicamentos * base.supervivientes * dias);

    alert("Consumo de " + dias + " día(s) realizado. Recursos actualizados.");
}

// fin funciones

console.log("Bienvendido a tu base! Hoy es el día 1, actualmente ya posees ciertos recursos. Mucha suerte sobreviviendo!")

let opcion;
do {
    if (base.supervivientes <= 0) {
        alert("¡Todos los supervivientes han muerto! El juego ha terminado.");
        break;
    }
    opcion = parseInt(prompt("1. Ver recursos\n2. Agregar recolección\n3. Simular días\n4. Salir"));
    if(opcion < 1 || opcion > 4){
        alert("Ingrese una opción que exista");
        continue;
    }
    if(opcion == 1){
        ver_recursos();
    }
    else if(opcion == 2){
        recoleccion();
    }
    else if(opcion == 3){
        let dias = parseInt(prompt("¿Cuántos días queres simular?"));
        simular_dia(dias);
    }

} while(opcion !== 4 && base.supervivientes > 0);

if (base.supervivientes > 0) {
    alert("Has salido del simulador, hasta la próxima!");
}