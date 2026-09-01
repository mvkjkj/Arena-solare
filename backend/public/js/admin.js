// =====================
// VERIFICA LOGIN
// =====================
if (!verificarLogin()) {
    throw new Error("Usuário não autenticado.");
}

// Lista de reservas para pesquisa
let reservas = [];

// =====================
// ESTATÍSTICAS
// =====================
async function carregarEstatisticas() {

    try {

        const resposta = await api("/api/admin/estatisticas");

        if (!resposta) return;

        const dados = await resposta.json();

        document.getElementById("clientes").textContent = dados.clientes;

        document.getElementById("reservas").textContent = dados.reservas;

        document.getElementById("pendentes").textContent = dados.pendentes;

        document.getElementById("faturamento").textContent =
            Number(dados.faturamento).toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL"
            });

    } catch (erro) {

        console.error(erro);
        alert("Erro ao carregar estatísticas.");

    }

}

// =====================
// MOSTRAR RESERVAS
// =====================
function mostrarReservas(lista) {

    const tabela = document.getElementById("listaReservas");

    tabela.innerHTML = "";

    if (lista.length === 0) {

        tabela.innerHTML = `

        <tr>

            <td colspan="9">

                Nenhuma reserva encontrada.

            </td>

        </tr>

        `;

        return;

    }

    lista.forEach(r => {

        tabela.innerHTML += `

        <tr>

            <td>${r.cliente}</td>

            <td>${r.modalidade}</td>

            <td>${r.data}</td>

            <td>${r.horario}</td>

            <td>R$ ${Number(r.valor).toFixed(2)}</td>

            <td>${r.pagamento}</td>

            <td>${r.status}</td>

            <td>

                ${
                    r.pagamento === "PENDENTE"

                    ?

                    `<button onclick="confirmarPagamento(${r.id})">

                        ✔ Confirmar

                    </button>`

                    :

                    `<span style="color:green;font-weight:bold">

                        ✔ Pago

                    </span>`
                }

            </td>

            <td>

                ${
                    r.status !== "CANCELADA"

                    ?

                    `<button onclick="cancelarReserva(${r.id})">

                        ❌ Cancelar

                    </button>`

                    :

                    `<span style="color:red;font-weight:bold">

                        Cancelada

                    </span>`
                }

            </td>

        </tr>

        `;

    });

}

// =====================
// CARREGAR RESERVAS
// =====================
async function carregarReservas() {

    try {

        const resposta = await api("/api/admin/reservas");

        if (!resposta) return;

        reservas = await resposta.json();

        mostrarReservas(reservas);

    } catch (erro) {

        console.error(erro);

        alert("Erro ao carregar reservas.");

    }

}

// =====================
// PESQUISA
// =====================
const campoPesquisa = document.getElementById("pesquisa");

if (campoPesquisa) {

    campoPesquisa.addEventListener("input", function () {

        const texto = this.value.toLowerCase();

        const filtradas = reservas.filter(r =>

            r.cliente.toLowerCase().includes(texto) ||

            r.modalidade.toLowerCase().includes(texto) ||

            r.status.toLowerCase().includes(texto)

        );

        mostrarReservas(filtradas);

    });

}

// =====================
// CONFIRMAR PAGAMENTO
// =====================
async function confirmarPagamento(id) {

    if (!confirm("Deseja confirmar este pagamento?")) {

        return;

    }

    try {

        const resposta = await api(

            "/api/admin/pagamento/" + id,

            {

                method: "PUT"

            }

        );

        if (!resposta) return;

        const dados = await resposta.json();

        alert(dados.mensagem);

        carregarEstatisticas();

        carregarReservas();

    } catch (erro) {

        console.error(erro);

        alert("Erro ao confirmar pagamento.");

    }

}

// =====================
// CANCELAR RESERVA
// =====================
async function cancelarReserva(id) {

    if (!confirm("Deseja cancelar esta reserva?")) {

        return;

    }

    try {

        const resposta = await api(

            "/api/admin/reserva/" + id + "/cancelar",

            {

                method: "PUT"

            }

        );

        if (!resposta) return;

        const dados = await resposta.json();

        alert(dados.mensagem);

        carregarReservas();

        carregarEstatisticas();

    }

    catch (erro) {

        console.error(erro);

        alert("Erro ao cancelar reserva.");

    }

}

// =====================
// INICIAR
// =====================
carregarEstatisticas();

carregarReservas();