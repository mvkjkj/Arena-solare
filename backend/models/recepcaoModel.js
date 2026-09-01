const db = require("../database/database");

// =========================
// AGENDA DO DIA
// =========================
function agendaDoDia(data, callback) {

    db.all(

        `SELECT

            horarios.id AS horario_id,

            horarios.horario,

            reservas.id,

            reservas.usuario_id,

            reservas.modalidade_id,

            reservas.data,

            reservas.pagamento,

            reservas.status,

            usuarios.nome AS cliente,

            modalidades.nome AS modalidade

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
function checkin(id, callback) {

    db.run(

        `UPDATE reservas

        SET status='CHECK-IN'

        WHERE id=?`,

        [id],

        function (erro) {

            callback(erro, this.changes);

        }

    );

}

// =========================
// BUSCAR RESERVA
// =========================
function buscarReserva(id, callback) {

    db.get(

        `SELECT *

        FROM reservas

        WHERE id=?`,

        [id],

        callback

    );

}

// =========================
// LISTAR RESERVAS DO CLIENTE
// =========================
function reservasCliente(usuario_id, callback) {

    db.all(

        `SELECT

            reservas.id,

            reservas.data,

            horarios.horario,

            modalidades.nome AS modalidade,

            reservas.pagamento,

            reservas.status

        FROM reservas

        JOIN horarios

            ON horarios.id = reservas.horario_id

        JOIN modalidades

            ON modalidades.id = reservas.modalidade_id

        WHERE reservas.usuario_id=?

        ORDER BY reservas.data DESC,

                 horarios.horario ASC`,

        [usuario_id],

        callback

    );

}

// =========================
// CONFIRMAR PRESENÇA
// =========================
function confirmarPresenca(id, callback){

    db.run(

        `UPDATE reservas

        SET status='PRESENTE'

        WHERE id=?`,

        [id],

        function(erro){

            callback(erro,this.changes);

        }

    );

}

// =========================
// FINALIZAR RESERVA
// =========================
function finalizarReserva(id, callback){

    db.run(

        `UPDATE reservas

        SET status='FINALIZADA'

        WHERE id=?`,

        [id],

        function(erro){

            callback(erro,this.changes);

        }

    );

}

module.exports = {

    agendaDoDia,

    checkin,

    buscarReserva,

    reservasCliente,

    confirmarPresenca,

    finalizarReserva

};