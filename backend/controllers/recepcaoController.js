const recepcaoModel = require("../models/recepcaoModel");

// =========================
// AGENDA DO DIA
// =========================
const agenda = (req, res) => {

    const data = req.query.data;

    if (!data) {

        return res.status(400).json({

            erro: "Data não informada."

        });

    }

    recepcaoModel.agendaDoDia(data, (erro, agenda) => {

        if (erro) {

            console.error(erro);

            return res.status(500).json({

                erro: "Erro ao carregar agenda."

            });

        }

        res.json(agenda);

    });

};

// =========================
// CHECK-IN
// =========================
const checkin = (req, res) => {

    recepcaoModel.checkin(

        req.params.id,

        (erro, alteradas) => {

            if (erro) {

                console.error(erro);

                return res.status(500).json({

                    erro: "Erro ao realizar check-in."

                });

            }

            if (alteradas === 0) {

                return res.status(404).json({

                    erro: "Reserva não encontrada."

                });

            }

            res.json({

                mensagem: "Check-in realizado com sucesso."

            });

        }

    );

};

// =========================
// BUSCAR RESERVA
// =========================
const buscarReserva = (req, res) => {

    recepcaoModel.buscarReserva(

        req.params.id,

        (erro, reserva) => {

            if (erro) {

                console.error(erro);

                return res.status(500).json({

                    erro: "Erro ao buscar reserva."

                });

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
// RESERVAS DO CLIENTE
// =========================
const reservasCliente = (req, res) => {

    recepcaoModel.reservasCliente(

        req.params.usuario,

        (erro, reservas) => {

            if (erro) {

                console.error(erro);

                return res.status(500).json({

                    erro: "Erro ao listar reservas."

                });

            }

            res.json(reservas);

        }

    );

};

// =========================
// CONFIRMAR PRESENÇA
// =========================
const confirmarPresenca = (req, res) => {

    recepcaoModel.confirmarPresenca(

        req.params.id,

        (erro, alteradas) => {

            if (erro) {

                return res.status(500).json({

                    erro: "Erro ao confirmar presença."

                });

            }

            if (alteradas === 0) {

                return res.status(404).json({

                    erro: "Reserva não encontrada."

                });

            }

            res.json({

                mensagem: "Presença confirmada."

            });

        }

    );

};

// =========================
// FINALIZAR RESERVA
// =========================
const finalizarReserva = (req, res) => {

    recepcaoModel.finalizarReserva(

        req.params.id,

        (erro, alteradas) => {

            if (erro) {

                return res.status(500).json({

                    erro: "Erro ao finalizar reserva."

                });

            }

            if (alteradas === 0) {

                return res.status(404).json({

                    erro: "Reserva não encontrada."

                });

            }

            res.json({

                mensagem: "Reserva finalizada."

            });

        }

    );

};

module.exports = {

    agenda,

    checkin,

    buscarReserva,

    reservasCliente,

    confirmarPresenca,

    finalizarReserva

};