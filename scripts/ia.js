async function perguntarIA(texto) {
  const resposta = await fetch(
    "https://jarvis-backend-zna1.onrender.com/api/ia",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pergunta: texto, key: localStorage.getItem("IAkey") }),
    }
  );
  const { resposta: textoIA } = await resposta.json();

  console.log("Resposta da IA: ", textoIA);

  return textoIA;
}