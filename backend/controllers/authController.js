const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const usuarioModel = require("../models/usuarioModel");

const SECRET = process.env.JWT_SECRET;

if (!SECRET) {
    throw new Error("JWT_SECRET não configurado no arquivo .env");
}

// =====================
// CADASTRO
// =====================
const cadastrar = async (req, res) => {

    const { nome, email, senha, telefone } = req.body;

    if (!nome || !email || !senha) {
        return res.status(400).json({
            erro: "Preencha os campos obrigatórios."
        });
    }

    usuarioModel.buscarPorEmail(email, async (erro, usuario) => {

        if (erro) {
            return res.status(500).json(erro);
        }

        if (usuario) {
            return res.status(400).json({
                erro: "E-mail já cadastrado."
            });
        }

        const senhaHash = await bcrypt.hash(senha, 10);

        usuarioModel.criar({

            nome,
            email,
            senha: senhaHash,
            telefone

        }, (erro, id) => {

            if (erro) {
                return res.status(500).json(erro);
            }

            res.status(201).json({

                mensagem: "Usuário cadastrado com sucesso.",

                id

            });

        });

    });

};

// =====================
// LOGIN
// =====================
const login = (req, res) => {

    const { email, senha } = req.body;

    usuarioModel.buscarPorEmail(email, async (erro, usuario) => {

        if (erro) {
            return res.status(500).json(erro);
        }

        if (!usuario) {

            return res.status(404).json({

                erro: "Usuário não encontrado."

            });

        }

        const ok = await bcrypt.compare(senha, usuario.senha);

        if (!ok) {

            return res.status(401).json({

                erro: "Senha incorreta."

            });

        }

        const token = jwt.sign({

            id: usuario.id,

            nome: usuario.nome,

            email: usuario.email,

            tipo: usuario.tipo

        }, SECRET, {

            expiresIn: "2h"

        });

        res.json({

    mensagem: "Login realizado com sucesso.",

    token,

    usuario: {

        id: usuario.id,

        nome: usuario.nome,

        email: usuario.email,

        tipo: usuario.tipo

    }

});

    });

};

module.exports = {

    cadastrar,

    login

};