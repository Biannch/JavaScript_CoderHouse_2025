document.addEventListener("DOMContentLoaded", () => {
  const usuarioGuardado = localStorage.getItem("usuarioActual");

  if (usuarioGuardado) {
    const usuario = JSON.parse(usuarioGuardado);
    mostrarLogin();
    // mostrarHomeBanking(usuario); // A definir después
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


    // mostrarHomeBanking(usuario);
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
      if (usuario.cuenta === cuenta && usuario.pin === pin) {
        // mostrarHomeBanking(usuario);
        location.reload();
      } else {
        errorDiv.textContent = "Número de cuenta o PIN incorrectos.";
      }
    } else {
      errorDiv.textContent = "No hay usuarios registrados. Por favor, crea una cuenta.";
    }
  });
}