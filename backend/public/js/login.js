const formulario = document.getElementById("loginForm");

formulario.addEventListener("submit", async (e) => {

    e.preventDefault();

    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    try {

        const resposta = await fetch("/api/login", {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify({

                email,
                senha

            })

        });

        const dados = await resposta.json();

        if (!resposta.ok) {

            alert(dados.erro || "Erro ao fazer login.");

            return;

        }

        localStorage.setItem("token", dados.token);

        localStorage.setItem(

            "usuario",

            JSON.stringify(dados.usuario)

        );

        alert("Login realizado com sucesso!");

        window.location.href = "/dashboard";

    }

    catch (erro) {

        console.error(erro);

        alert("Erro ao conectar com o servidor.");

    }

});