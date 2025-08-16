import { mostrarHomeBanking } from "./homebanking.js";

document.addEventListener("DOMContentLoaded", () => {
  const usuarioGuardado = localStorage.getItem("usuarioActual");
  if (usuarioGuardado) {
    mostrarLogin();
  } else {
    mostrarSignUp();
  }
});

export function mostrarSignUp() {
  const contenedor = document.getElementById("mainContainer");

  contenedor.innerHTML = `
    <div class="inicio-container">
        <img src="https://cdn-icons-png.flaticon.com/512/2910/2910766.png" class="logo-banco">
        <form class="inicio-form" id="inicioForm">
        <h2>Crear cuenta</h2>
        <label for="nombre">Nombre de usuario</label>
        <input type="text" id="nombre" required value="Fernando Gomez">
        <label for="cuenta">Número de Cuenta</label>
        <input type="text" id="cuenta" required value="00001">
        <label for="pin">PIN</label>
        <input type="password" id="pin" required value="1234">
        <button type="submit">Ingresar</button>
        </form>
    </div>
  `;

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

    const saldo = 1500;
    const historial = [];
    const usuario = { nombre, cuenta, pin, saldo, historial };

    localStorage.setItem("usuarioActual", JSON.stringify(usuario));
    location.reload();
  });
}

export function mostrarLogin() {
  const contenedor = document.getElementById("mainContainer");
  const usuarioGuardado = JSON.parse(localStorage.getItem("usuarioActual"));

  contenedor.innerHTML = `
    <div class="inicio-container">
      <img src="https://cdn-icons-png.flaticon.com/512/2910/2910766.png" class="logo-banco">
        <form class="inicio-form" id="inicioForm">
        <h2>Inicio de Sesión</h2>
        <label for="cuenta">Número de Cuenta</label>
        <input type="text" id="cuenta" required value="${usuarioGuardado.cuenta}">
        <label for="pin">PIN</label>
        <input type="password" id="pin" required value="${usuarioGuardado.pin}">
        <button type="submit">Ingresar</button>
        </form>
    </div>
  `;

  document.getElementById("inicioForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const cuenta = document.getElementById("cuenta").value;
    const pin = document.getElementById("pin").value;
    const usuarioGuardado = localStorage.getItem("usuarioActual");

    if (usuarioGuardado) {
      const usuario = JSON.parse(usuarioGuardado);
      if (usuario.cuenta === cuenta && usuario.pin === pin) {
        mostrarHomeBanking(usuario);
      } else {
        Swal.fire({ icon: "error", title: "Error!", text: "Cuenta o pin incorrectos." });
      }
    }
  });
}