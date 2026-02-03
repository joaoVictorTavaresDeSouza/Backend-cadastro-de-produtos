import express from 'express'
import cors from 'cors'

const app = express()
const PORT = process.env.PORT || 3000

const products = []

app.use(express.json())
app.use(cors())

app.post('/products', (req, res) => {
    try {
        const { name, email, price, description, category } = req.body

        if (!name || !email || !price || !description || !category) {
            return res.status(400).json({
                error: 'Todos os campos são obrigatórios'
            })
        }

        const product = {
            id: products.length + 1,
            name,
            email,
            price: parseFloat(price),
            description,
            category
        }

        products.push(product)

        res.status(201).json({
            message: 'Produto salvo com sucesso',
            product
        })
    } catch (err) {
        console.error('Erro ao salvar produto:', err)
        res.status(500).json({ error: 'Erro ao salvar produto' })
    }
})

app.get('/products', (req, res) => {
    try {
        const productsWithoutId = products.map(({ id, ...rest }) => rest)
        res.status(200).json(productsWithoutId)
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