const express = require("express");

const router = express.Router();

const verificarToken = require("../middlewares/authMiddleware");
const verificarRecepcao = require("../middlewares/recepcaoMiddleware");

const recepcaoController = require("../controllers/recepcaoController");

// =========================
// AGENDA DO DIA
// =========================
router.get(

    "/recepcao/agenda",

    verificarToken,

    verificarRecepcao,

    recepcaoController.agenda

);

// =========================
// BUSCAR RESERVA
// =========================
router.get(

    "/recepcao/reserva/:id",

    verificarToken,

    verificarRecepcao,

    recepcaoController.buscarReserva

);

// =========================
// CHECK-IN
// =========================
router.put(

    "/recepcao/checkin/:id",

    verificarToken,

    verificarRecepcao,

    recepcaoController.checkin

);

// =========================
// CONFIRMAR PRESENÇA
// =========================
router.put(

    "/recepcao/presenca/:id",

    verificarToken,

    verificarRecepcao,

    recepcaoController.confirmarPresenca

);

// =========================
// FINALIZAR RESERVA
// =========================
router.put(

    "/recepcao/finalizar/:id",

    verificarToken,

    verificarRecepcao,

    recepcaoController.finalizarReserva

);

// =========================
// RESERVAS DE UM CLIENTE
// =========================
router.get(

    "/recepcao/cliente/:usuario",

    verificarToken,

    verificarRecepcao,

    recepcaoController.reservasCliente

);

module.exports = router;