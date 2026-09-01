// ==============================
// RECEPCAO.JS
// ==============================

if (!verificarLogin()) {
    throw new Error("Usuário não autenticado.");
}

const tabela = document.getElementById("agenda");
const pesquisa = document.getElementById("pesquisa");
const data = document.getElementById("data");

const modal = document.getElementById("modal");

const cliente = document.getElementById("cliente");
const modalidade = document.getElementById("modalidade");
const horario = document.getElementById("horario");

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
data.value = hoje;

// ==============================
// CARREGAR AGENDA
// ==============================

async function carregarAgenda() {

    try {

        const resposta = await api(
            "/api/recepcao/agenda?data=" + data.value
        );

        if (!resposta) return;

        reservas = await resposta.json();

        renderizarTabela(reservas);

    } catch (erro) {

        console.error(erro);

        alert("Erro ao carregar agenda.");

    }

}

// ==============================
// RENDERIZAR
// ==============================

function renderizarTabela(lista) {

    tabela.innerHTML = "";

    if (lista.length === 0) {

        tabela.innerHTML = `

        <tr>

            <td colspan="6">

                Nenhuma reserva encontrada.

            </td>

        </tr>

        `;

        return;

    }

    lista.forEach(r => {

        let status = r.status ?? "LIVRE";

        if (r.checkin == 1) {

            status = "🟢 PRESENTE";

        }

        tabela.innerHTML += `

        <tr>

            <td>${r.horario}</td>

            <td>${r.cliente ?? "-"}</td>

            <td>${r.modalidade ?? "-"}</td>

            <td>${r.pagamento ?? "-"}</td>

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

pesquisa.addEventListener("keyup", () => {

    const texto = pesquisa.value.toLowerCase();

    const filtradas = reservas.filter(r => {

        return (

            (r.cliente || "").toLowerCase().includes(texto) ||

            (r.modalidade || "").toLowerCase().includes(texto) ||

            (r.status || "").toLowerCase().includes(texto)

        );

    });

    renderizarTabela(filtradas);

});

// ==============================
// MUDANÇA DE DATA
// ==============================

data.addEventListener("change", carregarAgenda);

// ==============================
// ABRIR MODAL
// ==============================

window.abrirModal = function(id) {

    reservaSelecionada = reservas.find(r => r.id == id);

    if (!reservaSelecionada) return;

    cliente.textContent =
        "Cliente: " + reservaSelecionada.cliente;

    modalidade.textContent =
        "Modalidade: " + reservaSelecionada.modalidade;

    horario.textContent =
        "Horário: " + reservaSelecionada.horario;

    if (reservaSelecionada.checkin == 1) {

        btnCheckin.disabled = true;

        btnCheckin.textContent = "✅ Cliente Presente";

    } else {

        btnCheckin.disabled = false;

        btnCheckin.textContent = "✔ Fazer Check-in";

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
// NOVA RESERVA
// ==============================

window.novaReserva = function(horario){

    location.href =
        "/pages/reserva.html?data="

        + data.value

        + "&horario="

        + horario;

};

// ==============================
// EDITAR RESERVA
// ==============================

window.editarReserva = function(id){

    location.href =
        "/pages/reserva.html?id=" + id;

};

// ==============================
// CONFIRMAR PAGAMENTO
// ==============================

btnPagamento.onclick = async function(){

    if(!reservaSelecionada) return;

    try{

        const resposta = await api(

            "/api/admin/pagamento/" +

            reservaSelecionada.id,

            {

                method:"PUT"

            }

        );

        if(!resposta) return;

        const dados = await resposta.json();

        alert(dados.mensagem);

        modal.style.display="none";

        carregarAgenda();

    }

    catch(erro){

        console.error(erro);

        alert("Erro ao confirmar pagamento.");

    }

};

// ==============================
// CHECK-IN
// ==============================

btnCheckin.onclick = async function(){

    if(!reservaSelecionada) return;

    try{

        const resposta = await api(

            "/api/admin/checkin/" +

            reservaSelecionada.id,

            {

                method:"PUT"

            }

        );

        if(!resposta) return;

        const dados = await resposta.json();

        alert(dados.mensagem);

        modal.style.display="none";

        carregarAgenda();

    }

    catch(erro){

        console.error(erro);

        alert("Erro ao realizar check-in.");

    }

};

// ==============================
// CANCELAR RESERVA
// ==============================

btnCancelar.onclick = async function(){

    if(!reservaSelecionada) return;

    if(!confirm("Deseja cancelar esta reserva?")){

        return;

    }

    try{

        const resposta = await api(

            "/api/admin/reserva/" +

            reservaSelecionada.id +

            "/cancelar",

            {

                method:"PUT"

            }

        );

        if(!resposta) return;

        const dados = await resposta.json();

        alert(dados.mensagem);

        modal.style.display="none";

        carregarAgenda();

    }

    catch(erro){

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