document.addEventListener("DOMContentLoaded", () => {
  const usuarioGuardado = localStorage.getItem("usuarioActual");

  if (usuarioGuardado) {
    const usuario = JSON.parse(usuarioGuardado);
    mostrarHomeBanking(usuario)
    // mostrarLogin();
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
    const saldo = 0;
    const usuario = { nombre, cuenta, pin, saldo};

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
          <h2>Hola, ${usuario.nombre}!</h2>
          <button id="cerrarSesionBtn" class="accionBtn">Cerrar Sesión</button>
          <button id="eliminarCuentaBtn" class="accionBtn">Eliminar cuenta</button>
        </div>
        <div class="datos-usuario">
          <p><strong>Número de Cuenta:</strong> ${usuario.cuenta}</p>
          <p><strong>Saldo disponible:</strong> $<span id="saldo">${usuario.saldo}</span></p>
        </div>
      </div>
    </section>

    <section class="homebanking-acciones">
      <h3>Acciones Disponibles</h3>
      <button id="btnTransferencia">Realizar Transferencia</button>
      <button id="btnHistorial">Ver Historial</button>
      <button id="btnDepositar">Depositar Dinero</button>
    </section>

    <div id="accionesForm"></div>
    <div id="historialContainer"></div>
  `;

  document.getElementById("cerrarSesionBtn").addEventListener("click", () => {
    mostrarLogin();
  });
  document.getElementById("eliminarCuentaBtn").addEventListener("click", () => {
    localStorage.removeItem("usuarioActual")
    location.reload();
  });

  document.getElementById("btnTransferencia").addEventListener("click", () => realizarTransferencia(usuario));
  document.getElementById("btnHistorial").addEventListener("click", () => verHistorial(usuario));
  document.getElementById("btnDepositar").addEventListener("click", () => depositarDinero(usuario));
}

function realizarTransferencia(usuario){
  const container = document.getElementById("accionesForm");
  container.innerHTML = `
    <h3>Realizar Transferencia</h3>
    <form id="formTransferencia">
      <input type="text" placeholder="Cuenta destino" id="cuentaDestino" required>
      <input type="number" placeholder="Monto a transferir" id="montoTransferencia" required min="1">
      <button type="submit">Transferir</button>
    </form>
    <div id="transferenciaError" style="color: red; margin-top: 10px"></div>
  `;

  document.getElementById("formTransferencia").addEventListener("submit", function (e) {
    e.preventDefault();
    const cuentaDestino = document.getElementById("cuentaDestino").value.trim();
    const monto = parseFloat(document.getElementById("montoTransferencia").value);
    const errorDiv = document.getElementById("transferenciaError");

    if (cuentaDestino === usuario.cuenta) {
      errorDiv.textContent = "No puedes transferir a tu propia cuenta.";
      return;
    }
    if (monto <= 0 || isNaN(monto)) {
      errorDiv.textContent = "Monto inválido.";
      return;
    }
    if (usuario.saldo < monto) {
      errorDiv.textContent = "Saldo insuficiente.";
      return;
    }

    usuario.saldo -= monto;
    actualizarSaldo(usuario);
    guardarTransaccion(usuario, `Transferencia a cuenta ${cuentaDestino}`, -monto);
    container.innerHTML = `<p>Transferencia realizada exitosamente.</p>`;
  });
}

function depositarDinero(usuario) {
  const container = document.getElementById("accionesForm");
  container.innerHTML = `
    <h3>Depositar Dinero</h3>
    <form id="formDeposito">
      <input type="number" placeholder="Monto a depositar" id="montoDeposito" required min="1">
      <button type="submit">Depositar</button>
    </form>
  `;

  document.getElementById("formDeposito").addEventListener("submit", function (e) {
    e.preventDefault();
    const monto = parseFloat(document.getElementById("montoDeposito").value);

    if (monto <= 0) {
      alert("Monto inválido.");
      return;
    }

    usuario.saldo += monto;
    actualizarSaldo(usuario);
    guardarTransaccion(usuario, `Depósito realizado`, monto);
    document.getElementById("accionesForm").innerHTML = `<p>Depósito realizado exitosamente.</p>`;
  });
}

function verHistorial(usuario) {
  const container = document.getElementById("historialContainer");
  const historial = JSON.parse(localStorage.getItem(`historial_${usuario.cuenta}`)) || [];

  if (historial.length === 0) {
    container.innerHTML = `<p>No hay transacciones registradas.</p>`;
    return;
  }

  container.innerHTML = `
    <h3>Historial de Transacciones</h3>
    <ul>
      ${historial.map(t => `<li>${t.fecha} - ${t.descripcion}: $${t.monto}</li>`).join("")}
    </ul>
  `;
}

// === Utilidades ===

function actualizarSaldo(usuario) {
  document.getElementById("saldo").textContent = usuario.saldo;
  // Actualiza también el usuario en localStorage
  localStorage.setItem("usuarioActual", JSON.stringify(usuario));
}

function guardarTransaccion(usuario, descripcion, monto) {
  const historialKey = `historial_${usuario.cuenta}`;
  const historial = JSON.parse(localStorage.getItem(historialKey)) || [];

  historial.push({
    fecha: new Date().toLocaleString(),
    descripcion: descripcion,
    monto: monto
  });

  localStorage.setItem(historialKey, JSON.stringify(historial));
}