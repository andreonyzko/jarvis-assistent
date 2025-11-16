const settingsModal = document.querySelector("#settings-container");
const settingsCloseBtn = document.querySelector("#close-settings-btn");
const settingsForm = document.querySelector("#settings-form");
const settingsFeedback = document.querySelector("#settings-feedback");

function showSettings() {
  settingsModal.style.display = "flex";
  document.querySelectorAll("#settings-form input").forEach((field) => {
    field.value = localStorage.getItem(field.id);
  });
}

function closeSettings() {
  settingsModal.style.display = "none";
}

settingsCloseBtn.addEventListener("click", (e) => {
  e.preventDefault();
  closeSettings();
});

settingsForm.addEventListener("submit", (e) => {
  e.preventDefault();
  document.querySelectorAll("#settings-form input").forEach((field) => {
    localStorage.setItem(field.id, field.value);
  });

  settingsFeedback.textContent = "As configurações foram salvas!";
  settingsFeedback.style.display = "block";
  setTimeout(() => {
    settingsFeedback.style.display = "none";
  }, 2000);
});

function getIAkey() {
  return localStorage.getItem("IAkey");
}

function delIAkey() {
  localStorage.removeItem("IAkey");
}
