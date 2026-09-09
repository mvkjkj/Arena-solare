function verificarRecepcao(req, res, next) {

    if (!req.usuario) {
        return res.status(401).json({
            erro: "Usuário não autenticado."
        });
    }

    if (
        req.usuario.tipo === "admin" ||
        req.usuario.tipo === "gerente" ||
        req.usuario.tipo === "recepcao"
    ) {
        return next();
    }

    return res.status(403).json({
        erro: "Acesso negado."
    });

}

module.exports = verificarRecepcao;

function verificarRecepcao(req, res, next) {

    if (!req.usuario) {
        return res.status(401).json({
            erro: "Usuário não autenticado."
        });
    }

    if (
        req.usuario.tipo !== "recepcao" &&
        req.usuario.tipo !== "admin"
    ) {
        return res.status(403).json({
            erro: "Acesso permitido apenas para recepção ou administração."
        });
    }

    next();
}

module.exports = verificarRecepcao;