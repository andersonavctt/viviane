function checkLogin() {
    const loggedIn = localStorage.getItem('loggedIn');
    if (loggedIn) {
        window.location.href = 'agenda.html';
    }
}

function login(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    if (email === 'vivianeoliver805@gmail.com' && senha === 'dash135') {
        localStorage.setItem('loggedIn', true);
        window.location.href = 'agenda.html';
    } else {
        alert('Email ou senha incorretos. Tente novamente.');
    }
}

checkLogin();
document.getElementById('login-form').addEventListener('submit', login);
