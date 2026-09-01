const reservaModel = require("../models/reservaModel");

// =========================
// LISTAR MODALIDADES
// =========================
const modalidades = (req, res) => {

    reservaModel.listarModalidades((erro, dados) => {

        if (erro) {
            console.error("Erro ao listar modalidades:", erro);
            return res.status(500).json(erro);
        }

        res.json(dados);

    });

};

// =========================
// LISTAR HORÁRIOS
// =========================
const horarios = (req, res) => {

    reservaModel.listarHorarios((erro, dados) => {

        if (erro) {
            console.error("Erro ao listar horários:", erro);
            return res.status(500).json(erro);
        }

        res.json(dados);

    });

};

// =========================
// CRIAR RESERVA
// =========================
const reservar = (req, res) => {

    const usuario_id = req.usuario.id;

    const {
        modalidade_id,
        data,
        horario_id,
        duracao,
        valor
    } = req.body;

    if (!usuario_id || !modalidade_id || !data || !horario_id) {

        return res.status(400).json({
            erro: "Preencha todos os campos."
        });

    }

    reservaModel.horarioDisponivel(

        modalidade_id,
        data,
        horario_id,

        (erro, disponivel) => {

            if (erro) {
                console.error("Erro ao verificar disponibilidade:", erro);
                return res.status(500).json(erro);
            }

            if (!disponivel) {

                return res.status(400).json({
                    erro: "Este horário já está reservado."
                });

            }

            reservaModel.criar({

                usuario_id,
                modalidade_id,
                data,
                horario_id,
                duracao,
                valor

            },

            (erro, id) => {

                if (erro) {
                    console.error("Erro ao criar reserva:", erro);
                    return res.status(500).json(erro);
                }

                res.status(201).json({

                    mensagem: "Reserva criada com sucesso!",
                    reserva: id

                });

            });

        }

    );

};

// =========================
// LISTAR RESERVAS
// =========================
const minhasReservas = (req, res) => {

    console.log("Entrou em minhasReservas");

    reservaModel.listarReservasUsuario(

        req.usuario.id,

        (erro, dados) => {

            if (erro) {

                console.log("ERRO DO SQLITE:");
                console.log(erro);

                return res.status(500).json({
                    erro: erro.message
                });

            }

            console.log("Reservas encontradas:", dados);

            res.json(dados);

        }

    );

};

// =========================
// CANCELAR RESERVA
// =========================
const cancelarReserva = (req, res) => {

    reservaModel.cancelarReserva(

        req.params.id,
        req.usuario.id,

        (erro, alteradas) => {

            if (erro) {
                console.error("Erro ao cancelar reserva:", erro);
                return res.status(500).json(erro);
            }

            if (alteradas === 0) {

                return res.status(404).json({
                    erro: "Reserva não encontrada."
                });

            }

            res.json({
                mensagem: "Reserva cancelada com sucesso."
            });

        }

    );

};

// =========================
// HORÁRIOS DISPONÍVEIS
// =========================
const horariosDisponiveis = (req, res) => {

    const { data, modalidade } = req.query;

    reservaModel.listarHorariosDisponiveis(

        data,
        modalidade,

        (erro, dados) => {

            if (erro) {
                console.error("Erro ao listar horários disponíveis:", erro);
                return res.status(500).json(erro);
            }

            res.json(dados);

        }

    );

};

// =========================
// BUSCAR PAGAMENTO
// =========================
const buscarPagamento = (req, res) => {

    reservaModel.buscarPagamento(

        req.params.id,
        req.usuario.id,

        (erro, reserva) => {

            if (erro) {
                console.error("Erro ao buscar pagamento:", erro);
                return res.status(500).json(erro);
            }

            if (!reserva) {

                return res.status(404).json({
                    erro: "Reserva não encontrada."
                });

            }

            res.json(reserva);

        }

    );

};

// =========================
// CONFIRMAR PAGAMENTO
// =========================
const confirmarPagamento = (req, res) => {

    reservaModel.confirmarPagamento(

        req.params.id,
        req.usuario.id,

        (erro, alteradas) => {

            if (erro) {
                console.error("Erro ao confirmar pagamento:", erro);
                return res.status(500).json(erro);
            }

            if (alteradas === 0) {

                return res.status(404).json({
                    erro: "Reserva não encontrada."
                });

            }

            res.json({
                mensagem: "Pagamento confirmado com sucesso!"
            });

        }

    );

};

// =========================
// EXPORTAÇÕES
// =========================
module.exports = {

    modalidades,
    horarios,
    reservar,
    minhasReservas,
    cancelarReserva,
    horariosDisponiveis,
    buscarPagamento,
    confirmarPagamento

};