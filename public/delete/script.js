const cpfInput = document.querySelector("#cpf-search");
const personBox = document.querySelector("#person");
let personToDelete;
cpfInput.addEventListener(
  "input",
  () => (cpfInput.value = formatCpf(cpfInput.value)),
);
document.querySelector("#search").addEventListener("click", async () => {
  if (cpfOnly(cpfInput.value).length !== 11)
    return showMessage("Informe um CPF com 11 números.", "error");
  try {
    personToDelete = await findByCpf(cpfInput.value);
    if (!personToDelete) {
      personBox.hidden = true;
      return showMessage("CPF não encontrado.", "error");
    }
    personBox.hidden = false;
    personBox.innerHTML = `<div class="card" style="margin-top:20px"><h2>${personToDelete.nome} ${personToDelete.sobrenome}</h2><p><strong>CPF:</strong> ${formatCpf(personToDelete.cpf)}<br><strong>E-mail:</strong> ${personToDelete.email}<br><strong>Telefone:</strong> ${personToDelete.telefone}</p><div class="actions"><button class="danger" id="confirm-delete">Excluir permanentemente</button><a class="button secondary" href="/get/">Cancelar</a></div></div>`;
    document
      .querySelector("#confirm-delete")
      .addEventListener("click", removePerson);
  } catch (error) {
    showMessage(error.message, "error");
  }
});
async function removePerson() {
  if (!confirm(`Deseja excluir o cadastro de ${personToDelete.nome}?`)) return;
  try {
    const res = await fetch(`${API}/${personToDelete.id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error();
    personBox.hidden = true;
    cpfInput.value = "";
    showMessage("Cadastro excluído com sucesso!");
  } catch {
    showMessage("Não foi possível excluir o cadastro.", "error");
  }
}
const cpfFromUrl = new URLSearchParams(location.search).get("cpf");
if (cpfFromUrl) {
  cpfInput.value = formatCpf(cpfFromUrl);
  document.querySelector("#search").click();
}
