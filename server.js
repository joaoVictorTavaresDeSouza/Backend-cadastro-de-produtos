import express from 'express'
import cors from 'cors'
import mysql from 'mysql2/promise'

const app = express()
const PORT = process.env.PORT || 3000

// Pool de conexões MySQL
const pool = mysql.createPool({
    host: 'benserverplex.ddns.net',
    user: 'root',
    password: '',
    database: 'web_03mb',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
})

app.use(express.json())
app.use(cors())

app.post('/products', async (req, res) => {
    try {
        const { name, email, price, description, category } = req.body

        if (!name || !email || !price || !description || !category) {
            return res.status(400).json({
                error: 'Todos os campos são obrigatórios'
            })
        }

        const connection = await pool.getConnection()
        
        const query = 'INSERT INTO 03mb_victor_tavares (name, email, price, category, description) VALUES (?, ?, ?, ?, ?)'
        const [result] = await connection.execute(query, [
            name,
            email,
            parseFloat(price),
            category,
            description
        ])

        connection.release()

        res.status(201).json({
            message: 'Produto salvo com sucesso',
            product: {
                id: result.insertId,
                name,
                email,
                price: parseFloat(price),
                description,
                category
            }
        })
    } catch (err) {
        console.error('Erro ao salvar produto:', err)
        res.status(500).json({ error: 'Erro ao salvar produto' })
    }
})

app.get('/products', async (req, res) => {
    try {
        const connection = await pool.getConnection()
        
        const [products] = await connection.query('SELECT id, name, email, price, category, description FROM 03mb_victor_tavares')
        
        connection.release()

        res.status(200).json(products)
    } catch (err) {
        console.error('Erro ao buscar produtos:', err)
        res.status(500).json({ error: 'Erro ao buscar produtos' })
    }
})

app.listen(PORT, () => {
    console.log(`✅ Servidor rodando em http://localhost:${PORT}`)
    console.log(`📦 POST /products - Cadastrar novo produto`)
    console.log(`📋 GET /products - Listar todos os produtos`)
})