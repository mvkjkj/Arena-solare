const express = require("express");

const router = express.Router();

const verificarToken = require("../middlewares/authMiddleware");

const usuarioController = require("../controllers/usuarioController");

// ========================================
// MINHAS RESERVAS
// ========================================

router.get(
    "/usuario/minhas-reservas",
    verificarToken,
    usuarioController.minhasReservas
);

// ========================================
// CANCELAR MINHA RESERVA
// ========================================

router.put(
    "/usuario/minhas-reservas/:id/cancelar",
    verificarToken,
    usuarioController.cancelarMinhaReserva
);

// ========================================
// BUSCAR PERFIL
// ========================================

router.get(
    "/usuario",
    verificarToken,
    usuarioController.buscarPerfil
);

// ========================================
// ATUALIZAR PERFIL
// ========================================

router.put(
    "/usuario",
    verificarToken,
    usuarioController.atualizarPerfil
);

// ========================================
// ALTERAR SENHA
// ========================================

router.put(
    "/usuario/senha",
    verificarToken,
    usuarioController.alterarSenha
);

// ========================================
// EXPORTAR
// ========================================

module.exports = router;