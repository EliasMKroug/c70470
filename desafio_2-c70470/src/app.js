import express from 'express'
import { __dirname } from './utils.js'
import productsRouter from './routes/products.route.js'
import productsApiRouter from './routes/api/products.router.js'
import productsCarts from './routes/carts.route.js'
import handlebars from 'express-handlebars'
import viewsRouter from './routes/views.route.js'
import usersRouter from './routes/api/users.route.js'
import cartsApiRouter from './routes/api/carts.route.js'
//socket.io
import { Server as ServerIO } from 'socket.io'
import { Server as ServerHttp } from 'http'
import { productsSocket } from './utils/productsSocket.js'
import { connectDb } from './config/index.js'

//Variables globales
const app = express()
const PORT = process.env.PORT || 8080
const httpServer = new ServerHttp(app)
const io = new ServerIO(httpServer)

// lectura de Json
app.use(express.json())
app.use(express.urlencoded({extended: true}))
//app.use(express.static(path.join(__dirname+'/public')))
app.use(express.static(__dirname+'/public'))

connectDb()

//Defino motor de plantillas para express
app.engine('handlebars', handlebars.engine())

//Direccion de plantillas
app.set('views',__dirname+'/views')
app.set('view engine', 'handlebars')

//Rutas FS
app.use('/products', productsRouter)
app.use('/carts',productsCarts)
app.use('/', viewsRouter)

//Rutas Api
app.use('/api/products', productsApiRouter)
app.use('/api/users', usersRouter)
app.use('/api/carts', cartsApiRouter)


//middleware
app.use(productsSocket(io))

//Midlewere para los errores de servidor
app.use((error, req, res, next) => {
    console.log(error)
    res.status(500).send('Error 500 en el server')
})

// Guardar en una cont
httpServer.listen(PORT, error => {
    if(error) console.log(error)
    console.log('Server escuchando en el puerto 8080')
})