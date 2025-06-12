const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Caminho para o arquivo do banco de dados (será criado na raiz do projeto)
const DB_PATH = path.join(__dirname, '..', 'database.sqlite');

const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
        console.error('Erro ao abrir o banco de dados:', err.message);
    } else {
        console.log('Conectado ao banco de dados SQLite.');
        // Cria a tabela de orçamentos se ela não existir
        db.run(`CREATE TABLE IF NOT EXISTS quotes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            client_name TEXT NOT NULL,
            client_phone TEXT,
            client_email TEXT,
            quote_date DATE NOT NULL,
            total_area REAL,
            bathroom_count INTEGER,
            room_count INTEGER,
            renovation_items_json TEXT, -- Armazena os detalhes dos itens como JSON
            total_quote REAL NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`, (err) => {
            if (err) {
                console.error('Erro ao criar tabela:', err.message);
            } else {
                console.log('Tabela "quotes" verificada/criada.');
            }
        });
    }
});

module.exports = db;