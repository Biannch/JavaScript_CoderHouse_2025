// === homebanking.js ===
export class Movimientos {
  constructor(operacion, monto, cuentaDestino = null) {
    this.fecha = new Date().toLocaleString();
    this.operacion = operacion;
    this.monto = monto;
    this.cuentaDestino = cuentaDestino;
  }
}

export function mostrarHomeBanking(usuario) {
  const contenedor = document.getElementById("mainContainer");

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

  document.getElementById("cerrarSesionBtn").addEventListener("click", () => location.reload());
  document.getElementById("eliminarCuentaBtn").addEventListener("click", () => {
    localStorage.removeItem("usuarioActual");
    location.reload();
  });

  document.getElementById("btnTransferencia").addEventListener("click", () => realizarTransferencia(usuario));
  document.getElementById("btnHistorial").addEventListener("click", () => verHistorial());
  document.getElementById("btnDepositar").addEventListener("click", () => depositarDinero(usuario));
}

function realizarTransferencia(usuario) {
  const container = document.getElementById("accionesForm");
  container.innerHTML = `
    <h3>Realizar Transferencia</h3>
    <form id="formTransferencia">
      <input type="text" placeholder="Cuenta destino" id="cuentaDestino" required>
      <input type="number" placeholder="Monto a transferir" id="montoTransferencia" required min="1">
      <button type="submit">Transferir</button>
    </form>
  `;

  document.getElementById("formTransferencia").addEventListener("submit", function (e) {
    e.preventDefault();
    const cuentaDestino = document.getElementById("cuentaDestino").value.trim();
    const monto = parseFloat(document.getElementById("montoTransferencia").value);

    if (cuentaDestino === usuario.cuenta || monto <= 0 || isNaN(monto) || usuario.saldo < monto) {
      Swal.fire({ icon: "error", title: "Error!", text: "Verifica los datos ingresados." });
      return;
    }

    usuario.saldo -= monto;
    actualizarSaldo(usuario);

    const movimiento = new Movimientos("Transferencia", monto, cuentaDestino);
    guardarTransaccion(movimiento);
    container.innerHTML = `<p>Transferencia realizada exitosamente.</p>`;
  });
}

function verHistorial() {
  const container = document.getElementById("historialContainer");
  const usuario = JSON.parse(localStorage.getItem("usuarioActual"));

  if (!usuario || !usuario.historial || usuario.historial.length === 0) {
    container.innerHTML = `<p>No hay transacciones registradas.</p>`;
    return;
  }

  container.innerHTML = `
    <h3>Historial de Transacciones</h3>
    <ul>
      ${usuario.historial.map(t => `
        <li>
          ${t.fecha} - ${t.operacion} ${t.cuentaDestino ? `a cuenta ${t.cuentaDestino}` : ""}: $${t.monto}
        </li>
      `).join("")}
    </ul>
  `;
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
      Swal.fire({ icon: "error", title: "Error!", text: "Monto inválido." });
      return;
    }

    usuario.saldo += monto;
    actualizarSaldo(usuario);
    const movimiento = new Movimientos("Deposito", monto);
    guardarTransaccion(movimiento);
    container.innerHTML = `<p>Depósito realizado exitosamente.</p>`;
  });
}

function actualizarSaldo(usuario) {
  document.getElementById("saldo").textContent = usuario.saldo;
  localStorage.setItem("usuarioActual", JSON.stringify(usuario));
}

function guardarTransaccion(movimiento) {
  const usuario = JSON.parse(localStorage.getItem("usuarioActual"));
  usuario.historial.push(movimiento);
  localStorage.setItem("usuarioActual", JSON.stringify(usuario));
}