const recursos_total = {
    alimento: 20,
    agua: 10,
    medicamentos: 5,
    materiales: [20, 10, 5], // madera, piedra, tela
    armas: 10,
    defensas: 4
}

const base = {
    supervivientes: 10,
    seguridad: recursos_total.armas + recursos_total.defensas,
}

// ----------------> ELEMENTOS DEL DOM
const formRecoleccion = document.getElementById("form-recoleccion");
const alimento = document.getElementById("idalimento");
const agua = document.getElementById("idagua");
const medicamentos = document.getElementById("idmedicamentos");
const madera = document.getElementById("idmadera");
const piedra = document.getElementById("idpiedra");
const tela = document.getElementById("idtela");
const armas = document.getElementById("idarmas");
const defensas = document.getElementById("iddefensas");
const prints = document.getElementById("prints");
const inputDias = document.getElementById("dias-simular");
const btnSimular = document.getElementById("btn-simular");
const spanSupervivientes = document.getElementById("supervivientes");
const spanDiasPosibles = document.getElementById("dias-posibles");


function guardarEstado_RecursosBase(){
    localStorage.setItem("recursos_total", JSON.stringify(recursos_total));
    localStorage.setItem("base", JSON.stringify(base));
}

function cargarEstado_RecursosBase(){
    const guardadoRecursos = localStorage.getItem("recursos_total");
    const guardadoBase = localStorage.getItem("base");

    if (guardadoRecursos && guardadoBase){
        const recursos = JSON.parse(guardadoRecursos);
        const datosBase = JSON.parse(guardadoBase);

        for (let clave in recursos_total){
            if (clave === "materiales"){
                recursos_total.materiales = recursos.materiales;
            }
            else{
                recursos_total[clave] = recursos[clave];
            }
        }

        for (let clave in base){
            base[clave] = datosBase[clave];
        }
    }
}

function calcularEsperanzaVida(){
    const total = recursos_total.alimento + recursos_total.agua + recursos_total.medicamentos;
    return Math.floor(total / base.supervivientes);
}

function actualizar_EstadoRecursos(){
    alimento.textContent = recursos_total.alimento;
    agua.textContent = recursos_total.agua;
    medicamentos.textContent = recursos_total.medicamentos;
    madera.textContent = recursos_total.materiales[0];
    piedra.textContent = recursos_total.materiales[1];
    tela.textContent = recursos_total.materiales[2];
    armas.textContent = recursos_total.armas
    defensas.textContent = recursos_total.defensas

    spanSupervivientes.textContent = base.supervivientes;
    spanDiasPosibles.textContent = calcularEsperanzaVida();
}

function printMensaje(mensaje){
    const nuevoMensaje = document.createElement("p");
    nuevoMensaje.textContent = mensaje;
    prints.appendChild(nuevoMensaje);
}

function recolectarRecursos(event){
    event.preventDefault(); // Evita recargar la página

    const datos = new FormData(formRecoleccion);

    recursos_total.alimento += parseInt(datos.get("alimento")) || 0;
    recursos_total.agua += parseInt(datos.get("agua")) || 0;
    recursos_total.medicamentos += parseInt(datos.get("medicamentos")) || 0;
    recursos_total.materiales[0] += parseInt(datos.get("madera")) || 0;
    recursos_total.materiales[1] += parseInt(datos.get("piedra")) || 0;
    recursos_total.materiales[2] += parseInt(datos.get("tela")) || 0;
    recursos_total.armas += parseInt(datos.get("armas")) || 0;
    recursos_total.defensas += parseInt(datos.get("defensas")) || 0;

    base.seguridad = recursos_total.armas + recursos_total.defensas;

    printMensaje("Recursos recolectados exitosamente.");
    actualizar_EstadoRecursos();
    guardarEstado_RecursosBase();
    formRecoleccion.reset();
}


function simularDia(){
    const dias = parseInt(inputDias.value);
    if (isNaN(dias) || dias <= 0) {
        printMensaje("⚠ Ingresá un número válido de días.");
        return;
    }
    inputDias.value = ''
    inputDias.focus()
    const peligro = Math.floor(Math.random() * (dias + base.seguridad + 5));

    if (peligro >= base.seguridad) {
        base.supervivientes = Math.max(0, base.supervivientes - 2);
        printMensaje("❌ ¡Sufrimos un ataque! Perdimos 2 supervivientes.");

        recursos_total.alimento = Math.max(0, recursos_total.alimento - 2);
        recursos_total.agua = Math.max(0, recursos_total.agua - 1);
        recursos_total.medicamentos = Math.max(0, recursos_total.medicamentos - 1);
        recursos_total.materiales[0] = Math.max(0, recursos_total.materiales[0] - 3);
        recursos_total.materiales[1] = Math.max(0, recursos_total.materiales[1] - 2);
        recursos_total.materiales[2] = Math.max(0, recursos_total.materiales[2] - 1);
        recursos_total.armas = Math.max(0, recursos_total.armas - 1);
        recursos_total.defensas = Math.max(0, recursos_total.defensas - 1);

        base.seguridad = recursos_total.armas + recursos_total.defensas;
    }

    const consumo = {
        alimento: 1,
        agua: 1,
        medicamentos: 0.2
    };

    recursos_total.alimento = Math.max(0, recursos_total.alimento - consumo.alimento * base.supervivientes * dias);
    recursos_total.agua = Math.max(0, recursos_total.agua - consumo.agua * base.supervivientes * dias);
    recursos_total.medicamentos = Math.max(0, recursos_total.medicamentos - consumo.medicamentos * base.supervivientes * dias);

    printMensaje(`📆 Día simulado: ${dias} día(s). Consumo y eventos actualizados.`);
    actualizar_EstadoRecursos();
    guardarEstado_RecursosBase();

    if (base.supervivientes <= 0) {
        printMensaje("💀 ¡Todos los supervivientes han muerto! Reiniciá la simulación.");
        
        const botonReset = document.createElement("button");
        botonReset.textContent = "Reiniciar Simulación";
        prints.appendChild(botonReset);
        botonReset.addEventListener("click", () => {
            reiniciarSimulacion();
            botonReset.remove();
        });
    }
}

function reiniciarSimulacion(){
    recursos_total.alimento = 20;
    recursos_total.agua = 10;
    recursos_total.medicamentos = 5;
    recursos_total.materiales = [20, 10, 5]; // madera, piedra, tela
    recursos_total.armas = 10;
    recursos_total.defensas = 4;

    base.supervivientes = 10;
    base.seguridad = recursos_total.armas + recursos_total.defensas;

    // Limpiar mensajes
    prints.innerHTML = "";

    actualizar_EstadoRecursos();
    guardarEstado_RecursosBase();

    printMensaje("🔄 ¡Simulación reiniciada! Todo vuelve a su estado inicial.");
}


// =============== INICIALIZACIÓN ===============

cargarEstado_RecursosBase();
actualizar_EstadoRecursos();

formRecoleccion.addEventListener("submit", recolectarRecursos);
btnSimular.addEventListener("click", simularDia);