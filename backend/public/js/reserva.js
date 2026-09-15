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

        const resposta = await api("/api/modalidades");

        if (!resposta) return;

        if (!resposta.ok) {
            throw new Error("Erro ao carregar modalidades.");
        }

        const modalidades = await resposta.json();

        modalidade.innerHTML =
            '<option value="">Selecione</option>';

        modalidades.forEach((m) => {

            modalidade.innerHTML += `
                <option value="${m.id}">
                    ${m.nome}
                </option>
            `;

        });

    } catch (erro) {

        console.error("Erro nas modalidades:", erro);

        alert("Erro ao carregar modalidades.");

    }

}


// =========================
// HORÁRIOS DISPONÍVEIS
// =========================

async function carregarHorarios() {

    if (!modalidade.value || !data.value) {

        horario.innerHTML =
            "<option value=''>Selecione modalidade e data</option>";

        return;

    }

    try {

        const resposta = await api(
            `/api/horarios-disponiveis?modalidade=${modalidade.value}&data=${data.value}`
        );

        if (!resposta) return;

        if (!resposta.ok) {

            const erro = await resposta.json();

            throw new Error(
                erro.erro || "Erro ao carregar horários."
            );

        }

        const horarios = await resposta.json();

        horario.innerHTML = "";

        if (!horarios || horarios.length === 0) {

            horario.innerHTML =
                "<option value=''>Nenhum horário disponível</option>";

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

        console.error("Erro nos horários:", erro);

        horario.innerHTML =
            "<option value=''>Erro ao carregar horários</option>";

        alert("Erro ao carregar horários.");

    }

}


// =========================
// CALCULAR VALOR
// =========================

function calcularValor() {

    const horas = Number(duracao.value);

    const total = horas * VALOR_HORA;

    valor.textContent = total.toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );

}


// =========================
// EVENTOS
// =========================

duracao.addEventListener(
    "change",
    calcularValor
);

modalidade.addEventListener(
    "change",
    carregarHorarios
);

data.addEventListener(
    "change",
    carregarHorarios
);


// =========================
// CRIAR RESERVA
// =========================

formulario.addEventListener(
    "submit",
    async (e) => {

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

                        valor:
                            Number(duracao.value) *
                            VALOR_HORA

                    })
                }
            );

            if (!resposta) return;


            // =========================
            // RESPOSTA DO SERVIDOR
            // =========================

            const dados = await resposta.json();


            // =========================
            // ERRO
            // =========================

            if (!resposta.ok) {

                alert(
                    dados.erro ||
                    "Não foi possível criar a reserva."
                );

                return;

            }


            // =========================
            // RESERVA CRIADA
            // =========================

            if (dados.reserva) {

                window.location.href =
                    "/pages/pagamento.html?id=" +
                    dados.reserva;

                return;

            }


            // =========================
            // RESERVA SEM ID
            // =========================

            alert(
                "Reserva criada, mas não foi possível abrir o pagamento."
            );

        } catch (erro) {

            console.error(
                "Erro ao criar reserva:",
                erro
            );

            alert(
                "Erro ao criar reserva."
            );

        }

    }
);


// =========================
// INICIAR
// =========================

carregarModalidades();

calcularValor();