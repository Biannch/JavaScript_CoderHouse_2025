document.addEventListener("DOMContentLoaded", () => {
  const usuarioGuardado = localStorage.getItem("usuarioActual");

  if (usuarioGuardado) {
    const usuario = JSON.parse(usuarioGuardado);
    mostrarLogin();
  } else {
    mostrarSignUp();
  }
});

function mostrarSignUp(){
  const contenedor = document.getElementById("mainContainer");

  contenedor.innerHTML = `
        <div class="inicio-container">
            <form class="inicio-form" id="inicioForm">
            <h2>Crear cuenta</h2>

            <label for="nombre">Nombre de usuario</label>
            <input type="text" id="nombre" required>

            <label for="cuenta">Número de Cuenta</label>
            <input type="text" id="cuenta" required>

            <label for="pin">PIN</label>
            <input type="password" id="pin" required>

            <button type="submit">Ingresar</button>
            </form>
        </div>
  `;

  const form = document.getElementById("inicioForm");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const nombre = document.getElementById("nombre").value;
    const cuenta = document.getElementById("cuenta").value;
    const pin = document.getElementById("pin").value;
    const usuario = { nombre, cuenta, pin };

    // Guardar en localStorage como sesión
    localStorage.setItem("usuarioActual", JSON.stringify(usuario));
    location.reload();

    // // Guardar en usuarios.json -----------> pendiente
  })
}

function mostrarLogin() {
  const contenedor = document.getElementById("mainContainer");

  contenedor.innerHTML = `
        <div class="inicio-container">
            <form class="inicio-form" id="inicioForm">
            <h2>Inicio de Sesión</h2>

            <label for="cuenta">Número de Cuenta</label>
            <input type="text" id="cuenta" required>

            <label for="pin">PIN</label>
            <input type="password" id="pin" required>

            <div id="loginError" style="color: red; margin-bottom: 20px"></div>

            <button type="submit">Ingresar</button>
            </form>
        </div>
  `;

  const form = document.getElementById("inicioForm");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const cuenta = document.getElementById("cuenta").value;
    const pin = document.getElementById("pin").value;
    const usuarioGuardado = localStorage.getItem("usuarioActual");
    const errorDiv = document.getElementById("loginError");

    if (usuarioGuardado) {
      const usuario = JSON.parse(usuarioGuardado);
      if (usuario.cuenta === cuenta && usuario.pin === pin){
        mostrarHomeBanking(usuario);
      } else {
        errorDiv.textContent = "Número de cuenta o PIN incorrectos.";
      }
    } else {
      errorDiv.textContent = "No hay usuarios registrados. Por favor, crea una cuenta.";
    }
  });
}

function mostrarHomeBanking(usuario) {
  const contenedor = document.getElementById("mainContainer");

  // Simulamos un saldo para mostrar
  const saldo = localStorage.getItem("saldo") || 150000;

  contenedor.innerHTML = `
    <section class="homebanking-presentacion">
      <div class="homebanking-header">
        <div>
          <h2>Bienvenido, ${usuario.nombre}!</h2>
          <button id="cerrarSesionBtn" class="accionBtn">Cerrar Sesión</button>
          <button id="eliminarCuentaBtn" class="accionBtn">Eliminar cuenta</button>
        </div>
        <div class="datos-usuario">
          <p><strong>Número de Cuenta:</strong> ${usuario.cuenta}</p>
          <p><strong>Saldo disponible:</strong> $${usuario.saldo}</p>
        </div>
      </div>
    </section>

    <section class="homebanking-acciones">
      <h3>Acciones Disponibles</h3>
      <button onclick="realizarTransferencia()">Realizar Transferencia</button>
      <button onclick="verHistorial()">Ver Historial</button>
      <button onclick="depositarDinero()">Depositar Dinero</button>
    </section>
  `;

  document.getElementById("cerrarSesionBtn").addEventListener("click", () => {
    mostrarLogin();
  });
  document.getElementById("eliminarCuentaBtn").addEventListener("click", () => {
    localStorage.removeItem("usuarioActual")
    location.reload();
  });

  document.getElementById("btnTransferencia").addEventListener("click", mostrarTransferencia);
  document.getElementById("btnHistorial").addEventListener("click", mostrarHistorial);
  document.getElementById("btnDeposito").addEventListener("click", mostrarDeposito);
}

