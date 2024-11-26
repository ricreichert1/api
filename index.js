const express = require('express')
const cors = require('cors')
const { Pool } = require('pg')

const app = express()

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type'],
}))

app.use(express.json())

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'teste',
    password: '2772',
    port: 5432,
})

app.get('/rick/search/:query', async (req, res) => {
    const { query } = req.params

    try {
        const result = await pool.query(
            `SELECT nome, idade, altura, peso, cpf, dataregistro 
             FROM suneca 
             WHERE nome ILIKE $1`,
            [`${query}%`]
        );
        res.json(result.rows)
    } catch (error) {
        console.error('Erro ao buscar registros:', error);
        res.status(500).json({ message: 'Erro ao buscar registros.' })
    }
})

app.get('/rick/list', async (req, res) => {
    try {
        const result = await pool.query('SELECT nome, idade, altura, peso, cpf, dataregistro FROM suneca')
        res.json(result.rows)
    } catch (error) {
        console.error('Erro ao listar registros:', error)
        res.status(500).json({ message: 'Erro ao listar registros.' })
    }
})

app.get('/rick/check-cpf/:cpf', async (req, res) => {
    const { cpf } = req.params;
    try {
        const resultado = await pool.query('SELECT cpf FROM suneca WHERE cpf = $1', [cpf])
        
        if (resultado.rows.length > 0) {
            res.status(200).json({ exists: true })
        } else {
            res.status(200).json({ exists: false })
        }
    } catch (error) {
        console.error('Erro ao verificar CPF:', error)
        res.status(500).json({ message: 'Erro ao verificar CPF.' })
    }
})

app.post('/rick/add', async (req, res) => {
    console.log('Dados recebidos:', req.body)
    const { nomeInput, idadeInput, alturaInput, pesoInput, cpfInput } = req.body

    try {
        const alturaTratada = parseFloat((alturaInput || '').replace(',', '.'))

        await pool.query(
            'INSERT INTO suneca (nome, idade, altura, peso, cpf, dataregistro) VALUES ($1, $2, $3, $4, $5, NOW())',
            [nomeInput, idadeInput, alturaTratada, pesoInput, cpfInput]
        )
        res.status(201).json({ message: 'Mocorongo adicionado com sucesso!' });
    } catch (error) {
        console.error('Erro ao adicionar mocorongo:', error);
        res.status(500).json({ message: 'Erro ao adicionar Mocorongo.' });
    }
})

app.delete('/rick/delete/:cpf', async (req, res) => {
    const { cpf } = req.params

    try {
        const result = await pool.query('DELETE FROM suneca WHERE cpf = $1 RETURNING *', [cpf])

        if (result.rowCount > 0) {
            res.status(200).json({ message: 'Mocorongo deletado com sucesso!' })
        } else {
            res.status(404).json({ message: 'Mocorongo não encontrado.' })
        }
    } catch (error) {
        console.error('Erro ao deletar registro:', error)
        res.status(500).json({ message: 'Erro ao deletar mocorongo.' })
    }
})

const PORT = 3000
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`)
})
