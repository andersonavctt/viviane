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

    if (email === 'vivianeoliver805@gmail.com') {
        localStorage.setItem('loggedIn', true);
        window.location.href = 'agenda.html';
    } else {
        alert('Email ou senha incorretos. Tente novamente.');
    }
}

function sendResetEmail(email) {
    Email.send({
        Host: "smtp.elasticemail.com",
        Port: 2525,
        Username: "andersonavcontato@gmail.com",
        Password: "1AD9353E82F0E290C67E86EC2A7E42806624",
        To: email,
        From: "andersonavcontato@gmail.com",
        Subject: "Redefinição de Senha",
        Body: "Clique no link abaixo para redefinir sua senha: <a href='https://seusite.com/reset_password'>Redefinir Senha</a>",
    }).then(
        message => alert("Email de redefinição de senha enviado com sucesso.")
    );
}

function forgotPassword(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    
    sendResetEmail(email);

    document.getElementById('login-form').style.display = 'none';
    document.getElementById('reset-password-form').style.display = 'block';
}

function resetPassword(event) {
    event.preventDefault();
    const newPassword = document.getElementById('new-password').value;
    
    alert('Sua senha foi redefinida com sucesso.');

    window.location.href = 'index.html';
}

checkLogin();
document.getElementById('login-form').addEventListener('submit', login);
document.getElementById('forgot-password').addEventListener('click', forgotPassword);
document.getElementById('reset-password-form').addEventListener('submit', resetPassword);
