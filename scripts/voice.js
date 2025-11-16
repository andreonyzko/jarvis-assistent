const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
if (!SpeechRecognition) {
  alert("Seu navegador não suporta o reconhecimento de voz!");
  throw new Error("SpeechRecognition não disponível");
}

const recognizer = new SpeechRecognition();
recognizer.lang = "pt-BR";
recognizer.continuous = true;
recognizer.interimResults = false;

const commandRecognizer = new SpeechRecognition();
commandRecognizer.lang = "pt-BR";
commandRecognizer.continuous = true;
commandRecognizer.interimResults = false;

let waitingCommand = false;

function getHotWord() {
  return localStorage.getItem("hotword") || "jarvis";
}

recognizer.onresult = (e) => {
  if (waitingCommand) return;
  for (let i = e.resultIndex; i < e.results.length; i++) {
    if (e.results[i].isFinal) {
      const transcript = e.results[i][0].transcript.trim().toLowerCase();
      if (transcript.includes(getHotWord())) {
        if (window.speechSynthesis.speaking) window.speechSynthesis.cancel();
        if (!localStorage.getItem("IAkey")) {
          falar(
            "Você precisa configurar uma chave de inteligencia artificial, acessando configurações..."
          );
          showSettings();
          return;
        }
        listenFace();
        getCommand();
      }
    }
  }
};

recognizer.onerror = (e) => {
  if (e.error !== "no-speech") {
    console.error("Erro no reconhecimento de hotword: ", e.error);
  }
};

recognizer.onend = (e) => {
  if (!waitingCommand) {
    setTimeout(() => {
      recognizer.start();
    }, 500);
  }
};

commandRecognizer.onresult = async (e) => {
  for (let i = e.resultIndex; i < e.results.length; i++) {
    if (e.results[i].isFinal) {
      const command = e.results[i][0].transcript.trim().toLowerCase();
      let willSpeak = false;

      if (openSettingsCommands.includes(command)) {
        showSettings();
      } else if (closeSettingsCommands.includes(command)) {
        closeSettings();
      } else if (expressionsCommands.has(command)) {
        setState(expressionsCommands.get(command));
      } else if (xingamentos.includes(command)) {
        swearingFace();
      } else {
        willSpeak = true;
        let resposta = await perguntarIA(command);
        resposta = prepararParaFala(resposta);
        falar(resposta);
      }

      if (!willSpeak) starthobbieFace();
      commandRecognizer.stop();
      waitingCommand = false;
      setTimeout(() => {
        recognizer.start();
      }, 500);
    }
  }
};

commandRecognizer.onerror = (e) => {
  console.error("Erro no reconhecimento de comando: ", e.error);
};

commandRecognizer.oneend = (e) => {
  waitingCommand = false;
  setTimeout(() => {
    recognizer.start();
  }, 500);
  starthobbieFace();
};

function getCommand() {
  waitingCommand = true;
  recognizer.stop();
  setTimeout(() => {
    commandRecognizer.start();
  }, 500);
}

recognizer.start();
