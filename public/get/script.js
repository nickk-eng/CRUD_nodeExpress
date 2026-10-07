const results = document.querySelector("#results");
const input = document.querySelector("#cpf-search");
input.addEventListener("input", () => (input.value = formatCpf(input.value)));

function render(persons) {
  if (!persons.length) {
    results.innerHTML =
      '<tr><td colspan="9" class="empty">Nenhum cadastro encontrado.</td></tr>';
    return;
  }
  results.innerHTML = persons
    .map(
      (p) =>
        `<tr><td>${formatCpf(p.cpf)}</td><td>${p.nome}</td><td>${p.sobrenome}</td><td>${p.email}</td><td>${p.idade}</td><td>${p.telefone}</td><td>${p.rua}, ${p.bairro}<br>${p.cidade}/${p.estado}</td><td>${p.rg}</td><td><a href="/put/?cpf=${p.cpf}">Editar</a> · <a href="/delete/?cpf=${p.cpf}">Excluir</a></td></tr>`,
    )
    .join("");
}
async function listAll() {
  try {
    const res = await fetch(API);
    if (!res.ok) throw new Error();
    render(await res.json());
  } catch {
    showMessage("Não foi possível carregar os cadastros.", "error");
  }
}
document.querySelector("#all").addEventListener("click", listAll);
document.querySelector("#search").addEventListener("click", async () => {
  if (cpfOnly(input.value).length !== 11)
    return showMessage("Informe um CPF com 11 números.", "error");
  try {
    const person = await findByCpf(input.value);
    render(person ? [person] : []);
  } catch (error) {
    showMessage(error.message, "error");
  }
});
listAll();
