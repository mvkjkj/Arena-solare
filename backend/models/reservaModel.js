const db = require("../database/database");

// =========================
// LISTAR MODALIDADES
// =========================
function listarModalidades(callback) {

    db.all(

        "SELECT * FROM modalidades WHERE ativa = 1 ORDER BY nome",

        [],

        callback

    );

}

// =========================
// LISTAR HORÁRIOS
// =========================
function listarHorarios(callback) {

    db.all(

        "SELECT * FROM horarios WHERE ativo = 1 ORDER BY horario",

        [],

        callback

    );

}

// =========================
// VERIFICAR DISPONIBILIDADE
// =========================
function horarioDisponivel(modalidade_id, data, horario_id, callback) {

    db.get(

        `SELECT id
         FROM reservas
         WHERE modalidade_id = ?
         AND data = ?
         AND horario_id = ?
         AND status != 'CANCELADA'`,

        [

            modalidade_id,

            data,

            horario_id

        ],

        (erro, reserva) => {

            callback(erro, !reserva);

        }

    );

}

// =========================
// CRIAR RESERVA
// =========================
function criar(reserva, callback) {

    db.run(

        `INSERT INTO reservas
        (
            usuario_id,
            modalidade_id,
            data,
            horario_id,
            duracao,
            valor
        )
        VALUES (?, ?, ?, ?, ?, ?)`,

        [

            reserva.usuario_id,

            reserva.modalidade_id,

            reserva.data,

            reserva.horario_id,

            reserva.duracao,

            reserva.valor

        ],

        function (erro) {

            callback(erro, this.lastID);

        }

    );

}

// =========================
// LISTAR RESERVAS DO USUÁRIO
// =========================
function listarReservasUsuario(usuario_id, callback) {

    db.all(

        `SELECT

            reservas.id,

            modalidades.nome AS modalidade,

            reservas.data,

            horarios.horario,

            reservas.duracao,

            reservas.valor,

            reservas.pagamento,

            reservas.status

        FROM reservas

        JOIN modalidades

            ON modalidades.id = reservas.modalidade_id

        JOIN horarios

            ON horarios.id = reservas.horario_id

        WHERE reservas.usuario_id = ?

        ORDER BY reservas.data DESC,
                 horarios.horario ASC`,

        [usuario_id],

        callback

    );

}

// =========================
// CANCELAR RESERVA
// =========================
function cancelarReserva(id, usuario_id, callback) {

    db.run(

        `UPDATE reservas
        SET status = 'CANCELADA'
        WHERE id = ? AND usuario_id = ?`,

        [id, usuario_id],

        function (erro) {

            callback(erro, this.changes);

        }

    );

}

// =========================
// LISTAR HORÁRIOS DISPONÍVEIS
// =========================
function listarHorariosDisponiveis(data, modalidade_id, callback) {

    db.all(

        `SELECT *
         FROM horarios
         WHERE ativo = 1
         AND id NOT IN (

            SELECT horario_id
            FROM reservas
            WHERE data = ?
            AND modalidade_id = ?
            AND status != 'CANCELADA'

         )
         ORDER BY horario`,

        [data, modalidade_id],

        callback

    );

}

// =========================
// BUSCAR PAGAMENTO
// =========================
function buscarPagamento(id, usuario_id, callback){

    db.get(

        `SELECT

            reservas.id,

            modalidades.nome AS modalidade,

            reservas.data,

            horarios.horario,

            reservas.duracao,

            reservas.valor,

            reservas.pagamento

        FROM reservas

        JOIN modalidades
            ON modalidades.id = reservas.modalidade_id

        JOIN horarios
            ON horarios.id = reservas.horario_id

        WHERE reservas.id = ?

        AND reservas.usuario_id = ?`,

        [id, usuario_id],

        callback

    );

}

// =========================
// CONFIRMAR PAGAMENTO
// =========================
function confirmarPagamento(id, usuario_id, callback){

    db.run(

        `UPDATE reservas
         SET pagamento = 'PAGO',
             status = 'CONFIRMADA'
         WHERE id = ?
         AND usuario_id = ?`,

        [id, usuario_id],

        function(erro){

            callback(erro, this.changes);

        }

    );

}

// =========================
// EXPORTAÇÕES
// =========================
module.exports = {

    listarModalidades,

    listarHorarios,

    horarioDisponivel,

    criar,

    listarReservasUsuario,

    cancelarReserva,

    listarHorariosDisponiveis,

    buscarPagamento,

     confirmarPagamento,
};