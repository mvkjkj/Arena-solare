const db = require("../database/database");

// =========================
// BUSCAR POR EMAIL
// =========================
function buscarPorEmail(email, callback) {

    db.get(

        "SELECT * FROM usuarios WHERE email=?",

        [email],

        callback

    );

}

// =========================
// BUSCAR POR ID
// =========================
function buscarPorId(id, callback) {

    db.get(

        `SELECT
            id,
            nome,
            email,
            telefone,
            foto,
            criado_em
        FROM usuarios
        WHERE id=?`,

        [id],

        callback

    );

}

// =========================
// ATUALIZAR DADOS
// =========================
function atualizar(id, nome, telefone, callback) {

    db.run(

        `UPDATE usuarios

        SET nome=?,
            telefone=?

        WHERE id=?`,

        [nome, telefone, id],

        function (erro) {

            callback(erro, this.changes);

        }

    );

}

// =========================
// ALTERAR SENHA
// =========================
function alterarSenha(id, senha, callback) {

    db.run(

        `UPDATE usuarios

        SET senha=?

        WHERE id=?`,

        [senha, id],

        function (erro) {

            callback(erro, this.changes);

        }

    );

}

// =========================
// ESTATÍSTICAS
// =========================
function estatisticas(id, callback) {

    db.get(

        `SELECT

            COUNT(*) AS reservas,

            IFNULL(SUM(valor),0) AS total

        FROM reservas

        WHERE usuario_id=?`,

        [id],

        callback

    );

}

// ==============================
// MINHAS RESERVAS
// ==============================

function minhasReservas(usuarioId, callback){

    db.all(

        `SELECT

            reservas.id,

            reservas.data,

            horarios.horario,

            modalidades.nome AS modalidade,

            reservas.valor,

            reservas.pagamento,

            reservas.status

        FROM reservas

        INNER JOIN modalidades

            ON modalidades.id = reservas.modalidade_id

        INNER JOIN horarios

            ON horarios.id = reservas.horario_id

        WHERE reservas.usuario_id = ?

        ORDER BY reservas.data DESC,
                 horarios.horario ASC`,

        [usuarioId],

        callback

    );

}

// ==============================
// CANCELAR MINHA RESERVA
// ==============================

function cancelarMinhaReserva(id, usuarioId, callback){

    db.run(

        `UPDATE reservas

         SET status='CANCELADA',

             pagamento='CANCELADO'

         WHERE id=?

         AND usuario_id=?`,

        [id, usuarioId],

        function(erro){

            callback(erro,this.changes);

        }

    );

}

// ==============================
// BUSCAR PERFIL
// ==============================

function buscarPerfil(id, callback){

    db.get(

        `SELECT

            id,

            nome,

            email,

            telefone,

            tipo

        FROM usuarios

        WHERE id = ?`,

        [id],

        callback

    );

}

// ==============================
// ATUALIZAR PERFIL
// ==============================

function atualizarPerfil(id, nome, telefone, callback){

    db.run(

        `UPDATE usuarios

        SET nome=?,

            telefone=?

        WHERE id=?`,

        [nome, telefone, id],

        function(erro){

            callback(erro, this.changes);

        }

    );

}

// ==============================
// ALTERAR SENHA
// ==============================

function alterarSenha(id, senha, callback){

    db.run(

        `UPDATE usuarios

        SET senha=?

        WHERE id=?`,

        [senha, id],

        function(erro){

            callback(erro, this.changes);

        }

    );

}

module.exports = {

    buscarPorEmail,
    buscarPorId,
    buscarPerfil,
    atualizar,
    atualizarPerfil,
    alterarSenha,
    atualizar,
    alterarSenha,
    estatisticas,
    minhasReservas,
    cancelarMinhaReserva,

};