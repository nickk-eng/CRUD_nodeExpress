const API = "/api/pessoas";

function cpfOnly(value) {
  return value.replace(/\D/g, "");
}
function formatCpf(value) {
  const cpf = cpfOnly(value).slice(0, 11);
  return cpf
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}
function showMessage(text, type = "success") {
  const message = document.querySelector(".message");
  message.textContent = text;
  message.className = `message show ${type}`;
}
function valueFromForm(form) {
  const data = Object.fromEntries(new FormData(form).entries());
  data.idade = Number(data.idade);
  data.cpf = cpfOnly(data.cpf);
  return data;
}
async function findByCpf(cpf) {
  const response = await fetch(
    `${API}?cpf=${encodeURIComponent(cpfOnly(cpf))}`,
  );
  if (!response.ok) throw new Error("Não foi possível consultar o cadastro.");
  const persons = await response.json();
  return persons[0] || null;
}
function populateForm(form, person) {
  Object.entries(person).forEach(([key, value]) => {
    const field = form.elements[key];
    if (field) field.value = key === "cpf" ? formatCpf(String(value)) : value;
  });
}
