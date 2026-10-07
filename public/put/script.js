const searchInput = document.querySelector("#cpf-search");
const editCard = document.querySelector("#edit-card");
const editForm = document.querySelector("#person-form");
let currentPerson;
searchInput.addEventListener(
  "input",
  () => (searchInput.value = formatCpf(searchInput.value)),
);
editForm.cpf.addEventListener(
  "input",
  () => (editForm.cpf.value = formatCpf(editForm.cpf.value)),
);
async function search() {
  if (cpfOnly(searchInput.value).length !== 11)
    return showMessage("Informe um CPF com 11 números.", "error");
  try {
    currentPerson = await findByCpf(searchInput.value);
    if (!currentPerson) {
      editCard.hidden = true;
      return showMessage("CPF não encontrado.", "error");
    }
    populateForm(editForm, currentPerson);
    editCard.hidden = false;
    showMessage("Cadastro carregado. Faça as alterações e salve.");
  } catch (error) {
    showMessage(error.message, "error");
  }
}
document.querySelector("#search").addEventListener("click", search);
editForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const person = valueFromForm(editForm);
  if (person.cpf.length !== 11)
    return showMessage("Informe um CPF com 11 números.", "error");
  try {
    const response = await fetch(`${API}/${currentPerson.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...person, id: currentPerson.id }),
    });
    if (!response.ok) throw new Error();
    currentPerson = await response.json();
    showMessage("Cadastro atualizado com sucesso!");
  } catch {
    showMessage("Não foi possível atualizar o cadastro.", "error");
  }
});
const cpfFromUrl = new URLSearchParams(location.search).get("cpf");
if (cpfFromUrl) {
  searchInput.value = formatCpf(cpfFromUrl);
  search();
}
