const ElementIds = {
    Nome: 'nome',
    Data: 'data',
    Valor: 'valor',
    Procedimento: 'procedimento',
    ClientesTable: 'clientes-table'
};

function getElement(id) {
    return document.getElementById(id);
}

function showError(message) {
    alert(message);
    window.location.href = 'login.html';
}

function getClientFromForm() {
    const nome = getElement(ElementIds.Nome).value;
    const data = getElement(ElementIds.Data).value;
    const valor = getElement(ElementIds.Valor).value;
    const procedimento = getElement(ElementIds.Procedimento).value;
    return { 'client-name': nome, 'procedure': procedimento, 'date': formatarDataBrasil(data), 'amount': valor };
}

function registerClient(event) {
    event.preventDefault();
    const usuarioLogado = localStorage.getItem('loggedIn');
    if (!usuarioLogado) {
        showError('Você precisa estar logado para registrar clientes.');
        return;
    }
    const cliente = getClientFromForm();
    let clientesRegistrados = JSON.parse(localStorage.getItem(usuarioLogado) || '[]');
    const clienteExistenteIndex = clientesRegistrados.findIndex(c => c['client-name'] === cliente['client-name'] && c['date'] === cliente['date']);
    if (clienteExistenteIndex === -1) {
        clientesRegistrados.push(cliente);
        localStorage.setItem(usuarioLogado, JSON.stringify(clientesRegistrados));
        updateRegisteredClientsTable(clientesRegistrados);
        saveClientsToCookies(clientesRegistrados);
    }
}

function updateRegisteredClientsTable(clientesRegistrados) {
    const clientesTableBody = getElement(ElementIds.ClientesTable).getElementsByTagName('tbody')[0];
    clientesTableBody.innerHTML = '';
    clientesRegistrados.forEach((cliente, index) => {
        const row = `
            <tr>
                <td>${cliente['client-name']}</td>
                <td>${cliente['date']}</td>
                <td>R$ ${cliente['amount']}</td>
                <td>${cliente['procedure']}</td>
                <td>
                    <button onclick="editClient(${index})">Editar</button>
                    <button onclick="deleteClient(${index})">Excluir</button>
                </td>
            </tr>
        `;
        clientesTableBody.innerHTML += row;
    });
}

function fillFormFields(cliente) {
    getElement(ElementIds.Nome).value = cliente['client-name'];
    getElement(ElementIds.Data).value = formatarDataHTML(cliente['date']);
    getElement(ElementIds.Valor).value = cliente['amount'];
    getElement(ElementIds.Procedimento).value = cliente['procedure'];
}

function editClient(index) {
    const usuarioLogado = localStorage.getItem('loggedIn');
    if (usuarioLogado) {
        const clientesRegistrados = JSON.parse(localStorage.getItem(usuarioLogado) || '[]');
        const clienteSelecionado = clientesRegistrados[index];
        if (clienteSelecionado) {
            fillFormFields(clienteSelecionado);
        }
    }
}

function deleteClient(index) {
    const usuarioLogado = localStorage.getItem('loggedIn');
    if (usuarioLogado) {
        let clientesRegistrados = JSON.parse(localStorage.getItem(usuarioLogado) || '[]');
        clientesRegistrados.splice(index, 1);
        localStorage.setItem(usuarioLogado, JSON.stringify(clientesRegistrados));
        updateRegisteredClientsTable(clientesRegistrados);
        saveClientsToCookies(clientesRegistrados);
    }
}

function logout() {
    localStorage.removeItem('loggedIn');
    window.location.href = 'index.html';
}

function loadClients() {
    const usuarioLogado = localStorage.getItem('loggedIn');
    if (usuarioLogado) {
        let clientesRegistrados = JSON.parse(localStorage.getItem(usuarioLogado) || '[]');
        const clientesFromCookies = loadClientsFromCookies();
        clientesRegistrados = clientesRegistrados.concat(clientesFromCookies);
        updateRegisteredClientsTable(clientesRegistrados);
    } else {
        logout();
    }
}

function saveClientsToCookies(clientesRegistrados) {
    const usuarioLogado = localStorage.getItem('loggedIn');
    if (usuarioLogado) {
        document.cookie = `clientesRegistrados_${usuarioLogado}=${JSON.stringify(clientesRegistrados)}`;
    }
}

function loadClientsFromCookies() {
    const usuarioLogado = localStorage.getItem('loggedIn');
    const cookieData = document.cookie.split('; ').find(row => row.startsWith(`clientesRegistrados_${usuarioLogado}=`));
    if (cookieData) {
        const rawClientesRegistrados = cookieData.split('=')[1];
        return JSON.parse(rawClientesRegistrados);
    }
    return [];
}

function formatarDataBrasil(data) {
    const partesData = data.split('-');
    return `${partesData[2]}/${partesData[1]}/${partesData[0]}`;
}

function formatarDataHTML(data) {
    const partesData = data.split('/');
    return `${partesData[2]}-${partesData[1]}-${partesData[0]}`;
}

document.getElementById(ElementIds.RegistroForm).addEventListener('submit', registerClient);
document.querySelector('.logout-button').addEventListener('click', logout);
document.addEventListener('DOMContentLoaded', loadClients);
