const db = require("../database/database");

// =========================
// LISTAR TODAS AS RESERVAS
// =========================
function listarReservas(callback) {

    db.all(

        `SELECT

            reservas.id,

            usuarios.nome AS cliente,

            modalidades.nome AS modalidade,

            reservas.data,

            horarios.horario,

            reservas.duracao,

            reservas.valor,

            reservas.pagamento,

            reservas.status

        FROM reservas

        JOIN usuarios
            ON usuarios.id = reservas.usuario_id

        JOIN modalidades
            ON modalidades.id = reservas.modalidade_id

        JOIN horarios
            ON horarios.id = reservas.horario_id

        ORDER BY reservas.data DESC,
                 horarios.horario ASC`,

        [],

        callback

    );

}

// =========================
// TOTAL DE CLIENTES
// =========================
function totalClientes(callback){

    db.get(

        "SELECT COUNT(*) AS total FROM usuarios WHERE tipo='cliente'",

        [],

        callback

    );

}

// =========================
// TOTAL DE RESERVAS
// =========================
function totalReservas(callback){

    db.get(

        "SELECT COUNT(*) AS total FROM reservas",

        [],

        callback

    );

}

// =========================
// FATURAMENTO
// =========================
function faturamento(callback){

    db.get(

        `SELECT
            IFNULL(SUM(valor),0) AS total
         FROM reservas
         WHERE pagamento='PAGO'`,

        [],

        callback

    );

}

// =========================
// PAGAMENTOS PENDENTES
// =========================
function pagamentosPendentes(callback){

    db.get(

        `SELECT
            COUNT(*) AS total
         FROM reservas
         WHERE pagamento='PENDENTE'`,

        [],

        callback

    );

}

// =========================
// CONFIRMAR PAGAMENTO
// =========================
function confirmarPagamento(id, callback){

    db.run(

        `UPDATE reservas

         SET pagamento='PAGO',

             status='CONFIRMADA'

         WHERE id=?`,

        [id],

        function(erro){

            callback(erro, this.changes);

        }

    );

}

// =========================
// CANCELAR RESERVA
// =========================
function cancelarReserva(id, callback){

    db.run(

        `UPDATE reservas

         SET status='CANCELADA',

             pagamento='CANCELADO'

         WHERE id=?`,

        [id],

        function(erro){

            callback(erro, this.changes);

        }

    );

}

// =========================
// AGENDA DO DIA
// =========================
function agendaDoDia(data, callback) {

    db.all(

        `SELECT

            reservas.id,

            horarios.horario,

            usuarios.nome AS cliente,

            modalidades.nome AS modalidade,

            reservas.pagamento,

            reservas.status,

            reservas.checkin

        FROM horarios

        LEFT JOIN reservas

            ON reservas.horario_id = horarios.id

            AND reservas.data = ?

            AND reservas.status != 'CANCELADA'

        LEFT JOIN usuarios

            ON usuarios.id = reservas.usuario_id

        LEFT JOIN modalidades

            ON modalidades.id = reservas.modalidade_id

        ORDER BY horarios.horario ASC`,

        [data],

        callback

    );

}
// =========================
// CHECK-IN
// =========================
function confirmarCheckin(id, callback){

    db.run(

        `UPDATE reservas

         SET checkin = 1

         WHERE id = ?`,

        [id],

        function(erro){

            callback(erro, this.changes);

        }

    );

}

module.exports = {

    listarReservas,

    totalClientes,

    totalReservas,

    faturamento,

    pagamentosPendentes,

    confirmarPagamento,

    cancelarReserva,

    agendaDoDia,

    confirmarCheckin,

};