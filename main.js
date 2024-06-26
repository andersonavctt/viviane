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

function validateForm() {
    const nome = getElement(ElementIds.Nome).value;
    const data = getElement(ElementIds.Data).value;
    const valor = getElement(ElementIds.Valor).value;
    const procedimento = getElement(ElementIds.Procedimento).value;
    
    if (!nome || !data || !valor || !procedimento) {
        showError('Por favor, preencha todos os campos.');
        return false;
    }
    
    return true;
}

function getClientFromForm() {
    const nome = getElement(ElementIds.Nome).value;
    const data = getElement(ElementIds.Data).value;
    const valor = getElement(ElementIds.Valor).value;
    const procedimento = getElement(ElementIds.Procedimento).value;
    return { 'client-name': nome, 'procedure': procedimento, 'date': formatarDataBrasil(data), 'amount': valor };
}

function clearFormFields() {
    Object.values(ElementIds).forEach(id => getElement(id).value = '');
}

function registerClient(event) {
    event.preventDefault();
    const usuarioLogado = localStorage.getItem('loggedIn');
    if (!usuarioLogado) {
        showError('Você precisa estar logado para registrar clientes.');
        return;
    }

    if (!validateForm()) {
        return;
    }
    
    const cliente = getClientFromForm();
    let clientesRegistrados = JSON.parse(localStorage.getItem(usuarioLogado) || '[]');
    const clienteExistenteIndex = clientesRegistrados.findIndex(c => c['client-name'] === cliente['client-name'] && c['date'] === cliente['date']);
    if (clienteExistenteIndex === -1) {
        clientesRegistrados.push(cliente);
        localStorage.setItem(usuarioLogado, JSON.stringify(clientesRegistrados));
        clearFormFields();
        updateRegisteredClientsTable(clientesRegistrados);
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
            deleteClient(clienteSelecionado);
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
    }
}

function logout() {
    localStorage.removeItem('loggedIn');
    window.location.href = 'index.html';
}

function clearCookies() {
    document.cookie.split(";").forEach(cookie => {
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    });
}

function loadClients() {
    const usuarioLogado = localStorage.getItem('loggedIn');
    if (usuarioLogado) {
        let clientesRegistrados = JSON.parse(localStorage.getItem(usuarioLogado) || '[]');
        let cookieData = document.cookie.split('; ').find(row => row.startsWith('agenda_entries='));
        
        if (cookieData) {
            const rawClientesRegistrados = cookieData.split('=')[1];
            const clientesRegistradosFromCookies = JSON.parse(rawClientesRegistrados).map(entry => ({
                'client-name': entry.clientName,
                'procedure': entry.procedure,
                'date': formatarDataBrasil(entry.date),
                'amount': entry.amount
            }));
            
            clientesRegistrados = clientesRegistrados.concat(clientesRegistradosFromCookies);
            clearCookies()
        }

        updateRegisteredClientsTable(clientesRegistrados);
    } else {
        logout();
    }
}

function formatarDataBrasil(data) {
    const partesData = data.split('-');
    return `${partesData[2]}/${partesData[1]}/${partesData[0]}`;
}

function formatarDataHTML(data) {
    const partesData = data.split('/');
    return `${partesData[2]}-${partesData[1]}-${partesData[0]}`;
}

document.getElementById('registro-form').addEventListener('submit', registerClient);
document.querySelector('.logout-button').addEventListener('click', logout);
document.addEventListener('DOMContentLoaded', loadClients);
