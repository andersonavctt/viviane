function logout() {
    localStorage.removeItem('loggedIn');
    window.location.href = 'index.html';
}

function formatarDataBrasil(data) {
    const partesData = data.split('-');
    return partesData[2] + '/' + partesData[1] + '/' + partesData[0];
}

function registrarCliente(event) {
    event.preventDefault();
    const nome = document.getElementById('nome').value;
    const data = formatarDataBrasil(document.getElementById('data').value);
    const valor = document.getElementById('valor').value;
    const procedimento = document.getElementById('procedimento').value;

    const usuarioLogado = localStorage.getItem('loggedIn');

    if (usuarioLogado) {
        let clientesRegistrados = JSON.parse(localStorage.getItem(usuarioLogado)) || [];
        const clienteExistente = clientesRegistrados.find(cliente => cliente['client-name'] === nome && cliente['date'] === data);
        
        if (clienteExistente) {
            return;
        }
        
        clientesRegistrados.push({ 'client-name': nome, 'procedure': procedimento, 'date': data, 'amount': valor });
        localStorage.setItem(usuarioLogado, JSON.stringify(clientesRegistrados));
        document.getElementById('nome').value = '';
        document.getElementById('data').value = '';
        document.getElementById('valor').value = '';
        document.getElementById('procedimento').value = '';
        atualizarClientesRegistrados(clientesRegistrados);
    } else {
        alert('Você precisa estar logado para registrar clientes.');
        window.location.href = 'login.html';
    }
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

function editarCliente(index) {
    const usuarioLogado = localStorage.getItem('loggedIn');
    if (usuarioLogado) {
        const clientesRegistrados = JSON.parse(localStorage.getItem(usuarioLogado)) || [];
        const clienteSelecionado = clientesRegistrados[index];

        document.getElementById('nome').value = clienteSelecionado['client-name'];
        document.getElementById('data').value = clienteSelecionado['date'];
        document.getElementById('valor').value = clienteSelecionado['amount'];
        document.getElementById('procedimento').value = clienteSelecionado['procedure'];

        clientesRegistrados.splice(index, 1);
        localStorage.setItem(usuarioLogado, JSON.stringify(clientesRegistrados));
        atualizarClientesRegistrados(clientesRegistrados);
    }
}

function excluirCliente(index) {
    const usuarioLogado = localStorage.getItem('loggedIn');
    if (usuarioLogado) {
        let clientesRegistrados = JSON.parse(localStorage.getItem(usuarioLogado)) || [];
        clientesRegistrados.splice(index, 1);
        localStorage.setItem(usuarioLogado, JSON.stringify(clientesRegistrados));
        atualizarClientesRegistrados(clientesRegistrados);
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

document.getElementById('registro-form').addEventListener('submit', registrarCliente);
document.querySelector('.logout-button').addEventListener('click', logout);
document.addEventListener('DOMContentLoaded', () => {
    const usuarioLogado = localStorage.getItem('loggedIn');
    if (usuarioLogado) {
        const clientesRegistrados = JSON.parse(localStorage.getItem(usuarioLogado)) || [];
        atualizarClientesRegistrados(clientesRegistrados);
        carregarClientesDeCookies()
    } else {
        logout()
    }
});
