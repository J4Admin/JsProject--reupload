// correspond à l'Edition des traveaux, gestion modales.
// import des variables/fonction depuis config.js
import { apiUrl, addModalForm } from "./config.js";

// Variables globales
const editWorkSection = document.querySelector(".edit-work");
const asideModal = document.getElementById("modal-aside");
const btnBack = document.querySelector(".modal-arrow");

let isCheckForm = true;
let isModal1 = false;
let isModal2 = false;
let xModal2 = false;

// Récupére les travaux, depuis l'api
async function getWorks() {
  const worksArchitect = await fetch(`${apiUrl}/works`);
  return await worksArchitect.json();
}

// Afiche les travaux dans la modal 1
async function viewEditWork(category = "defaults") {
  const arrayWorks = await getWorks();

  editWorkSection.innerHTML = "";

  arrayWorks.forEach((element) => {
    const figure = document.createElement("figure");
    const img = document.createElement("img");
    const figcaption = document.createElement("figcaption");
    const icone = document.createElement("icone");

    icone.classList.add("fa-solid", "fa-trash-can", "ico-editwork");
    figure.classList.add("work");

    icone.id = element.id;
    img.src = element.imageUrl;
    figcaption.textContent = element.title;

    figure.appendChild(icone);
    figure.appendChild(img);
    figure.appendChild(figcaption);
    editWorkSection.appendChild(figure);
  });
  deleteWorks();
  isModal1 = true;
}

// Affiche la modal 1
function getModalDisplay() {
  const btnEdit = document.querySelector(".btn-edit");
  const btnRedirectAdd = document.querySelector(".modal-input");

  btnEdit.addEventListener("click", (event) => {
    event.preventDefault();

    if (event) {
      asideModal.classList.add("display-modal");
      btnBack.classList.add("hidden");
    }
    if (isModal1 === false && isModal2 === false) {
      viewEditWork();
    }
    if (isModal2 === false) {
      isModal1 = true;
      isModal2 = false;
    }
  });
}

getModalDisplay();

//Fait disparaitre la modal, lors d'un clic hors modale.
function getModalHide() {
  const btnClose = document.querySelector(".btn-close");
  const modalWrapper = document.querySelector(".modal-wrapper");

  modalWrapper.addEventListener("click", function (e) {
    e.stopPropagation();
  });

  asideModal.addEventListener("click", (e) => {
    // Affiche la modal
    asideModal.classList.remove("display-modal");
  });

  btnClose.addEventListener("click", function (ev) {
    asideModal.classList.remove("display-modal");
    isModal2 = false;
  });
}

getModalHide();

// Permet le bascullement, entre les deux vues.
function toggleModals(showViewOne, showViewTwo) {
  const viewOne = document.querySelectorAll(".modal1");
  const viewTwo = document.querySelectorAll(".modal2");

  viewOne.forEach((element) => {
    if (showViewOne) {
      element.classList.remove("hidden");
    } else {
      element.classList.add("hidden");
    }
  });

  viewTwo.forEach((element) => {
    if (!element.classList.contains("modal-arrow")) {
      if (showViewTwo) {
        element.classList.remove("hidden");
      } else {
        element.classList.add("hidden");
      }
    }
  });

  if (btnBack) {
    btnBack.classList.toggle("hidden", !showViewTwo);
  }
}
// Permet de revenir, à la premiere vue.
function getModalBack() {
  if (btnBack) {
    btnBack.addEventListener("click", function () {
      toggleModals(true, false);
    });
  }
}

function redirectAddModal() {
  const btnRedirectAdd = document.querySelector(".modal-input");
  const h2FirstModal = document.getElementById("modal1-h2");

  if (btnRedirectAdd) {
    btnRedirectAdd.addEventListener("click", () => {
      btnRedirectAdd.classList.add("hidden");
      h2FirstModal.classList.add("hidden");
      editWorkSection.classList.add("hidden");
      // Crée la seconde view.
      if (!xModal2) {
        addModalForm();
        xModal2 = true;
      }

      toggleModals(false, true);
    });
  }
}

getModalBack();
redirectAddModal();

// Ajout d'un Observer

const observer = new MutationObserver((mutationsList, observer) => {
  // ajout attribut mutation à la liste des mutation
  for (let mutation of mutationsList) {
    // Si une mutation de type Liste d'Enfant est observé
    if (mutation.type === "childList") {
      // stock dans newModal tout nouveaux éléments,
      // comprennant la class modal2, ajouté au DOM.
      const newModals = Array.from(mutation.addedNodes).filter(
        (node) => node.classList && node.classList.contains("modal2")
      );
      // Appel différentes fonctions , sous condition que les élément "modal2"
      // sont présent dans le DOM
      if (newModals.length > 0) {
        redirectAddModal();
        viewSubImage();
        checkSubmit();

        observer.disconnect();
        break;
      }
    }
  }
});

observer.observe(document.body, { childList: true, subtree: true });

// Supression de travaux
function deleteWorks(work) {
  const iconeAllWorks = document.querySelectorAll(".ico-editwork");
  const token = window.localStorage.getItem("token");

  iconeAllWorks.forEach((work) => {
    work.addEventListener("click", async (e) => {
      e.preventDefault;
      const id = work.id;
      const init = {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      try {
        const deletingWork = await fetch(`${apiUrl}/works/${id}`, init);

        if (!deletingWork.ok) {
          throw new Error(
            "erreur reçu depuis l'API " + deletingWork.statusText
          );
        } else {
          alert("Le travail sélectionné a été supprimé !");
        }

        // Affiche dynamiquement les travaux
        viewEditWork();
      } catch (error) {
        console.error("Erreur:", error);
        alert("Erreur : " + error.message);
      }
    });
  });
}

// Ajout de travaux

// Affiche l'image (file), envoyer par l'utilisateur.

function viewSubImage() {
  const imageModal2 = document.querySelector(".div-modal2 img");
  const iconeModal2 = document.querySelector(".div-modal2 i");
  const inputFile = document.querySelector(".div-modal2 input");
  const infoForm = document.querySelector(".div-modal2 p");
  const modalBtn = document.querySelector(".div-modal2 label");

  inputFile.addEventListener("change", () => {
    const file = inputFile.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        imageModal2.src = e.target.result;

        // Cache les éléments présent initialement, dans .div-modal2

        iconeModal2.classList.add("hidden");
        inputFile.classList.add("hidden");
        modalBtn.classList.add("hidden");
        infoForm.classList.add("hidden");
        imageModal2.classList.remove("hidden");
      };
      reader.readAsDataURL(file);
    }
  });
}

// Gestion des données fournies, par l'utilisateur.
async function checkSubmit() {
  const token = localStorage.getItem("token");
  const subImage = document.getElementById("input-file");
  const subCategory = document.getElementById("categorie");
  const subTitle = document.getElementById("titre");
  const errorSubmit2 = document.getElementById("error-message2");
  const checkBtn = document.querySelector(".valider-btn");
  const formModal2 = document.querySelector(".modal-wrapper form");

  let isCheckForm = false;

  // Test la véracité des informations déposées dans le formulaire.

  // active ou désactive la soumission du formulaire.
  formModal2.addEventListener("input", (e) => {
    e.preventDefault();

    if (
      subImage.value !== "" &&
      subTitle.value !== "" &&
      subCategory.value !== ""
    ) {
      checkBtn.classList.add("color-green");
      checkBtn.classList.remove("color-grey");
      checkBtn.disabled = false;
      isCheckForm = true;
    } else {
      checkBtn.classList.add("color-grey");
      checkBtn.classList.remove("color-green");
      checkBtn.disabled = true;
      isCheckForm = false;
    }
  });

  // Soummet le formulaire, lors d'un clic
  checkBtn.addEventListener("click", async (event) => {
    event.preventDefault();
    // Si le formulaire ne répond pas aux exigeances, affiche un message d'erreur
    if (!isCheckForm) {
      errorSubmit2.classList.remove("hidden");
      // Sinon cache le message d'erreur et soumet le formulaire.
    } else {
      errorSubmit2.classList.add("hidden");

      // crée une variable contenant le FormData
      let formData = new FormData();

      // inclut au formData plusieurs paires (clé, valeur)
      formData.append("image", subImage.files[0]);
      formData.append("title", subTitle.value);
      formData.append("category", subCategory.value);

      // Option du fetch
      const option = {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      };

      // Stock la réponse ( addinNewWork), de l'API.
      try {
        const addingNewWork = await fetch(`${apiUrl}/works/`, option);
        // Si la réponse n'est pas correct, renvoie l'erreur.
        if (!addingNewWork.ok) {
          throw new Error("erreur reçu depuis API " + addingNewWork.statusText);
        } else {
          // Sinon, confirme l'envoie
          const data = await addingNewWork.json();
          alert("Le nouveau travail vient d'être ajouté !", data);
        }

        // Affiche dynamiquement la nouvelle image
        viewEditWork();
      } catch (error) {
        console.error("Erreur:", error);
        alert("Erreur : " + error.message);
      }
    }
  });
}
