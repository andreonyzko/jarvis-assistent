const configBtn = document.querySelector("#config-icon");
const configModal = document.querySelector("#config-container");
const configCloseModalBtn = document.querySelector("#close-config-btn");
const configForm = document.querySelector("#config-form");

configBtn.addEventListener("click", () => {
  configModal.style.display = "block";
});

configCloseModalBtn.addEventListener("click", (e) => {
  e.preventDefault();
  configModal.style.display = "none";
});

configForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const IAkey = document.querySelector("#apikey").value;
  if (!IAkey) return;

  localStorage.setItem("IAkey", IAkey);
});

function getIAkey() {
  return localStorage.getItem("IAkey");
}

function delIAkey() {
  localStorage.removeItem("IAkey");
}
