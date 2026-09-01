const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const usuarioModel = require("../models/usuarioModel");

const SECRET = "beachcenter2026_secret";

// ==============================
// CADASTRO
// ==============================

const cadastrar = async (req, res) => {

    const { nome, email, senha, telefone } = req.body;

    if (!nome || !email || !senha) {

        return res.status(400).json({

            erro: "Preencha os campos obrigatórios."

        });

    }

    usuarioModel.buscarPorEmail(

        email,

        async (erro, usuario) => {

            if (erro) {

                return res.status(500).json(erro);

            }

            if (usuario) {

                return res.status(400).json({

                    erro: "E-mail já cadastrado."

                });

            }

            const senhaHash = await bcrypt.hash(senha, 10);

            usuarioModel.criar(

                {
                    nome,
                    email,
                    senha: senhaHash,
                    telefone
                },

                (erro, id) => {

                    if (erro) {

                        return res.status(500).json(erro);

                    }

                    res.status(201).json({

                        mensagem: "Usuário cadastrado com sucesso.",

                        id

                    });

                }

            );

        }

    );

};

// ==============================
// LOGIN
// ==============================

const login = (req, res) => {

    const { email, senha } = req.body;

    usuarioModel.buscarPorEmail(

        email,

        async (erro, usuario) => {

            if (erro) {

                return res.status(500).json(erro);

            }

            if (!usuario) {

                return res.status(404).json({

                    erro: "Usuário não encontrado."

                });

            }

            const ok = await bcrypt.compare(

                senha,

                usuario.senha

            );

            if (!ok) {

                return res.status(401).json({

                    erro: "Senha incorreta."

                });

            }

            const token = jwt.sign(

                {

                    id: usuario.id,

                    nome: usuario.nome,

                    email: usuario.email,

                    tipo: usuario.tipo

                },

                SECRET,

                {

                    expiresIn: "2h"

                }

            );

            res.json({

                mensagem: "Login realizado com sucesso.",

                token,

                usuario: {

                    id: usuario.id,

                    nome: usuario.nome,

                    email: usuario.email,

                    telefone: usuario.telefone,

                    tipo: usuario.tipo

                }

            });

        }

    );

};

// ==============================
// MINHAS RESERVAS
// ==============================

const minhasReservas = (req, res) => {

    const usuarioId = req.usuario.id;

    usuarioModel.minhasReservas(

        usuarioId,

        (erro, reservas) => {

            if (erro) {

                return res.status(500).json(erro);

            }

            res.json(reservas);

        }

    );

};

// ==============================
// CANCELAR MINHA RESERVA
// ==============================

const cancelarMinhaReserva = (req, res) => {

    const usuarioId = req.usuario.id;

    usuarioModel.cancelarMinhaReserva(

        req.params.id,

        usuarioId,

        (erro, alteradas) => {

            if (erro) {

                return res.status(500).json(erro);

            }

            if (alteradas === 0) {

                return res.status(404).json({

                    erro: "Reserva não encontrada."

                });

            }

            res.json({

                mensagem: "Reserva cancelada com sucesso."

            });

        }

    );

};

// ==============================
// BUSCAR PERFIL
// ==============================

const buscarPerfil = (req, res) => {

    usuarioModel.buscarPerfil(

        req.usuario.id,

        (erro, usuario) => {

            if (erro) {

                return res.status(500).json(erro);

            }

            if (!usuario) {

                return res.status(404).json({

                    erro: "Usuário não encontrado."

                });

            }

            res.json(usuario);

        }

    );

};

// ==============================
// ATUALIZAR PERFIL
// ==============================

const atualizarPerfil = (req, res) => {

    const { nome, telefone } = req.body;

    if (!nome) {

        return res.status(400).json({

            erro: "O nome é obrigatório."

        });

    }

    usuarioModel.atualizarPerfil(

        req.usuario.id,

        nome,

        telefone,

        (erro, alteradas) => {

            if (erro) {

                return res.status(500).json(erro);

            }

            if (alteradas === 0) {

                return res.status(404).json({

                    erro: "Usuário não encontrado."

                });

            }

            res.json({

                mensagem: "Perfil atualizado com sucesso."

            });

        }

    );

};

// ==============================
// ALTERAR SENHA
// ==============================

const alterarSenha = async (req, res) => {

    try {

        const { senha } = req.body;

        if (!senha || senha.length < 6) {

            return res.status(400).json({

                erro: "A senha deve possuir pelo menos 6 caracteres."

            });

        }

        const senhaHash = await bcrypt.hash(

            senha,

            10

        );

        usuarioModel.alterarSenha(

            req.usuario.id,

            senhaHash,

            (erro, alteradas) => {

                if (erro) {

                    return res.status(500).json(erro);

                }

                if (alteradas === 0) {

                    return res.status(404).json({

                        erro: "Usuário não encontrado."

                    });

                }

                res.json({

                    mensagem: "Senha alterada com sucesso."

                });

            }

        );

    } catch (erro) {

        console.error(erro);

        res.status(500).json({

            erro: "Erro ao alterar senha."

        });

    }

};

// ==============================
// EXPORTAR
// ==============================

module.exports = {

    cadastrar,

    login,

    minhasReservas,

    cancelarMinhaReserva,

    buscarPerfil,

    atualizarPerfil,

    alterarSenha

};