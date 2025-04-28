import express from 'express';
import path from 'path';
import { Server as ServerIO } from 'socket.io';
import { Server as ServerHttp } from 'http';
import { __dirname } from './utils.js';
import { engine } from 'express-handlebars';


//  Rutas de Socket.IO  
import realTimeProducts, { setupSocket } from './routes/realTimeProducts.route.js';

// Rutas
import { connectToMongo } from './connections/db.conections.js';
import productsRouter from './routes/products.route.js';
import productsCarts from './routes/carts.route.js';
import producsApiRoutes from './routes/api/products.routes.api.js';
import cartApiRoutes from './routes/api/carts.api.routes.js';

// Variables globales
const app = express();
const PORT = process.env.PORT || 8080;
const httpServer = new ServerHttp(app);
const socketServer = new ServerIO(httpServer);

// Configuración de Handlebars con el helper JSON
app.engine('handlebars', engine({
    partialsDir: path.join(__dirname, 'views', 'partials'),
    helpers: {
        json: function (context) {
            return JSON.stringify(context, null, 2);
        }
    },
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    }
}));

app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

// Middleware para lectura de JSON y archivos estáticos
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

// Conexión a Socket.IO
setupSocket(socketServer);

// Conexión a MongoDB
connectToMongo();

// Rutas FS
app.use('/products', productsRouter);
app.use('/carts', productsCarts);

// Rutas de Socket.IO
app.use('/realtimeproducts', realTimeProducts);

// Rutas de la API
app.use('/api/products', producsApiRoutes);
app.use('/api/carts', cartApiRoutes);

// Middleware para errores de servidor
app.use((error, req, res, next) => {
    console.error(error);
    res.status(500).send('Error 500 en el servidor');
});

// Server escuchando en el puerto 8080
httpServer.listen(PORT, (error) => {
    if (error) {
        console.log(error);
    }
    console.log(`Server escuchando en el puerto ${PORT}`);
});
