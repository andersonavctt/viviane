document.addEventListener('DOMContentLoaded', function() {
    const registroForm = document.getElementById('registro-form');
    registroForm.addEventListener('submit', registrarCliente);

    const logoutButton = document.querySelector('.logout-button');
    logoutButton.addEventListener('click', logout);

    carregarClientes();
    carregarClientesDeCookies();
});

function registrarCliente(event) {
    event.preventDefault();
    const nome = document.getElementById('nome').value;
    const data = document.getElementById('data').value;
    const valor = document.getElementById('valor').value;
    const procedimento = document.getElementById('procedimento').value;

    salvarCliente({ 'client-name': nome, 'procedure': procedimento, 'date': formatarDataBrasil(data), 'amount': valor });
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
