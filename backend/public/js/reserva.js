// =========================
// VERIFICA LOGIN
// =========================
if (!verificarLogin()) {
    throw new Error("Usuário não autenticado.");
}

// =========================
// ELEMENTOS
// =========================
const modalidade = document.getElementById("modalidade");
const data = document.getElementById("data");
const horario = document.getElementById("horario");
const duracao = document.getElementById("duracao");
const valor = document.getElementById("valor");
const formulario = document.getElementById("reservaForm");

const VALOR_HORA = 70;

// =========================
// MODALIDADES
// =========================
async function carregarModalidades() {

    try {

        const resposta = await fetch("/api/modalidades");

        const modalidades = await resposta.json();

        modalidade.innerHTML = '<option value="">Selecione</option>';

        modalidades.forEach((m) => {

            modalidade.innerHTML += `
                <option value="${m.id}">
                    ${m.nome}
                </option>
            `;

        });

    } catch (erro) {

        console.error(erro);

        alert("Erro ao carregar modalidades.");

    }

}

// =========================
// HORÁRIOS
// =========================
async function carregarHorarios() {

    if (!modalidade.value || !data.value) {

        horario.innerHTML =
            "<option>Selecione modalidade e data</option>";

        return;

    }

    try {

        const resposta = await api(

            `/api/horarios-disponiveis?modalidade=${modalidade.value}&data=${data.value}`

        );

        if (!resposta) return;

        const horarios = await resposta.json();

        horario.innerHTML = "";

        if (horarios.length === 0) {

            horario.innerHTML =
                "<option>Nenhum horário disponível</option>";

            return;

        }

        horarios.forEach((h) => {

            horario.innerHTML += `
                <option value="${h.id}">
                    ${h.horario}
                </option>
            `;

        });

    } catch (erro) {

        console.error(erro);

        alert("Erro ao carregar horários.");

    }

}

// =========================
// CALCULAR VALOR
// =========================
function calcularValor() {

    const total = Number(duracao.value) * VALOR_HORA;

    valor.textContent = total.toLocaleString(

        "pt-BR",

        {

            style: "currency",

            currency: "BRL"

        }

    );

}

duracao.addEventListener("change", calcularValor);
modalidade.addEventListener("change", carregarHorarios);
data.addEventListener("change", carregarHorarios);

// =========================
// RESERVAR
// =========================
formulario.addEventListener("submit", async (e) => {

    e.preventDefault();

    try {

        const resposta = await api(

            "/api/reservar",

            {

                method: "POST",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify({

                    modalidade_id: modalidade.value,

                    data: data.value,

                    horario_id: horario.value,

                    duracao: Number(duracao.value),

                    valor: Number(duracao.value) * VALOR_HORA

                })

            }

        );

        if (!resposta) return;

        const dados = await resposta.json();

        if (!resposta.ok) {

            alert(dados.erro);

            return;

        }

        alert("✅ Reserva criada com sucesso!");

        formulario.reset();

        calcularValor();

        carregarHorarios();

    } catch (erro) {

        console.error(erro);

        alert("Erro ao criar reserva.");

    }

});

// =========================
// INICIAR
// =========================
carregarModalidades();

calcularValor();