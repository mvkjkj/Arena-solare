const rateLimit = require("express-rate-limit");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");
require("dotenv").config();

const limiteLogin = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        erro: "Muitas tentativas de login. Aguarde 15 minutos e tente novamente."
    }
});

const limiteCadastro = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        erro: "Muitos cadastros realizados. Aguarde 15 minutos e tente novamente."
    }
});

// =========================
// BANCO DE DADOS
// =========================

require("./database/database");

// =========================
// ROTAS
// =========================

const authRoutes = require("./routes/authRoutes");
const reservaRoutes = require("./routes/reservaRoutes");
const pagamentoRoutes = require("./routes/pagamentoRoutes");
const usuarioRoutes = require("./routes/usuarioRoutes");
const adminRoutes = require("./routes/adminRoutes");
const recepcaoRoutes = require("./routes/recepcaoRoutes");

// =========================
// APP
// =========================

const app = express();

const PORT = process.env.PORT || 3000;

// =========================
// SEGURANÇA
// =========================

app.use(
    helmet({
        contentSecurityPolicy: false
    })
);

// =========================
// CORS
// =========================

const origemPermitida = process.env.FRONTEND_URL;

if (origemPermitida) {

    app.use(
        cors({
            origin: origemPermitida
        })
    );

} else {

    // Durante o desenvolvimento local
    app.use(cors());

}

// =========================
// JSON
// =========================

app.use(
    express.json({
        limit: "1mb"
    })
);

// =========================
// ARQUIVOS PÚBLICOS
// =========================

app.use(
    express.static(
        path.join(__dirname, "public")
    )
);

// =========================
// PÁGINA INICIAL
// =========================

app.get("/", (req, res) => {

    res.redirect("/pages/index.html");

});

// =========================
// PÁGINAS
// =========================

// Dashboard

app.get("/dashboard", (req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            "public",
            "pages",
            "dashboard.html"
        )
    );

});

// Nova Reserva

app.get("/reserva", (req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            "public",
            "pages",
            "reserva.html"
        )
    );

});

// Minhas Reservas

app.get("/minhas-reservas", (req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            "public",
            "pages",
            "minhas-reservas.html"
        )
    );

});

// Pagamento

app.get("/pagamento", (req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            "public",
            "pages",
            "pagamento.html"
        )
    );

});

// Perfil

app.get("/perfil", (req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            "public",
            "pages",
            "perfil.html"
        )
    );

});

// Administração

app.get("/admin", (req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            "public",
            "pages",
            "admin.html"
        )
    );

});

// =========================
// API
// =========================

app.use("/api/login", limiteLogin);
app.use("/api/cadastro", limiteCadastro);
app.use("/api", authRoutes);

app.use("/api", reservaRoutes);

app.use("/api", pagamentoRoutes);

app.use("/api", usuarioRoutes);

app.use("/api", adminRoutes);

app.use("/api", recepcaoRoutes);

// =========================
// TRATAMENTO DE ERROS
// =========================

app.use((err, req, res, next) => {

    console.error("Erro:", err);

    res.status(500).json({

        erro: "Erro interno do servidor."

    });

});

// =========================
// SERVIDOR
// =========================

app.listen(PORT, "0.0.0.0", () => {

    console.log("=================================");
    console.log("🏖️ BeachCenter2026");
    console.log(
        `🚀 Servidor iniciado na porta ${PORT}`
    );
    console.log("=================================");

});