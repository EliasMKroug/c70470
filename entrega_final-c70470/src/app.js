import express from 'express'
import { Server as ServerIO} from 'socket.io'
import { Server as ServerHttp } from 'http'
import handlebars from 'express-handlebars'
import { __dirname } from './utils.js'

//  Rutas de Socket.IO  
import realTimeProducts, { setupSocket } from './routes/realTimeProducts.route.js';

//Rutas
import { connectToMongo } from './connections/db.conections.js'
import productsRouter from './routes/products.route.js'
import productsCarts from './routes/carts.route.js'
import viewsRouter from './routes/views.route.js'
import producsApiRoutes from './routes/api/products.routes.api.js'
import cartApiRoutes from './routes/api/carts.api.routes.js'


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

// Conexion a Socket.IO
setupSocket(socketServer);

//Conexion a MongoDB
connectToMongo()

//Rutas FS
app.use('/products', productsRouter)
app.use('/carts',productsCarts)
app.use('/', viewsRouter)

//Rutas de Socket.IO
app.use('/realtimeproducts', realTimeProducts)

//Rutas de la API
app.use('/api/products', producsApiRoutes)
app.use('/api/carts', cartApiRoutes)

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