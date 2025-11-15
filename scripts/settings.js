const configBtn = document.querySelector("#config-icon");
const configModal = document.querySelector("#config-container");
const configCloseModalBtn = document.querySelector("#close-config-btn");
const configForm = document.querySelector("#config-form");
const IAkeyInput = document.querySelector("#apikey");

configBtn.addEventListener("click", () => {
  configModal.style.display = "block";
  IAkeyInput.value = localStorage.getItem("IAkey");
});

configCloseModalBtn.addEventListener("click", (e) => {
  e.preventDefault();
  configModal.style.display = "none";
});

configForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const IAkey = IAkeyInput.value;
  
  if (!IAkey) return;
  localStorage.setItem("IAkey", IAkey);

  configModal.style.display = "none";
});

function getIAkey() {
  return localStorage.getItem("IAkey");
}

function delIAkey() {
  localStorage.removeItem("IAkey");
}
