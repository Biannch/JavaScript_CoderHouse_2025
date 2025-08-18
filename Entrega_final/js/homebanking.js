export class Movimientos {
  constructor(operacion, monto, cuentaDestino = null) {
    this.fecha = new Date().toLocaleString();
    this.operacion = operacion;
    this.monto = monto;
    this.cuentaDestino = cuentaDestino;
  }
}

export function mostrarHomeBanking(usuario){
  const contenedor = document.getElementById("mainContainer");
  document.body.style.background = "white"; 

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
        <button id="darkModeToggle" class="accionBtn">🌙 Modo Oscuro</button>        
      </div>
    </section>

    <section id="dolar" class="cotizacion">
      <div class="cotizacion-container">
        <div id="dolarOficial" class="cotizacion-card"></div>
        <div id="dolarBlue" class="cotizacion-card"></div>
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

  actualizarCotizacionDolar();

  document.getElementById("cerrarSesionBtn").addEventListener("click", () => location.reload());

  document.getElementById("eliminarCuentaBtn").addEventListener("click", () => {
    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    usuarios = usuarios.filter(u => u.cuenta !== usuario.cuenta);
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    localStorage.removeItem("usuarioActual");
    location.reload();
  });

  document.getElementById("btnTransferencia").addEventListener("click", () => realizarTransferencia(usuario));
  document.getElementById("btnHistorial").addEventListener("click", () => verHistorial(usuario));
  document.getElementById("btnDepositar").addEventListener("click", () => depositarDinero(usuario));

  document.getElementById("darkModeToggle").addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");

    const btn = document.getElementById("darkModeToggle");
    if (document.body.classList.contains("dark-mode")) {
      btn.textContent = "☀️ Modo Claro";
    } else {
      btn.textContent = "🌙 Modo Oscuro";
    }
  });
}

function realizarTransferencia(usuario) {
  const container = document.getElementById("accionesForm");
  container.innerHTML = `
    <h3>Realizar Transferencia</h3>
    <form id="formTransferencia">
      <label for="cuentaDestino">Cuenta destino:</label>
      <input type="text" placeholder="Cuenta destino" id="cuentaDestino" required value="102001">

      <label for="montoTransferencia">Monto a transferir:</label>
      <input type="number" placeholder="Monto a transferir" id="montoTransferencia" required min="1" value=1000>
      <button type="submit">Transferir</button>
    </form>
  `;

  document.getElementById("formTransferencia").addEventListener("submit", function (e) {
    e.preventDefault();
    
    const cuentaDestino = document.getElementById("cuentaDestino").value.trim();

    if ((cuentaDestino.length < 6) || (!/^\d+$/.test(cuentaDestino))){
      Swal.fire({ icon: "error", title: "Error!", text: "Ingrese un número de cuenta válido!" });
      return;
    }
    const monto = parseFloat(document.getElementById("montoTransferencia").value);

    if(cuentaDestino === usuario.cuenta){
      Swal.fire({ icon: "error", title: "Error!", text: "No puedes transferirte a vos mismo" });
      return;
    }
    
    if(usuario.saldo < monto){
      Swal.fire({ icon: "error", title: "Error!", text: "No tienes fondos suficientes" });
      return;
    }

    if(monto <= 0 || isNaN(monto)){
      Swal.fire({ icon: "error", title: "Error!", text: "Verifica los datos ingresados." });
      return;
    }

    // Buscar cuenta destino
    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    let destinatario = usuarios.find(u => u.cuenta === cuentaDestino);
    if (!destinatario) {
      Swal.fire({ icon: "error", title: "Error!", text: "La cuenta destino no existe." });
      return;
    }

    usuario.saldo -= monto;
    destinatario.saldo += monto;

    const movimiento = new Movimientos("Transferencia", monto, cuentaDestino);
    const movimientoDestino = new Movimientos("Depósito recibido", monto, usuario.cuenta);

    usuario.historial.push(movimiento);
    destinatario.historial.push(movimientoDestino);

    // Actualizar usuarios
    usuarios = usuarios.map(u => u.cuenta === usuario.cuenta ? usuario : u.cuenta === destinatario.cuenta ? destinatario : u);

    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    localStorage.setItem("usuarioActual", JSON.stringify(usuario));

    document.getElementById("saldo").textContent = usuario.saldo;
    container.innerHTML = `<p>Transferencia realizada exitosamente.</p>`;
    verHistorial(usuario);
  });
}

function verHistorial(usuario) {
  const container = document.getElementById("historialContainer");

  if (!usuario || !usuario.historial || usuario.historial.length === 0) {
    container.innerHTML = `<p>No hay transacciones registradas.</p>`;
    return;
  }

  container.innerHTML = `
    <h3>Historial de Transacciones</h3>
    <button id="btnLimpiarHistorial">Limpiar Historial</button>
    <select id="filtroOperacion">
      <option value="todas">Todas</option>
      <option value="Deposito">Depósitos</option>
      <option value="Transferencia">Transferencias</option>
      <option value="Depósito recibido">Depósitos recibidos</option>
    </select>
    <ul id="listaHistorial"></ul>
  `;

  const listaHistorial = document.getElementById("listaHistorial");
  const filtroOperacion = document.getElementById("filtroOperacion");
  const btnLimpiar = document.getElementById("btnLimpiarHistorial");

  function actualizarLista() {
    let historialFiltrado = usuario.historial;
    const tipo = filtroOperacion.value;
    if (tipo !== "todas") {
      listaHistorial.innerHTML = "";
      historialFiltrado = historialFiltrado.filter(t => t.operacion === tipo);
    }

    listaHistorial.innerHTML = "";
    historialFiltrado.forEach(t => {
      const nuevoMovimiento = document.createElement("li");
      nuevoMovimiento.textContent = `${t.fecha} - ${t.operacion} ${t.cuentaDestino ? `, fuente: cuenta ${t.cuentaDestino}` : ""}, monto $${t.monto}`;
      listaHistorial.appendChild(nuevoMovimiento);
    });
  }

  filtroOperacion.addEventListener("change", actualizarLista);

  btnLimpiar.addEventListener("click", () => {
    usuario.historial = [];
    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    usuarios = usuarios.map(u => u.cuenta === usuario.cuenta ? usuario : u);
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    localStorage.setItem("usuarioActual", JSON.stringify(usuario));
    actualizarLista();
  });

  actualizarLista();
}

function depositarDinero(usuario) {
  const container = document.getElementById("accionesForm");
  container.innerHTML = `
    <h3>Depositar Dinero</h3>
    <form id="formDeposito">
      <input type="number" placeholder="Monto a depositar" id="montoDeposito" required min="1" value=15000>
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
    const movimiento = new Movimientos("Deposito", monto);
    usuario.historial.push(movimiento);

    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    usuarios = usuarios.map(u => u.cuenta === usuario.cuenta ? usuario : u);

    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    localStorage.setItem("usuarioActual", JSON.stringify(usuario));

    document.getElementById("saldo").textContent = usuario.saldo;
    container.innerHTML = `<p>Depósito realizado exitosamente.</p>`;
    verHistorial(usuario);
  });
}

function actualizarCotizacionDolar() {
  const contenedorOficial = document.getElementById("dolarOficial");
  const contenedorBlue = document.getElementById("dolarBlue");

  // Fetch Dólar Oficial
  fetch('https://dolarapi.com/v1/dolares/oficial')
    .then(res => {
      if (!res.ok) throw new Error("Error al consultar el dólar oficial");
      return res.json();
    })
    .then(data => {
      contenedorOficial.innerText = `💰 Dólar Oficial: $${data.venta}`;
    })
    .catch(error => {
      contenedorOficial.innerText = "No se pudo obtener el dólar oficial.";
    });

  // Fetch Dólar Blue
  fetch('https://dolarapi.com/v1/dolares/blue')
    .then(res => {
      if (!res.ok) throw new Error("Error al consultar el dólar blue");
      return res.json();
    })
    .then(data => {
      contenedorBlue.innerText = `💵 Dólar Blue: $${data.venta}`;
    })
    .catch(error => {
      contenedorBlue.innerText = "No se pudo obtener el dólar blue.";
    });
}