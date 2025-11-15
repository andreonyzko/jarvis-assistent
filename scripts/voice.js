let reconhecendoComando = false;
let reconhecedorAtivo = false;
let recognizer = null;

console.log("Inicializando SpeechRecognition...");
const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (!Recognition) {
  alert("Seu navegador não suporta Web Speech API/SpeechRecognition.");
  throw new Error("SpeechRecognition não disponível.");
}

recognizer = new Recognition();
recognizer.lang = "pt-BR";
recognizer.continuous = true;
recognizer.interimResults = false;
setState("sleep");

recognizer.onstart = () => {
  reconhecedorAtivo = true;
};

recognizer.onresult = (event) => {
  if (reconhecendoComando) return; // Não processar se já está no modo comando

  for (let i = event.resultIndex; i < event.results.length; ++i) {
    if (event.results[i].isFinal) {
      let transcript = event.results[i][0].transcript.trim().toLowerCase();
      if (transcript.includes("jarvis")) {
        // Interrompe fala ativa ANTES de mudar de estado
        if (window.speechSynthesis.speaking) {
          window.speechSynthesis.cancel();
        }

        setState("awake");
        reconhecendoComando = true;

        // Para o reconhecimento principal com segurança
        try {
          recognizer.stop();
          reconhecedorAtivo = false;
        } catch (e) {
          console.log("Erro ao parar recognizer:", e);
        }

        // Aguarda um pouco e inicia comando
        setTimeout(() => {
          reconheceComando();
        }, 100);
      }
    }
  }
};

recognizer.onerror = (event) => {
  console.log("Erro no reconhecimento principal:", event.error);
};

recognizer.onend = () => {
  reconhecedorAtivo = false;
  // Reinicia reconhecimento se não está em modo comando
  if (!reconhecendoComando) {
    setTimeout(() => {
      try {
        if (recognizer && !reconhecedorAtivo) {
          recognizer.start();
        }
      } catch (e) {
        console.log("Erro ao reiniciar recognizer:", e);
      }
    }, 300);
  }
};

// Inicia reconhecimento inicial
recognizer.start();

// Função para reconhecer comando e integrar Perplexity
function reconheceComando() {
  setState("awake");
  const Recognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const recComando = new Recognition();
  recComando.lang = "pt-BR";
  recComando.continuous = false;
  recComando.interimResults = false;

  recComando.onstart = () => {
    console.log("Reconhecimento de comando iniciado");
  };

  recComando.onresult = async (event) => {
    if (!event.results.length) {
      reconhecendoComando = false;
      reiniciarReconhecedor();
      return;
    }

    let comando = event.results[0][0].transcript.trim();
    console.log("Comando capturado:", comando);
    setState("reading");

    try {
      console.log("Obtendo resposta para:", comando);
      if (!localStorage.getItem("IAkey")) {
        falar(
          "Você precisa configurar a chave da Inteligencia Artificial para prosseguir com os comandos de voz"
        );
        return;
      }
      let resposta = await perguntarIA(comando);
      console.log("Resposta aprimorada:", resposta);

      resposta = prepararParaFala(resposta);
      falar(resposta);
    } catch (e) {
      falar("Desculpe, houve um erro ao tentar responder.");
      console.log("Erro Perplexity:", e);
    }
  };

  recComando.onerror = (event) => {
    console.log("Erro comando:", event.error);
    setState("sleep");
    reconhecendoComando = false;
    reiniciarReconhecedor();
  };

  recComando.onend = () => {
    console.log("Reconhecimento de comando finalizado");
    reconhecendoComando = false;

    // Se TTS ainda está falando, não reinicia reconhecedor agora
    if (!window.speechSynthesis.speaking) {
      reiniciarReconhecedor();
    }
  };

  try {
    recComando.start();
  } catch (e) {
    console.log("Erro ao iniciar reconhecimento de comando:", e);
    reconhecendoComando = false;
    reiniciarReconhecedor();
  }
}

// Função para reiniciar reconhecedor com segurança
function reiniciarReconhecedor() {
  setTimeout(() => {
    try {
      if (recognizer && !reconhecedorAtivo && !reconhecendoComando) {
        recognizer.start();
      }
    } catch (e) {
      console.log("Erro ao reiniciar recognizer:", e);
    }
  }, 300);
}

async function perguntarIA(texto) {
  const resposta = await fetch(
    "https://jarvis-backend-zna1.onrender.com/api/ia",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pergunta: texto }),
    }
  );
  const { resposta: textoIA } = await resposta.json();
  console.log("Resposta da IA:", textoIA);
  return textoIA;
}

// Fala resposta
function prepararParaFala(texto) {
  return texto
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*/g, "")
    .replace(/\\n|\n/g, ". ")
    .replace(/\s+/g, " ")
    .trim();
}

function falar(texto, nomeDaVoz = "Google português do Brasil") {
  const utterance = new SpeechSynthesisUtterance(texto);
  const voces = window.speechSynthesis.getVoices();
  const voz = voces.find((v) => v.name === nomeDaVoz);
  if (voz) utterance.voice = voz;
  utterance.rate = 1.0;

  utterance.onstart = () => {
    setState("reading");
  };

  utterance.onend = () => {
    setState("sleep");
    reconhecendoComando = false;
    reiniciarReconhecedor();
  };

  utterance.onerror = (event) => {
    console.log("Erro ao falar:", event.error);
    setState("sleep");
    reconhecendoComando = false;
    reiniciarReconhecedor();
  };

  window.speechSynthesis.speak(utterance);
}
