const db = require("../database/database");

// =======================================
// BUSCAR RESERVA
// =======================================
function buscarReserva(id, callback) {

    db.get(

        `SELECT
            reservas.*,
            usuarios.nome,
            usuarios.email,
            modalidades.nome AS modalidade,
            horarios.horario

        FROM reservas

        JOIN usuarios
            ON usuarios.id = reservas.usuario_id

        JOIN modalidades
            ON modalidades.id = reservas.modalidade_id

        JOIN horarios
            ON horarios.id = reservas.horario_id

        WHERE reservas.id=?`,

        [id],

        callback

    );

}

// =======================================
// CONFIRMAR PAGAMENTO
// =======================================
function confirmar(id, callback) {

    db.run(

        `UPDATE reservas

        SET pagamento='PAGO',

            status='CONFIRMADA'

        WHERE id=?`,

        [id],

        function (erro) {

            callback(erro, this.changes);

        }

    );

}

// =======================================
// CANCELAR PAGAMENTO
// =======================================
function cancelar(id, callback) {

    db.run(

        `UPDATE reservas

        SET pagamento='CANCELADO'

        WHERE id=?`,

        [id],

        function (erro) {

            callback(erro, this.changes);

        }

    );

}

// =======================================
// LISTAR PAGAMENTOS
// =======================================
function listar(callback) {

    db.all(

        `SELECT

            reservas.id,

            usuarios.nome AS cliente,

            reservas.valor,

            reservas.pagamento,

            reservas.status,

            reservas.data,

            horarios.horario

        FROM reservas

        JOIN usuarios

            ON usuarios.id = reservas.usuario_id

        JOIN horarios

            ON horarios.id = reservas.horario_id

        ORDER BY reservas.data DESC`,

        [],

        callback

    );

}

module.exports = {

    buscarReserva,

    confirmar,

    cancelar,

    listar

};