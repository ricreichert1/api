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

app.get('/rick/list', async (req, res) => {
    try {
        const result = await pool.query('SELECT nome, idade, altura, peso, cpf, dataRegistro FROM suneca')
        res.json(result.rows)
    } catch (error) {
        console.error('Erro ao listar registros:', error)
        res.status(500).json({ message: 'Erro ao listar registros.' })
    }
})


app.post('/rick/add', async (req, res) => {
    console.log('Dados recebidos:', req.body)
    const { nomeInput, idadeInput, alturaInput, pesoInput, cpfInput, dataRegistroInput } = req.body

    try {
        const alturaTratada = parseFloat((alturaInput || '').replace(',', '.'))

        const result = await pool.query(
            'INSERT INTO suneca (nome, idade, altura, peso, cpf, dataRegistro ) VALUES ($1, $2, $3, $4, $5, $6)',
            [nomeInput, idadeInput, alturaTratada, pesoInput, cpfInput, dataRegistroInput]
        )
        res.status(201).json({ message: 'Mocorongo adicionado com sucesso!' })
    } catch (error) {
        console.error('Erro ao adicionar mocorongo:', error)
        res.status(500).json({ message: 'Erro ao adicionar Mocorongo.' })
    }
})

const PORT = 3000
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`)
})
