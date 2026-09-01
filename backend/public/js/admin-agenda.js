// =========================
// VERIFICA LOGIN
// =========================
if (!verificarLogin()) {

    throw new Error("Usuário não autenticado.");

}

// =========================
// ELEMENTOS
// =========================
const data = document.getElementById("data");
const agenda = document.getElementById("agenda");
const atualizar = document.getElementById("atualizar");

// Data de hoje
const hoje = new Date().toISOString().split("T")[0];
data.value = hoje;

// =========================
// CARREGAR AGENDA
// =========================
async function carregarAgenda() {

    agenda.innerHTML = "<p class='carregando'>Carregando agenda...</p>";

    try {

        const resposta = await api(

            "/api/admin/agenda?data=" + data.value

        );

        if (!resposta) return;

        const horarios = await resposta.json();

        agenda.innerHTML = "";

        if (horarios.length === 0) {

            agenda.innerHTML = "<p>Nenhum horário encontrado.</p>";

            return;

        }

        horarios.forEach(h => {

            let classe = "livre";
            let status = "🟢 Livre";
            let descricao = "Disponível para reserva";

            if (h.id) {

                if (h.pagamento === "PENDENTE") {

                    classe = "pendente";
                    status = "🟡 Pagamento Pendente";

                } else {

                    classe = "ocupado";
                    status = "🔴 Reservado";

                }

                descricao = `
                    <strong>${h.cliente}</strong><br>
                    ${h.modalidade}
                `;

            }

            agenda.innerHTML += `

            <div class="card ${classe}">

                <div class="horario">

                    ${h.horario}

                </div>

                <div class="info">

                    ${descricao}

                </div>

                <div class="status">

                    ${status}

                </div>

            </div>

            `;

        });

    }

    catch (erro) {

        console.error(erro);

        alert("Erro ao carregar agenda.");

    }

}

// =========================
// EVENTOS
// =========================
atualizar.addEventListener("click", carregarAgenda);

data.addEventListener("change", carregarAgenda);

// =========================
// INICIAR
// =========================
carregarAgenda();