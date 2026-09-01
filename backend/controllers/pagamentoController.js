const QRCode = require("qrcode");

const pagamentoModel = require("../models/pagamentoModel");

// ========================================
// GERAR PIX
// ========================================
const gerarPix = (req, res) => {

    pagamentoModel.buscarReserva(

        req.params.id,

        async (erro, reserva) => {

            if (erro) {

                return res.status(500).json(erro);

            }

            if (!reserva) {

                return res.status(404).json({

                    erro: "Reserva não encontrada."

                });

            }

            try {

                // PIX fictício (depois ligaremos ao Mercado Pago)

                const codigoPix =

                    `BEACHCENTER2026|${

                        reserva.id

                    }|${

                        Number(reserva.valor).toFixed(2)

                    }`;

                const qrCode = await QRCode.toDataURL(

                    codigoPix

                );

                res.json({

                    cliente: reserva.nome,

                    modalidade: reserva.modalidade,

                    horario: reserva.horario,

                    data: reserva.data,

                    valor: reserva.valor,

                    copiaecola: codigoPix,

                    qrcode: qrCode

                });

            }

            catch (erro) {

                console.log(erro);

                res.status(500).json({

                    erro:"Erro ao gerar QRCode."

                });

            }

        }

    );

};

// ========================================
// CONFIRMAR
// ========================================
const confirmarPagamento = (req,res)=>{

    pagamentoModel.confirmar(

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

                mensagem:"Pagamento confirmado."

            });

        }

    );

};

// ========================================
// CANCELAR
// ========================================
const cancelarPagamento=(req,res)=>{

    pagamentoModel.cancelar(

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

                mensagem:"Pagamento cancelado."

            });

        }

    );

};

// ========================================
// LISTAR
// ========================================
const listar=(req,res)=>{

    pagamentoModel.listar(

        (erro,pagamentos)=>{

            if(erro){

                return res.status(500).json(erro);

            }

            res.json(pagamentos);

        }

    );

};

module.exports={

    gerarPix,

    confirmarPagamento,

    cancelarPagamento,

    listar

};