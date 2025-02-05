import express from 'express'
import { __dirname } from './utils.js'
import productsRouter from './routes/products.route.js'
import productsCarts from './routes/carts.route.js'

//Variables globales
const app = express()

// lectura de Json
app.use(express.json())
app.use(express.urlencoded({extended: true}))

//Rutas
app.use('/api/products', productsRouter)
app.use('/api/carts',productsCarts)

//Midlewere para los errores de servidor
app.use((error, req, res, next) => {
    console.log(error)
    res.status(500).send('Error 500 en el server')
})

//Server escuchando port 8080
app.listen(8080,error => {
    if(error){
        console.log(error)
    }
    console.log('Server escuchando en el puerto 8080')

})