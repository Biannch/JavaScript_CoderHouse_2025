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
            console.log("madera: " + recursos_total.materiales[0])
            console.log("piedra: " + recursos_total.materiales[1])
            console.log("tela: " + recursos_total.materiales[2])
            continue
        }
        let cantidad = parseInt(prompt("¿Cuánto recolectó de " + recurso + " ?"))
        recursos_total[recurso] += cantidad
    }
    ver_recursos()
}

function simular_dia(dias=1){
    let peligro = parseInt(Math.random() * ((dias + base.seguridad + 5) - 1) + 1)

    if(peligro >= base.seguridad){
        base.supervivientes-=1
        alert("Sufrimos un ataque!")
    }
    recursos_total.alimento
    recursos_total.agua
    recursos_total.medicamentos
    recursos_total.materiales[0]
    recursos_total.materiales[1]
    recursos_total.materiales[2]
    recursos_total.armas
    recursos_total.defensas
}

let opcion
do{
    opcion = parseInt(prompt("1. Ver recursos\n2. Agregar recolección\n3. Simular días\n4. Evaluar riesgos\n5. Salir"))
    if(opcion<1 || opcion>5){
        alert("Ingrese una opción que exista")
    }
}
while(opcion<1 || opcion>5){
    if(opcion == 1){
        ver_recursos()
    }
    else if(opcion == 2){
        recoleccion()
    }
    else if(opcion == 3){
        simular_dia()
    }
}