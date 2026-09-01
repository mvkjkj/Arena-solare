// ==============================
// DASHBOARD.JS
// ==============================

if (!verificarLogin()) {

    throw new Error("Usuário não autenticado.");

}

const usuario = JSON.parse(

    localStorage.getItem("usuario")

);

// ==============================
// NOME
// ==============================

document.getElementById("nomeUsuario").textContent =

    usuario.nome;

// ==============================
// PERMISSÕES
// ==============================

const tipo = usuario.tipo;

if (tipo !== "admin") {

    const admin = document.getElementById("btnAdmin");

    if (admin) {

        admin.style.display = "none";

    }

}

if (

    tipo !== "admin"

    &&

    tipo !== "gerente"

    &&

    tipo !== "recepcao"

) {

    const recepcao = document.getElementById("btnRecepcao");

    if (recepcao) {

        recepcao.style.display = "none";

    }

}

// ==============================
// BOTÕES
// ==============================

document.getElementById("btnReserva").onclick = () => {

    location.href = "/pages/reserva.html";

};

document.getElementById("btnMinhasReservas").onclick = () => {

    location.href = "/pages/minhas-reservas.html";

};

document.getElementById("btnPerfil").onclick = () => {

    location.href = "/pages/perfil.html";

};

const btnAdmin = document.getElementById("btnAdmin");

if (btnAdmin) {

    btnAdmin.onclick = () => {

        location.href = "/pages/admin.html";

    };

}

const btnRecepcao = document.getElementById("btnRecepcao");

if (btnRecepcao) {

    btnRecepcao.onclick = () => {

        location.href = "/pages/recepcao.html";

    };

}

// ==============================
// SAIR
// ==============================

document.getElementById("btnSair").onclick = () => {

    localStorage.removeItem("token");

    localStorage.removeItem("usuario");

    location.href = "/pages/login.html";

};