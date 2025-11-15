function prepararParaFala(texto) {
  // Remove Markdown e caracteres especiais
  return texto
    .replace(/\*\*(.*?)\*\*/g, "$1") // remove **negrito**
    .replace(/\*/g, "") // remove *
    .replace(/\\n|\n/g, ". ") // ou mais natural: ". "
    .replace(/\s+/g, " ") // remove espaçamentos excessivos
    .trim();
}

function falar(texto) {
  const utterance = new SpeechSynthesisUtterance(texto);
  utterance.onend = () => {
    setState("sleep");
  };
  window.speechSynthesis.speak(utterance);
}