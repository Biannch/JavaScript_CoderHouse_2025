import { mostrarHomeBanking } from "./homebanking.js";

document.addEventListener("DOMContentLoaded", () => {
  const usuarioGuardado = localStorage.getItem("usuarioActual");
  if (usuarioGuardado) {
    mostrarSignUp();
  } else {
    mostrarSignUp();
  }
});

export function mostrarSignUp(){
  const contenedor = document.getElementById("mainContainer");

  contenedor.innerHTML = `
    <div class="inicio-container">
        <img src="https://cdn-icons-png.flaticon.com/512/2910/2910766.png" class="logo-banco">
        <form class="inicio-form" id="inicioForm">
        <h2>Crear cuenta</h2>
        <label for="nombre">Nombre de usuario</label>
        <input type="text" id="nombre" required value="Fernando Gomez">
        <label for="cuenta">Número de Cuenta</label>
        <input type="text" id="cuenta" required value="102103">
        <label for="pin">PIN</label>
        <input type="password" id="pin" required value="1234">
        <button type="submit">Registrar</button>
        <p>¿Ya tienes cuenta? <a href="#" id="irLogin">Inicia sesión aquí</a></p>
        </form>
    </div>
  `;

  document.getElementById("irLogin").addEventListener("click", (e) => {
    e.preventDefault();
    mostrarLogin();
  });

  document.getElementById("inicioForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const nombre = document.getElementById("nombre").value;
    const cuenta = document.getElementById("cuenta").value;
    const pin = document.getElementById("pin").value;
    
    if ((/\d/.test(nombre)) || (nombre.trim() == "")){
      Swal.fire({ icon: "error", title: "Error!", text: "El nombre no debe contener números o estar vacío" });
      return;
    }

    if ((pin.length < 4) || (pin.trim() == "") || (!/^\d+$/.test(pin))){
      Swal.fire({ icon: "error", title: "Error!", text: "El PIN debe contener solo números y tener al menos 4 dígitos" });
      return;
    }
    
    if((cuenta.length < 6) || (cuenta.trim() == "") || (!/^\d+$/.test(cuenta))){
      Swal.fire({ icon: "error", title: "Error!", text: "La cuenta debe contener solo números y tener al menos 6 dígitos" });
      return;
    }

    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const existe = usuarios.some(u => u.cuenta === cuenta);
    if (existe) {
      Swal.fire({ icon: "error", title: "Error!", text: "Ese número de cuenta ya está registrado" });
      return;
    }

    const saldo = 1500;
    const historial = [];
    const usuario = { nombre, cuenta, pin, saldo, historial };

    usuarios.push(usuario);
    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    // --- Marcar este como actual ---
    localStorage.setItem("usuarioActual", cuenta);

    // creo usuario aux para facilitar testeos
    const nuevoUsuario = {
      nombre: "Bianca Chiaramello",
      cuenta: "102001",
      pin: "1010101",
      saldo: 10000,
      historial: []
    };
    usuarios.push(nuevoUsuario);
    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    mostrarLogin();
  });
}

export function mostrarLogin(){
  const contenedor = document.getElementById("mainContainer");

  contenedor.innerHTML = `
    <div class="inicio-container">
      <img src="https://cdn-icons-png.flaticon.com/512/2910/2910766.png" class="logo-banco">
        <form class="inicio-form" id="inicioForm">
        <h2>Inicio de Sesión</h2>
        <label for="cuenta">Número de Cuenta</label>
        <input type="text" id="cuenta" required value = "102103">
        <label for="pin">PIN</label>
        <input type="password" id="pin" required value = "1234">
        <button type="submit">Ingresar</button>
        <p>¿No tienes cuenta? <a href="#" id="irSignUp">Crea una aquí</a></p>
        </form>
    </div>
  `;

  document.getElementById("irSignUp").addEventListener("click", (e) => {
    e.preventDefault();
    mostrarSignUp();
  });

  document.getElementById("inicioForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const cuenta = document.getElementById("cuenta").value;
    const pin = document.getElementById("pin").value;

    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    const usuario = usuarios.find(u => u.cuenta === cuenta && u.pin === pin);

    if (usuario) {
      localStorage.setItem("usuarioActual", cuenta);
      mostrarHomeBanking(usuario);
    } else {
      Swal.fire({ icon: "error", title: "Error!", text: "Cuenta o pin incorrectos." });
    }
  });
}