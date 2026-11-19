(() => {
  const selects = [...document.querySelectorAll(".builder-controls select")];
  const code = document.getElementById("generated-code");
  const meaning = document.getElementById("generated-meaning");
  const status = document.getElementById("copy-status");
  const labels = {
    S:"Social",R:"Reservado",L:"Limbic",C:"Calmo",O:"Organizado",U:"Não estruturado",
    A:"Cooperativo",E:"Egocêntrico",N:"Menos curioso",I:"Investigativo"
  };
  function update(){
    const value = selects.map(select => select.value).join("");
    code.textContent = value;
    meaning.textContent = selects.map(select => labels[select.value]).join(" · ");
    status.textContent = "";
  }
  selects.forEach(select => select.addEventListener("change", update));
  document.getElementById("copy-code").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(code.textContent);
      status.textContent = "Código copiado.";
    } catch {
      status.textContent = "Não foi possível copiar automaticamente.";
    }
  });
  update();
})();