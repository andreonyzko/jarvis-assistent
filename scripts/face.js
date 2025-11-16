let faceImg = document.getElementById("face-img");
const allFaces = [
  "sleep",
  "code",
  "coffee",
  "eat",
  "exercise",
  "playcube",
  "playvideogame",
  "readbook",
  "readnews",
  "watchtv",
  "watchmovie",
  "angry",
  "ask",
  "awake",
  "chating",
  "happy",
  "sad",
];
let hobbieFaceInterval = undefined;

function setState(state) {
  state = state.toLowerCase();
  if (allFaces.includes(state)) {
    faceImg.src = `./assets/faces/${state}.gif`;

    stopHobbieFace();
    let faces = [
      "sleep",
      "code",
      "coffee",
      "eat",
      "exercise",
      "playcube",
      "playvideogame",
      "readbook",
      "readnews",
      "watchtv",
      "watchmovie",
    ];
    let generateFace = () =>
      (faceImg.src = `./assets/faces/${
        faces[Math.floor(Math.random() * faces.length)]
      }.gif`);
    hobbieFaceInterval = setInterval(generateFace, 5000);

  } else {
    console.error("Falha ao tentar trocar expressão: expressão não existente");
  }
}

function starthobbieFace() {
  if (!hobbieFaceInterval) {
    let faces = [
      "sleep",
      "code",
      "coffee",
      "eat",
      "exercise",
      "playcube",
      "playvideogame",
      "readbook",
      "readnews",
      "watchtv",
      "watchmovie",
    ];
    let generateFace = () =>
      (faceImg.src = `./assets/faces/${
        faces[Math.floor(Math.random() * faces.length)]
      }.gif`);
    generateFace();
    hobbieFaceInterval = setInterval(generateFace, 5000);
  }
}

function stopHobbieFace() {
  clearInterval(hobbieFaceInterval);
  hobbieFaceInterval = undefined;
}

function listenFace() {
  let faces = ["ask", "awake", "happy"];
  stopHobbieFace();
  faceImg.src = `./assets/faces/${
    faces[Math.floor(Math.random() * faces.length)]
  }.gif`;
}

function searchFace() {
  let faces = ["readbook", "readnews", "code"];
  stopHobbieFace();
  faceImg.src = `./assets/faces/${
    faces[Math.floor(Math.random() * faces.length)]
  }.gif`;
}

function speakFace() {
  stopHobbieFace();
  faceImg.src = `./assets/faces/chating.gif`;
}

function swearingFace() {
  let faces = ["sad", "angry"];
  setState(faces[Math.floor(Math.random() * faces.length)]);
}

starthobbieFace();
