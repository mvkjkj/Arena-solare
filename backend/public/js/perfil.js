// ==============================
// PERFIL.JS
// ==============================

if (!verificarLogin()) {

    throw new Error("Usuário não autenticado.");

}

const perfilForm = document.getElementById("perfilForm");
const senhaForm = document.getElementById("senhaForm");

const nome = document.getElementById("nome");
const email = document.getElementById("email");
const telefone = document.getElementById("telefone");


// ==============================
// CARREGAR PERFIL
// ==============================

async function carregarPerfil() {

    try {

        const resposta = await api("/api/usuario");

        if (!resposta) return;

        const dados = await resposta.json();

        if (!resposta.ok) {

            alert(dados.erro || "Erro ao carregar perfil.");

            return;

        }

        nome.value = dados.nome || "";

        email.value = dados.email || "";

        telefone.value = dados.telefone || "";

    }

    catch (erro) {

        console.error(erro);

        alert("Erro ao carregar perfil.");

    }

}


// ==============================
// ATUALIZAR PERFIL
// ==============================

perfilForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    try {

        const resposta = await api(

            "/api/usuario",

            {

                method: "PUT",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify({

                    nome: nome.value.trim(),

                    telefone: telefone.value.trim()

                })

            }

        );

        if (!resposta) return;

        const dados = await resposta.json();

        if (!resposta.ok) {

            alert(dados.erro || "Erro ao atualizar perfil.");

            return;

        }

        alert(dados.mensagem);

        const usuario = JSON.parse(

            localStorage.getItem("usuario")

        );

        if (usuario) {

            usuario.nome = nome.value.trim();

            usuario.telefone = telefone.value.trim();

            localStorage.setItem(

                "usuario",

                JSON.stringify(usuario)

            );

        }

    }

    catch (erro) {

        console.error(erro);

        alert("Erro ao atualizar perfil.");

    }

});


// ==============================
// ALTERAR SENHA
// ==============================

senhaForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const senha = document.getElementById("senha").value;

    const confirmarSenha =
        document.getElementById("confirmarSenha").value;

    if (senha !== confirmarSenha) {

        alert("As senhas não são iguais.");

        return;

    }

    if (senha.length < 6) {

        alert(
            "A senha deve possuir pelo menos 6 caracteres."
        );

        return;

    }

    try {

        const resposta = await api(

            "/api/usuario/senha",

            {

                method: "PUT",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify({

                    senha

                })

            }

        );

        if (!resposta) return;

        const dados = await resposta.json();

        if (!resposta.ok) {

            alert(dados.erro || "Erro ao alterar senha.");

            return;

        }

        alert(dados.mensagem);

        senhaForm.reset();

    }

    catch (erro) {

        console.error(erro);

        alert("Erro ao alterar senha.");

    }

});


// ==============================
// INICIAR
// ==============================

carregarPerfil();