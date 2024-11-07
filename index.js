const express = require('express')
const cors = require('cors')
const { Pool } = require('pg')

const app = express()
app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
}))


app.use(express.json())

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'teste1',
    password: '2772',
    port: 5432,
})
app.post('/rick/add', async (req, res) => {
    console.log('Dados recebidos:', req.body)
    const { nomeInput, idadeInput, alturaInput, pesoInput } = req.body
    try {
        const result = await pool.query(
            'INSERT INTO suneca (nome, idade, altura, peso) VALUES ($1, $2, $3, $4)',
            [nomeInput, idadeInput, alturaInput, pesoInput ]
        );
        res.status(201).json({ message: 'Mocorongo adicionado com sucesso!' })
    } catch (error) {
        console.error('Erro ao adicionar mocorongo:', error)
        res.status(500).json({ message: 'Erro ao adicionar mocorongo.' })
    }
});

const PORT = 3000
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`)
})
