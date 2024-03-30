let entries = [];
let editIndex = -1;

function loadEntriesFromCookies() {
    const cookieData = document.cookie.split('; ').find(row => row.startsWith('agenda_entries='));
    if (cookieData) {
        const storedEntries = JSON.parse(cookieData.split('=')[1]);
        if (Array.isArray(storedEntries)) {
            entries = storedEntries;
            renderEntries();
        }
    }
}

function saveEntriesToCookies() {
    const expirationDate = new Date();
    expirationDate.setFullYear(expirationDate.getFullYear() + 1);
    document.cookie = `agenda_entries=${JSON.stringify(entries)}; expires=${expirationDate.toUTCString()}; path=/`;
}

function addOrUpdateEntry() {
    const fields = ["client-name", "procedure", "date", "amount"].map(field => document.getElementById(field).value);
    if (fields.every(field => field)) {
        const entry = {clientName: fields[0], procedure: fields[1], date: fields[2], amount: fields[3]};
        editIndex === -1 ? entries.push(entry) : (entries[editIndex] = entry, editIndex = -1);
        renderEntries();
        clearForm();
        saveEntriesToCookies();
    } else alert("Por favor, preencha todos os campos.");
}

function renderEntries(filteredEntries = entries) {
    const entriesContainer = document.getElementById("entries-container");
    entriesContainer.innerHTML = "";
    filteredEntries.forEach((entry, index) => {
        const entryElement = document.createElement("div");
        entryElement.className = "entry";
        entryElement.innerHTML = `<p><strong>Cliente:</strong> ${entry.clientName}</p>
            <p><strong>Procedimento:</strong> ${entry.procedure}</p>
            <p><strong>Data:</strong> ${entry.date}</p>
            <p><strong>Valor Pago:</strong> R$ ${entry.amount}</p>
            <div class="button-group">
                <button class="edit-button" onclick="editEntry(${index})">Editar</button>
                <button class="delete-button" onclick="deleteEntry(${index})">Excluir</button>
            </div>`;
        entriesContainer.appendChild(entryElement);
    });
}

function clearForm() {
    ["client-name", "procedure", "date", "amount"].forEach(field => document.getElementById(field).value = "");
    editIndex = -1;
    document.getElementById("add-update-button").innerText = "Adicionar";
}

function editEntry(index) {
    const entry = entries[index];
    ["client-name", "procedure", "date", "amount"].forEach((field, i) => document.getElementById(field).value = entry[Object.keys(entry)[i]]);
    editIndex = index;
    document.getElementById("add-update-button").innerText = "Atualizar";
    saveEntriesToCookies();
}

function deleteEntry(index) {
    entries.splice(index, 1);
    renderEntries();
    saveEntriesToCookies();
}

function searchEntries() {
    const searchInput = document.getElementById("search").value.toLowerCase();
    const filteredEntries = entries.filter(entry => entry.clientName.toLowerCase().includes(searchInput));
    renderEntries(filteredEntries);
}

document.getElementById("search").addEventListener("input", searchEntries);

loadEntriesFromCookies();
