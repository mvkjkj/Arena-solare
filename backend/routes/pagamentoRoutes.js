const express = require("express");

const router = express.Router();

const verificarToken = require("../middlewares/authMiddleware");
const verificarRecepcao = require("../middlewares/recepcaoMiddleware");

const pagamentoController = require("../controllers/pagamentoController");

// ========================================
// GERAR PIX
// ========================================
router.get(

    "/pagamento/pix/:id",

    verificarToken,

    pagamentoController.gerarPix

);

// ========================================
// CONFIRMAR PAGAMENTO
// ========================================
router.put(

    "/pagamento/confirmar/:id",

    verificarToken,

    verificarRecepcao,

    pagamentoController.confirmarPagamento

);

// ========================================
// CANCELAR PAGAMENTO
// ========================================
router.put(

    "/pagamento/cancelar/:id",

    verificarToken,

    verificarRecepcao,

    pagamentoController.cancelarPagamento

);

// ========================================
// LISTAR PAGAMENTOS
// ========================================
router.get(

    "/pagamentos",

    verificarToken,

    verificarRecepcao,

    pagamentoController.listar

);

module.exports = router;