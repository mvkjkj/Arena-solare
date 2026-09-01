const adminModel = require("../models/adminModel");

// =========================
// LISTAR RESERVAS
// =========================
const listarReservas = (req, res) => {

    adminModel.listarReservas((erro, reservas) => {

        if (erro) {

            return res.status(500).json(erro);

        }

        res.json(reservas);

    });

};



// =========================
// ESTATÍSTICAS
// =========================
const estatisticas = (req, res) => {

    adminModel.totalClientes((e1, clientes) => {

        if (e1) return res.status(500).json(e1);

        adminModel.totalReservas((e2, reservas) => {

            if (e2) return res.status(500).json(e2);

            adminModel.faturamento((e3, faturamento) => {

                if (e3) return res.status(500).json(e3);

                adminModel.pagamentosPendentes((e4, pendentes) => {

                    if (e4) return res.status(500).json(e4);

                    res.json({

                        clientes: clientes.total,

                        reservas: reservas.total,

                        faturamento: faturamento.total,

                        pendentes: pendentes.total

                    });

                });

            });

        });

    });

};

// =========================
// CONFIRMAR PAGAMENTO
// =========================
const confirmarPagamento = (req, res) => {

    adminModel.confirmarPagamento(

        req.params.id,

        (erro, alteradas) => {

            if (erro) {

                return res.status(500).json(erro);

            }

            if (alteradas === 0) {

                return res.status(404).json({

                    erro: "Reserva não encontrada."

                });

            }

            res.json({

                mensagem: "Pagamento confirmado com sucesso."

            });

        }

    );

};

// =========================
// CANCELAR RESERVA
// =========================
const cancelarReserva = (req, res) => {

    adminModel.cancelarReserva(

        req.params.id,

        (erro, alteradas) => {

            if (erro) {

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
// AGENDA DO DIA
// =========================
const agendaDoDia = (req, res) => {

    const data = req.query.data;

    adminModel.agendaDoDia(data, (erro, agenda) => {

        if (erro) {

            return res.status(500).json(erro);

        }

        res.json(agenda);

    });

};

// =========================
// CHECK-IN
// =========================
const confirmarCheckin = (req,res)=>{

    adminModel.confirmarCheckin(

        req.params.id,

        (erro,alteradas)=>{

            if(erro){

                return res.status(500).json(erro);

            }

            if(alteradas===0){

                return res.status(404).json({

                    erro:"Reserva não encontrada."

                });

            }

            res.json({

                mensagem:"Check-in realizado com sucesso."

            });

        }

    );

};

module.exports = {

    listarReservas,

    estatisticas,

    confirmarPagamento,

    cancelarReserva,

    agendaDoDia,

    confirmarCheckin,

};