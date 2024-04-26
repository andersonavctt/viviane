function registrarCliente(event) {
    event.preventDefault();
    const nome = document.getElementById('nome').value;
    const data = document.getElementById('data').value;
    const valor = document.getElementById('valor').value;
    const procedimento = document.getElementById('procedimento').value;

    salvarCliente({ 'client-name': nome, 'procedure': procedimento, 'date': formatarDataBrasil(data), 'amount': valor });
}

function editarCliente(index) {
    const usuarioLogado = localStorage.getItem('loggedIn');
    if (usuarioLogado) {
        const clientesRegistrados = obterClientesRegistrados(usuarioLogado);
        const clienteSelecionado = clientesRegistrados[index];

        if (clienteSelecionado) {
            preencherCamposFormulario(clienteSelecionado);
        }
    }
}

function excluirCliente(index) {
    const usuarioLogado = localStorage.getItem('loggedIn');
    if (usuarioLogado) {
        const clientesRegistrados = obterClientesRegistrados(usuarioLogado);
        clientesRegistrados.splice(index, 1);
        salvarClientes(usuarioLogado, clientesRegistrados);
        atualizarClientesRegistrados(clientesRegistrados);
    }
}

function salvarCliente(cliente) {
    const usuarioLogado = localStorage.getItem('loggedIn');
    if (usuarioLogado) {
        let clientesRegistrados = obterClientesRegistrados(usuarioLogado);
        const clienteExistenteIndex = clientesRegistrados.findIndex(c => c['client-name'] === cliente['client-name'] && c['date'] === cliente['date']);
        
        if (clienteExistenteIndex === -1) {
            clientesRegistrados.push(cliente);
            salvarClientes(usuarioLogado, clientesRegistrados);
            limparCamposFormulario();
            atualizarClientesRegistrados(clientesRegistrados);
        }
    } else {
        alert('Você precisa estar logado para registrar clientes.');
        window.location.href = 'login.html';
    }
}

function obterClientesRegistrados(usuario) {
    const clientesString = localStorage.getItem(usuario) || '[]';
    return JSON.parse(clientesString);
}

function salvarClientes(usuario, clientes) {
    localStorage.setItem(usuario, JSON.stringify(clientes));
}

function limparCamposFormulario() {
    ['nome', 'data', 'valor', 'procedimento'].forEach(id => document.getElementById(id).value = '');
}

function preencherCamposFormulario(cliente) {
    document.getElementById('nome').value = cliente['client-name'];
    document.getElementById('data').value = cliente['date'];
    document.getElementById('valor').value = cliente['amount'];
    document.getElementById('procedimento').value = cliente['procedure'];
}

function atualizarClientesRegistrados(clientesRegistrados) {
    const clientesTableBody = document.getElementById('clientes-table').getElementsByTagName('tbody')[0];
    clientesTableBody.innerHTML = '';

    clientesRegistrados.forEach((cliente, index) => {
        const row = `
            <tr>
                <td>${cliente['client-name']}</td>
                <td>${cliente['date']}</td>
                <td>R$ ${cliente['amount']}</td>
                <td>${cliente['procedure']}</td>
                <td>
                    <button onclick="editarCliente(${index})">Editar</button>
                    <button onclick="excluirCliente(${index})">Excluir</button>
                </td>
            </tr>
        `;
        clientesTableBody.innerHTML += row;
    });
}

function logout() {
    localStorage.removeItem('loggedIn');
    window.location.href = 'index.html';
}

function carregarClientes() {
    const usuarioLogado = localStorage.getItem('loggedIn');
    if (usuarioLogado) {
        const clientesRegistrados = obterClientesRegistrados(usuarioLogado);
        atualizarClientesRegistrados(clientesRegistrados);
    } else {
        logout();
    }
}

function carregarClientesDeCookies() {
    const cookieData = document.cookie.split('; ').find(row => row.startsWith('agenda_entries='));
    if (cookieData) {
        const rawClientesRegistrados = cookieData.split('=')[1];
        const clientesRegistrados = JSON.parse(rawClientesRegistrados).map(entry => ({
            'client-name': entry.clientName,
            'procedure': entry.procedure,
            'date': entry.date,
            'amount': entry.amount
        }));
        atualizarClientesRegistrados(clientesRegistrados);
    }
}

function formatarDataBrasil(data) {
    const partesData = data.split('-');
    return partesData[2] + '/' + partesData[1] + '/' + partesData[0];
}

document.getElementById('registro-form').addEventListener('submit', registrarCliente);
document.querySelector('.logout-button').addEventListener('click', logout);
document.addEventListener('DOMContentLoaded', () => {
    carregarClientes();
    carregarClientesDeCookies();
});
