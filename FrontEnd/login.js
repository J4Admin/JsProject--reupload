// correspond à la page de connexion
// import des variables depuis config.js

import { apiUrl } from "./config.js";

// Variables globales
const formLogin = document.getElementById("formlogin");
let submitEmail = document.getElementById("email");
let submitPassword = document.getElementById("password");
const errorSubmit = document.getElementById("error-message");

// Test Formulaire
// Test l'adresse email soummit
function checkEmail(submitEmail) {
  const emailRegExp = new RegExp("[a-z0-9._-]+@[a-z0-9._-]+\\.[a-z0-9._-]+");

  if (emailRegExp.test(submitEmail.value)) {
    return true;
  } else {
    errorSubmit.classList.add("display-message");
    return false;
  }
}

// Test le password soummit
function checkPassword(submitPassword) {
  const passwordRegExp = new RegExp("^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d).{6,}$");

  if (passwordRegExp.test(submitPassword.value)) {
    return true;
  } else {
    errorSubmit.classList.add("display-message");
    return false;
  }
}

async function loginSucces() {
  const adminAcess = await fetch(`${apiUrl}/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    // Converti les data au format JSON
    body: JSON.stringify({
      email: submitEmail.value,
      password: submitPassword.value,
    }),
  });

  // Recuperation  de la reponse API
  const response = await adminAcess.json();

  // Verifie si la valeur du POST est "OK" (=RegEx)
  if (adminAcess.ok) {
    // conserve les données ( valeurs ) lié au token et userId
    // contenu dans la réponse Post, à l'interieur de l'espace Local
    window.localStorage.setItem("userId", response.userId);
    window.localStorage.setItem("token", response.token);

    // redirection vers la page " homepage_edit".
    document.location.href = "http://127.0.0.1:5500/FrontEnd/index.html";
  }
}

// Ecoute les sumbits du formulaire
formLogin.addEventListener("submit", (event) => {
  // Empêche le comportement par défaut du submit
  event.preventDefault();

  // Recuperation des valeur bolean, des submit testé.
  const emailTrue = checkEmail(submitEmail);
  const passwordTrue = checkPassword(submitPassword);

  // appel la fonction loginSucces, sous condition bolean.
  if (emailTrue === true && passwordTrue === true) {
    loginSucces();
  }
});
