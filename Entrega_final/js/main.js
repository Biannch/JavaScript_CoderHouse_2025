import { mostrarLogin, mostrarSignUp } from "./inicio_sesion.js";
// import { mostrarHomeBanking } from "./homebanking.js";

document.addEventListener("DOMContentLoaded", () => {
  const usuarioGuardado = localStorage.getItem("usuarioActual");
  if (usuarioGuardado) {
    mostrarLogin();
  } else {
    mostrarSignUp();
  }
});