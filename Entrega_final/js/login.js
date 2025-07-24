document.addEventListener("DOMContentLoaded", () => {
  const usuarioGuardado = localStorage.getItem("usuarioActual");

  if (usuarioGuardado) {
    const usuario = JSON.parse(usuarioGuardado);
    mostrarHomeBanking(usuario); // A definir después
  } else {
    mostrarLogin();
  }
});

function mostrarLogin() {
  const contenedor = document.getElementById("mainContainer");

  contenedor.innerHTML = `
        <div class="login-container">
            <form class="login-form">
            <h2>Inicio de Sesión</h2>

            <label for="cuenta">Número de Cuenta</label>
            <input type="text" id="cuenta" required>

            <label for="pin">PIN</label>
            <input type="password" id="pin" required>

            <button type="submit">Ingresar</button>
            </form>
        </div>
  `;
}