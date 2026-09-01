const express = require("express");

const router = express.Router();

const verificarToken = require("../middlewares/authMiddleware");
const verificarAdmin = require("../middlewares/adminMiddleware");

const adminController = require("../controllers/adminController");

// Estatísticas
router.get(

    "/admin/estatisticas",

    verificarToken,

    verificarAdmin,

    adminController.estatisticas

);

// Reservas
router.get(

    "/admin/reservas",

    verificarToken,

    verificarAdmin,

    adminController.listarReservas

);

router.get(

    "/admin/agenda",

    verificarToken,

    verificarAdmin,

    adminController.agendaDoDia

);

router.put(

    "/admin/pagamento/:id",

    verificarToken,

    verificarAdmin,

    adminController.confirmarPagamento

);

router.put(

    "/admin/reserva/:id/cancelar",

    verificarToken,

    verificarAdmin,

    adminController.cancelarReserva

);

router.put(

    "/admin/checkin/:id",

    verificarToken,

    verificarAdmin,

    adminController.confirmarCheckin

);

module.exports = router;