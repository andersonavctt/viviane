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
        clientesRegistrados.push({ nome, data, valor, procedimento });
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
                <td>${cliente.nome}</td>
                <td>${cliente.data}</td>
                <td>R$ ${cliente.valor}</td>
                <td>${cliente.procedimento}</td>
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

        document.getElementById('nome').value = clienteSelecionado.nome;
        document.getElementById('data').value = clienteSelecionado.data;
        document.getElementById('valor').value = clienteSelecionado.valor;
        document.getElementById('procedimento').value = clienteSelecionado.procedimento;

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
        const clientesRegistrados = JSON.parse(cookieData.split('=')[1]) || [];
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
    } else {
        carregarClientesDeCookies()
        logout()
    }
});
