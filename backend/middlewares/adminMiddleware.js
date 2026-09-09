function verificarAdmin(req, res, next) {

    if (!req.usuario) {
        return res.status(401).json({
            erro: "Usuário não autenticado."
        });
    }

    const permitidos = ["admin", "gerente"];

    if (!permitidos.includes(req.usuario.tipo)) {
        return res.status(403).json({
            erro: "Acesso permitido apenas para administradores."
        });
    }

    next();
}

module.exports = verificarAdmin;