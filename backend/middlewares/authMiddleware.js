const jwt = require("jsonwebtoken");

const SECRET = "beachcenter2026_secret";

function verificarToken(req, res, next) {

    const authHeader = req.headers.authorization;

    console.log("\n========== NOVA REQUISIÇÃO ==========");
    console.log("URL:", req.originalUrl);
    console.log("Authorization:", authHeader);

    if (!authHeader) {
        return res.status(401).json({
            erro: "Token não informado."
        });
    }

    const token = authHeader.split(" ")[1];

    try {

        const usuario = jwt.verify(token, SECRET);

        console.log("JWT OK:", usuario);

        req.usuario = usuario;

        next();

    } catch (erro) {

        console.log("ERRO JWT:", erro.name);
        console.log("MENSAGEM:", erro.message);

        return res.status(401).json({
            erro: "Token inválido."
        });

    }

}

module.exports = verificarToken;