const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const caminhoBanco = path.join(__dirname, "beachcenter.db");

console.log("📂 Banco utilizado:", caminhoBanco);

const db = new sqlite3.Database(
    caminhoBanco,
    (err) => {
        if (err) {
            console.error("Erro ao conectar ao banco:", err.message);
        } else {
            console.log("✅ Banco BeachCenter2026 iniciado.");
        }
    }
);

db.serialize(() => {

    db.run("PRAGMA foreign_keys = ON");

    // =========================
    // USUÁRIOS
    // =========================
    db.run(`
        CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            senha TEXT NOT NULL,
            telefone TEXT,
            tipo TEXT DEFAULT 'cliente',
            criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // =========================
    // MODALIDADES
    // =========================
    db.run(`
        CREATE TABLE IF NOT EXISTS modalidades (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT UNIQUE,
            preco REAL,
            ativa INTEGER DEFAULT 1
        )
    `);

    // =========================
    // HORÁRIOS
    // =========================
    db.run(`
        CREATE TABLE IF NOT EXISTS horarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            horario TEXT UNIQUE,
            ativo INTEGER DEFAULT 1
        )
    `);

    // =========================
    // RESERVAS
    // =========================
    db.run(`
        CREATE TABLE IF NOT EXISTS reservas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            usuario_id INTEGER NOT NULL,
            modalidade_id INTEGER NOT NULL,
            data TEXT NOT NULL,
            horario_id INTEGER NOT NULL,
            duracao REAL DEFAULT 1,
            valor REAL DEFAULT 70,
            status TEXT DEFAULT 'PENDENTE',
            pagamento TEXT DEFAULT 'PENDENTE',
            criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,

            FOREIGN KEY(usuario_id) REFERENCES usuarios(id),
            FOREIGN KEY(modalidade_id) REFERENCES modalidades(id),
            FOREIGN KEY(horario_id) REFERENCES horarios(id)
        )
    `);

    // =========================
    // CONFIGURAÇÕES
    // =========================
    db.run(`
        CREATE TABLE IF NOT EXISTS configuracoes (
            id INTEGER PRIMARY KEY,
            abertura TEXT,
            fechamento TEXT,
            pix TEXT,
            email TEXT
        )
    `);

    // =========================
    // MODALIDADES PADRÃO
    // =========================
    db.run(`
        INSERT OR IGNORE INTO modalidades (id, nome, preco)
        VALUES
        (1, 'Vôlei', 70),
        (2, 'Futevôlei', 70),
        (3, 'Beach Tennis', 70)
    `);

    // =========================
    // HORÁRIOS PADRÃO
    // =========================
    const horarios = [
        "08:00","08:30",
        "09:00","09:30",
        "10:00","10:30",
        "11:00","11:30",
        "12:00","12:30",
        "13:00","13:30",
        "14:00","14:30",
        "15:00","15:30",
        "16:00","16:30",
        "17:00","17:30",
        "18:00","18:30",
        "19:00","19:30",
        "20:00","20:30",
        "21:00","21:30",
        "22:00","22:30",
        "23:00","23:30",
        "00:00"
    ];

    horarios.forEach((h, index) => {

        db.run(
            "INSERT OR IGNORE INTO horarios (id, horario) VALUES (?, ?)",
            [index + 1, h]
        );

    });

    // =========================
    // CONFIGURAÇÃO PADRÃO
    // =========================
    db.run(`
        INSERT OR IGNORE INTO configuracoes
        (
            id,
            abertura,
            fechamento,
            pix,
            email
        )
        VALUES
        (
            1,
            '08:00',
            '00:00',
            'pix@beachcenter.com',
            'contato@beachcenter.com'
        )
    `);

});

module.exports = db;