const express = require('express');
const router = express.Router();
const db = require('./database');

// Rota para SALVAR um novo orçamento (POST /api/quotes)
router.post('/', (req, res) => {
    const { clientInfo, apartmentMeasures, renovationItems, totalQuote } = req.body;

    if (!clientInfo || !clientInfo.name || !clientInfo.date || !totalQuote) {
        return res.status(400).json({ message: 'Dados do orçamento incompletos.' });
    }

    const { name, phone, email, date } = clientInfo;
    const { totalArea, bathroomCount, roomCount } = apartmentMeasures;

    // Armazena renovationItems como uma string JSON no banco de dados
    const renovationItemsJson = JSON.stringify(renovationItems);

    const sql = `INSERT INTO quotes (
        client_name, client_phone, client_email, quote_date,
        total_area, bathroom_count, room_count,
        renovation_items_json, total_quote
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const params = [
        name, phone, email, date,
        totalArea, bathroomCount, roomCount,
        renovationItemsJson, totalQuote
    ];

    db.run(sql, params, function(err) {
        if (err) {
            console.error('Erro ao inserir orçamento:', err.message);
            return res.status(500).json({ message: 'Erro interno do servidor ao salvar o orçamento.' });
        }
        res.status(201).json({ message: 'Orçamento salvo com sucesso!', id: this.lastID });
    });
});

// Rota para CARREGAR um orçamento por ID (GET /api/quotes/:id)
router.get('/:id', (req, res) => {
    const { id } = req.params;
    const sql = `SELECT * FROM quotes WHERE id = ?`;

    db.get(sql, [id], (err, row) => {
        if (err) {
            console.error('Erro ao buscar orçamento:', err.message);
            return res.status(500).json({ message: 'Erro interno do servidor ao carregar o orçamento.' });
        }
        if (!row) {
            return res.status(404).json({ message: 'Orçamento não encontrado.' });
        }
        res.status(200).json(row);
    });
});

// (Opcional) Rota para listar todos os orçamentos (GET /api/quotes)
router.get('/', (req, res) => {
    const sql = `SELECT id, client_name, quote_date, total_quote FROM quotes ORDER BY created_at DESC`;
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error('Erro ao listar orçamentos:', err.message);
            return res.status(500).json({ message: 'Erro interno do servidor ao listar orçamentos.' });
        }
        res.status(200).json(rows);
    });
});

module.exports = router;