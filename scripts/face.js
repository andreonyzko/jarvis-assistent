let faceImg = document.getElementById("face-img");
function setState(state) {
  if (state === "sleep") {
    faceImg.src = "./assets/face-sleeping.gif";
  } else if (state === "awake") {
    faceImg.src = "./assets/face-listening.gif";
  } else if (state === "confirmed") {
    faceImg.src = "./assets/face-confirmed.gif";
  } else if (state === "reading") {
    faceImg.src = "./assets/face-reading.gif";
  }
}
setState("sleep");