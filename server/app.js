const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config({ path: '../.env' }); // Carrega variáveis de ambiente

const db = require('./database'); // Importa a conexão com o banco de dados
const quoteRoutes = require('./routes'); // Importa as rotas da API

const app = express();
const PORT = process.env.PORT || 3000; // Porta do servidor

// Middleware
app.use(cors()); // Habilita CORS para permitir requisições do frontend
app.use(bodyParser.json()); // Converte o corpo das requisições para JSON

// Servir arquivos estáticos do frontend
app.use(express.static('public'));

// Rotas da API
app.use('/api/quotes', quoteRoutes); // Prefixo para todas as rotas de orçamento

// Tratamento de erro genérico
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Algo deu errado no servidor!');
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor Node.js rodando na porta ${PORT}`);
    console.log(`Acesse o frontend em http://localhost:${PORT}`);
});