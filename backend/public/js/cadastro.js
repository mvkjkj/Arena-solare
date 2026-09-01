const formulario = document.getElementById("cadastroForm");

formulario.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const telefone = document.getElementById("telefone").value.trim();
    const senha = document.getElementById("senha").value;

    try {

        const resposta = await fetch("/api/cadastro", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nome,
                email,
                telefone,
                senha
            })
        });

        const dados = await resposta.json();

        if (!resposta.ok) {
            alert(dados.error || dados.erro || "Erro ao cadastrar.");
            return;
        }

        alert("Cadastro realizado com sucesso!");

        window.location.href = "/pages/login.html";

    } catch (erro) {

        console.error(erro);

        alert("Erro ao conectar com o servidor.");

    }

});