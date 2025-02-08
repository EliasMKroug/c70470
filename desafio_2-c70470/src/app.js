import express from 'express'
import { Server as ServerIO} from 'socket.io'
import { Server as ServerHttp } from 'http'
import { __dirname } from './utils.js'
import handlebars from 'express-handlebars'
import productsRouter from './routes/products.route.js'
import productsCarts from './routes/carts.route.js'
import viewsRouter from './routes/views.route.js'
import realTimeProducts, { setupSocket } from './routes/realTimeProducts.route.js';

//Variables globales
const app = express()
const PORT = process.env.PORT || 8080 
const httpServer = new ServerHttp(app)
const socketServer = new ServerIO(httpServer)

// lectura de Json
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(__dirname+'/public'))

//Motor de plantillas
app.engine('handlebars', handlebars.engine())
app.set('views', __dirname+'/views' )
app.set('view engine', 'handlebars')

// Configurar Socket.IO
setupSocket(socketServer);

//Rutas
app.use('/api/products', productsRouter)
app.use('/api/carts',productsCarts)
app.use('/', viewsRouter)
app.use('/realtimeproducts', realTimeProducts)

//Midlewere para los errores de servidor
app.use((error, req, res, next) => {
    console.log(error)
    res.status(500).send('Error 500 en el server')
})

//Server escuchando port 8080
httpServer.listen(PORT,error => {
    if(error){
        console.log(error)
    }
    console.log(`Server escuchando en el puerto ${PORT}`)

})