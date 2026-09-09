const jwt = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET;

if (!SECRET) {
    throw new Error("JWT_SECRET não configurado no arquivo .env");
}

function verificarToken(req, res, next) {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            erro: "Token não informado."
        });
    }

    const partes = authHeader.split(" ");

    if (partes.length !== 2 || partes[0] !== "Bearer" || !partes[1]) {
        return res.status(401).json({
            erro: "Formato do token inválido."
        });
    }

    const token = partes[1];

    try {

        const usuario = jwt.verify(token, SECRET);

        req.usuario = usuario;

        next();

    } catch (erro) {

        return res.status(401).json({
            erro: "Token inválido ou expirado."
        });

    }
}

module.exports = verificarToken;