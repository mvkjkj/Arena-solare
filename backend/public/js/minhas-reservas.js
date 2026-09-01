// ==============================
// MINHAS-RESERVAS.JS
// ==============================

if (!verificarLogin()) {

    throw new Error("Usuário não autenticado.");

}

const lista = document.getElementById("listaReservas");

// ==============================
// CARREGAR RESERVAS
// ==============================

async function carregarReservas(){

    try{

        const resposta = await api(

            "/api/usuario/minhas-reservas"

        );

        if(!resposta) return;

        const reservas = await resposta.json();

        renderizarReservas(reservas);

    }

    catch(erro){

        console.error(erro);

        alert("Erro ao carregar reservas.");

    }

}

// ==============================
// RENDERIZAR
// ==============================

function renderizarReservas(reservas){

    lista.innerHTML = "";

    if(reservas.length === 0){

        lista.innerHTML = `

        <div class="card">

            <h3>

                Você ainda não possui reservas.

            </h3>

        </div>

        `;

        return;

    }

    reservas.forEach(r=>{

        let corStatus = "#28a745";

        if(r.status === "PENDENTE")
            corStatus = "#ffc107";

        if(r.status === "CANCELADA")
            corStatus = "#dc3545";

        let corPagamento = "#28a745";

        if(r.pagamento === "PENDENTE")
            corPagamento = "#ffc107";

        if(r.pagamento === "CANCELADO")
            corPagamento = "#dc3545";

        lista.innerHTML += `

        <div class="card">

            <h2>

                ${r.modalidade}

            </h2>

            <p>

                📅 <b>Data:</b>

                ${r.data}

            </p>

            <p>

                ⏰ <b>Horário:</b>

                ${r.horario}

            </p>

            <p>

                💰 <b>Valor:</b>

                R$ ${Number(r.valor).toFixed(2)}

            </p>

            <p>

                💳 <b>Pagamento:</b>

                <span style="color:${corPagamento};font-weight:bold">

                    ${r.pagamento}

                </span>

            </p>

            <p>

                📌 <b>Status:</b>

                <span style="color:${corStatus};font-weight:bold">

                    ${r.status}

                </span>

            </p>

            ${
                r.status !== "CANCELADA"

                ?

                `

                <button

                    onclick="cancelarReserva(${r.id})">

                    ❌ Cancelar Reserva

                </button>

                `

                :

                ""

            }

        </div>

        `;

    });

}

// ==============================
// CANCELAR
// ==============================

window.cancelarReserva = async function(id){

    if(!confirm("Deseja realmente cancelar esta reserva?")){

        return;

    }

    try{

        const resposta = await api(

            "/api/usuario/minhas-reservas/" +

            id +

            "/cancelar",

            {

                method:"PUT"

            }

        );

        if(!resposta) return;

        const dados = await resposta.json();

        alert(dados.mensagem);

        carregarReservas();

    }

    catch(erro){

        console.error(erro);

        alert("Erro ao cancelar reserva.");

    }

}

// ==============================
// INICIAR
// ==============================

carregarReservas();