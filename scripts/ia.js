async function perguntarIA(texto) {
  searchFace();
  console.log("Pergunta pra IA: ", texto);
  const resposta = await fetch(
    "https://jarvis-backend-zna1.onrender.com/api/ia",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pergunta: texto, key: localStorage.getItem("IAkey") }),
    }
  );
  const { resposta: textoIA } = await resposta.json();

  console.log("Retorno da IA: ", textoIA);
  return textoIA;
}