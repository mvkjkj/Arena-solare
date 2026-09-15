// ==============================
// DASHBOARD.JS
// ==============================

if (!verificarLogin()) {
    throw new Error("Usuário não autenticado.");
}

const usuario = JSON.parse(localStorage.getItem("usuario"));

if (!usuario) {
    location.href = "/pages/login.html";
    throw new Error("Usuário não encontrado.");
}

// ==============================
// NOME
// ==============================

document.getElementById("nomeUsuario").textContent = usuario.nome;

// ==============================
// PERMISSÕES
// ==============================

const tipo = usuario.tipo;

// Cliente
if (tipo === "cliente") {

    document.getElementById("btnRecepcao")?.remove();
    document.getElementById("btnAdmin")?.remove();

}

// Recepção
else if (tipo === "recepcao") {

    document.getElementById("btnAdmin")?.remove();

}

// Admin e gerente
// Podem visualizar os dois menus

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

// ==============================
// ADMIN
// ==============================

const btnAdmin = document.getElementById("btnAdmin");

if (btnAdmin) {

    btnAdmin.onclick = () => {
        location.href = "/pages/admin.html";
    };

}

// ==============================
// RECEPÇÃO
// ==============================

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