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
    <div class="homebanking-presentacion">
      <div class="homebanking-header">
        <h2>Bienvenido, ${usuario.nombre}!</h2>
        <button id="cerrarSesionBtn" class="cerrarSesionBtn">Cerrar Sesión</button>
      </div>
      
      <div class="cuenta-info">
        <p><strong>Número de Cuenta:</strong> ${usuario.cuenta}</p>
        <p><strong>Saldo disponible:</strong> $<span id="saldo">${saldo}</span></p>
      </div>

      <div class="acciones">
        <button id="btnTransferencia">Realizar Transferencia</button>
        <button id="btnHistorial">Ver Historial</button>
        <button id="btnDeposito">Depositar Dinero</button>
      </div>

      <div id="homebankingContenido" class="homebanking-contenido"></div>
    </div>
  `;

  document.getElementById("cerrarSesionBtn").addEventListener("click", () => {
    mostrarLogin();
  });

  document.getElementById("btnTransferencia").addEventListener("click", mostrarTransferencia);
  document.getElementById("btnHistorial").addEventListener("click", mostrarHistorial);
  document.getElementById("btnDeposito").addEventListener("click", mostrarDeposito);
}

// Función mock de transferencia
function mostrarTransferencia() {
  const contenedor = document.getElementById("homebankingContenido");
  contenedor.innerHTML = `
    <h3>Realizar Transferencia</h3>
    <form id="transferenciaForm">
      <label for="destino">Cuenta destino:</label>
      <input type="text" id="destino" required>
      <label for="monto">Monto:</label>
      <input type="number" id="monto" required>
      <button type="submit">Transferir</button>
    </form>
    <div id="mensajeTransferencia"></div>
  `;

  document.getElementById("transferenciaForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const monto = parseFloat(document.getElementById("monto").value);
    const saldoActual = parseFloat(localStorage.getItem("saldo") || 150000);

    if (monto > 0 && monto <= saldoActual) {
      const nuevoSaldo = saldoActual - monto;
      localStorage.setItem("saldo", nuevoSaldo);
      document.getElementById("saldo").textContent = nuevoSaldo;
      document.getElementById("mensajeTransferencia").textContent = "Transferencia exitosa.";
    } else {
      document.getElementById("mensajeTransferencia").textContent = "Saldo insuficiente o monto inválido.";
    }
  });
}

// Mock de historial
function mostrarHistorial() {
  const contenedor = document.getElementById("homebankingContenido");
  contenedor.innerHTML = `
    <h3>Historial de Movimientos</h3>
    <ul>
      <li>+ $10.000 - Depósito</li>
      <li>- $5.000 - Transferencia a Cuenta 123456</li>
      <li>- $3.000 - Pago de servicio</li>
    </ul>
  `;
}

// Mock de depósito
function mostrarDeposito() {
  const contenedor = document.getElementById("homebankingContenido");
  contenedor.innerHTML = `
    <h3>Depositar Dinero</h3>
    <form id="depositoForm">
      <label for="montoDeposito">Monto:</label>
      <input type="number" id="montoDeposito" required>
      <button type="submit">Depositar</button>
    </form>
    <div id="mensajeDeposito"></div>
  `;

  document.getElementById("depositoForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const monto = parseFloat(document.getElementById("montoDeposito").value);
    if (monto > 0) {
      const saldoActual = parseFloat(localStorage.getItem("saldo") || 150000);
      const nuevoSaldo = saldoActual + monto;
      localStorage.setItem("saldo", nuevoSaldo);
      document.getElementById("saldo").textContent = nuevoSaldo;
      document.getElementById("mensajeDeposito").textContent = "Depósito exitoso.";
    } else {
      document.getElementById("mensajeDeposito").textContent = "Monto inválido.";
    }
  });
}