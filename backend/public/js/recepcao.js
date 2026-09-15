// ==============================
// RECEPÇÃO - SOLARE ARENA
// ==============================

if (!verificarLogin()) {
    throw new Error("Usuário não autenticado.");
}

const tabela = document.getElementById("listaReservas");
const pesquisa = document.getElementById("pesquisa");
const data = document.getElementById("data");

const modal = document.getElementById("modal");

const cliente = document.getElementById("modalCliente");
const modalidade = document.getElementById("modalModalidade");
const horario = document.getElementById("modalHorario");
const valor = document.getElementById("modalValor");

const btnNovaReserva = document.getElementById("novaReserva");
const btnPagamento = document.getElementById("confirmarPagamento");
const btnCheckin = document.getElementById("checkin");
const btnCancelar = document.getElementById("cancelar");
const btnFechar = document.getElementById("fechar");

let reservas = [];
let reservaSelecionada = null;

// ==============================
// DATA ATUAL
// ==============================

const hoje = new Date().toISOString().split("T")[0];

if (data) {
    data.value = hoje;
}

// ==============================
// CARREGAR AGENDA
// ==============================

async function carregarAgenda() {
    try {
        const resposta = await api(
            "/api/recepcao/agenda?data=" + data.value
        );

        if (!resposta) return;

        if (!resposta.ok) {
            const erro = await resposta.json();
            throw new Error(erro.erro || "Erro ao carregar agenda.");
        }

        reservas = await resposta.json();

        renderizarTabela(reservas);

    } catch (erro) {
        console.error("Erro ao carregar agenda:", erro);

        tabela.innerHTML = `
            <tr>
                <td colspan="7">
                    Erro ao carregar reservas.
                </td>
            </tr>
        `;
    }
}

// ==============================
// RENDERIZAR TABELA
// ==============================

function renderizarTabela(lista) {

    tabela.innerHTML = "";

    if (!lista || lista.length === 0) {

        tabela.innerHTML = `
            <tr>
                <td colspan="7">
                    Nenhuma reserva encontrada.
                </td>
            </tr>
        `;

        return;
    }

    lista.forEach(r => {

        let status = r.status || "LIVRE";

        if (r.checkin == 1) {
            status = "🟢 PRESENTE";
        }

        tabela.innerHTML += `
            <tr>

                <td>${r.horario || "-"}</td>

                <td>${r.cliente || "-"}</td>

                <td>${r.modalidade || "-"}</td>

                <td>
                    ${r.valor != null
                        ? "R$ " + Number(r.valor).toFixed(2).replace(".", ",")
                        : "-"
                    }
                </td>

                <td>${r.pagamento || "-"}</td>

                <td>${status}</td>

                <td>

                    ${
                        r.id

                        ?

                        `
                        <button
                            class="btnPago"
                            onclick="abrirModal(${r.id})">
                            Gerenciar
                        </button>

                        <button
                            class="btnEditar"
                            onclick="editarReserva(${r.id})">
                            Editar
                        </button>
                        `

                        :

                        `
                        <button
                            class="btnLivre"
                            onclick="novaReserva('${r.horario}')">
                            Nova Reserva
                        </button>
                        `
                    }

                </td>

            </tr>
        `;
    });
}

// ==============================
// PESQUISA
// ==============================

if (pesquisa) {

    pesquisa.addEventListener("keyup", () => {

        const texto = pesquisa.value.toLowerCase().trim();

        const filtradas = reservas.filter(r => {

            return (
                (r.cliente || "").toLowerCase().includes(texto) ||
                (r.modalidade || "").toLowerCase().includes(texto) ||
                (r.status || "").toLowerCase().includes(texto)
            );

        });

        renderizarTabela(filtradas);
    });
}

// ==============================
// MUDANÇA DE DATA
// ==============================

if (data) {
    data.addEventListener("change", carregarAgenda);
}

// ==============================
// NOVA RESERVA
// ==============================

window.novaReserva = function (horarioSelecionado) {

    location.href =
        "/pages/reserva.html?data=" +
        data.value +
        "&horario=" +
        encodeURIComponent(horarioSelecionado);

};

// ==============================
// ABRIR MODAL
// ==============================

window.abrirModal = function (id) {

    reservaSelecionada = reservas.find(
        r => r.id == id
    );

    if (!reservaSelecionada) return;

    cliente.textContent =
        reservaSelecionada.cliente || "-";

    modalidade.textContent =
        reservaSelecionada.modalidade || "-";

    horario.textContent =
        reservaSelecionada.horario || "-";

    valor.textContent =
        reservaSelecionada.valor != null
            ? "R$ " + Number(reservaSelecionada.valor)
                .toFixed(2)
                .replace(".", ",")
            : "-";

    if (reservaSelecionada.checkin == 1) {

        btnCheckin.disabled = true;
        btnCheckin.textContent = "✅ Cliente Presente";

    } else {

        btnCheckin.disabled = false;
        btnCheckin.textContent = "✅ Fazer Check-in";

    }

    modal.style.display = "flex";
};

// ==============================
// FECHAR MODAL
// ==============================

btnFechar.onclick = () => {
    modal.style.display = "none";
};

// ==============================
// EDITAR RESERVA
// ==============================

window.editarReserva = function (id) {

    location.href =
        "/pages/reserva.html?id=" + id;

};

// ==============================
// CONFIRMAR PAGAMENTO
// ==============================

btnPagamento.onclick = async function () {

    if (!reservaSelecionada) return;

    try {

        const resposta = await api(
            "/api/admin/pagamento/" +
            reservaSelecionada.id,
            {
                method: "PUT"
            }
        );

        if (!resposta) return;

        const dados = await resposta.json();

        alert(dados.mensagem || dados.erro);

        if (resposta.ok) {
            modal.style.display = "none";
            carregarAgenda();
        }

    } catch (erro) {

        console.error(erro);

        alert("Erro ao confirmar pagamento.");
    }
};

// ==============================
// CHECK-IN
// ==============================

btnCheckin.onclick = async function () {

    if (!reservaSelecionada) return;

    try {

        const resposta = await api(
            "/api/admin/checkin/" +
            reservaSelecionada.id,
            {
                method: "PUT"
            }
        );

        if (!resposta) return;

        const dados = await resposta.json();

        alert(dados.mensagem || dados.erro);

        if (resposta.ok) {
            modal.style.display = "none";
            carregarAgenda();
        }

    } catch (erro) {

        console.error(erro);

        alert("Erro ao realizar check-in.");
    }
};

// ==============================
// CANCELAR RESERVA
// ==============================

btnCancelar.onclick = async function () {

    if (!reservaSelecionada) return;

    if (!confirm("Deseja cancelar esta reserva?")) {
        return;
    }

    try {

        const resposta = await api(
            "/api/admin/reserva/" +
            reservaSelecionada.id +
            "/cancelar",
            {
                method: "PUT"
            }
        );

        if (!resposta) return;

        const dados = await resposta.json();

        alert(dados.mensagem || dados.erro);

        if (resposta.ok) {
            modal.style.display = "none";
            carregarAgenda();
        }

    } catch (erro) {

        console.error(erro);

        alert("Erro ao cancelar reserva.");
    }
};

// ==============================
// ATUALIZAÇÃO AUTOMÁTICA
// ==============================

setInterval(() => {
    carregarAgenda();
}, 30000);

// ==============================
// INICIAR
// ==============================

carregarAgenda();