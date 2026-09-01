const express = require("express");

const router = express.Router();

const reservaController = require("../controllers/reservaController");
const verificarToken = require("../middlewares/authMiddleware");

// =========================
// MODALIDADES
// =========================
router.get(
    "/modalidades",
    reservaController.modalidades
);

// =========================
// HORÁRIOS
// =========================
router.get(
    "/horarios",
    reservaController.horarios
);

router.get(
    "/horarios-disponiveis",
    verificarToken,
    reservaController.horariosDisponiveis
);

// =========================
// RESERVAS
// =========================
router.post(
    "/reservar",
    verificarToken,
    reservaController.reservar
);

router.get(
    "/minhas-reservas",
    verificarToken,
    reservaController.minhasReservas
);

router.put(
    "/reservar/:id/cancelar",
    verificarToken,
    reservaController.cancelarReserva
);

router.get(
    "/pagamento/:id",
    verificarToken,
    reservaController.buscarPagamento
);

router.put(

    "/pagamento/:id",

    verificarToken,

    reservaController.confirmarPagamento

);

module.exports = router;