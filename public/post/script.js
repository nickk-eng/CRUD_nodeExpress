const form = document.querySelector("#person-form");
form.cpf.addEventListener(
  "input",
  () => (form.cpf.value = formatCpf(form.cpf.value)),
);
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const person = valueFromForm(form);
  if (person.cpf.length !== 11)
    return showMessage("Informe um CPF com 11 números.", "error");
  try {
    if (await findByCpf(person.cpf))
      return showMessage("Já existe um cadastro com este CPF.", "error");
    const response = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(person),
    });
    if (!response.ok) throw new Error();
    form.reset();
    showMessage("Cadastro realizado com sucesso!");
  } catch {
    showMessage("Não foi possível salvar o cadastro.", "error");
  }
});
