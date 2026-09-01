function obterToken() {
    return localStorage.getItem("token");
}

function sair() {
    localStorage.removeItem("token");
    window.location.href = "/pages/login.html";
}

function verificarLogin() {
    const token = obterToken();

    if (!token) {
        alert("Faça login para continuar.");
        sair();
        return false;
    }

    return true;
}

async function api(url, opcoes = {}) {

    const token = obterToken();

    opcoes.headers = {
        ...(opcoes.headers || {}),
        Authorization: "Bearer " + token
    };

    const resposta = await fetch(url, opcoes);

    if (resposta.status === 401) {
        alert("Sua sessão expirou.");
        sair();
        return null;
    }

    return resposta;
}