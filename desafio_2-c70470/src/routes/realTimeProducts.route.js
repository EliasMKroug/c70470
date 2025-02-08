import { Router } from 'express';
import { __dirname } from '../utils.js';
import fs from 'fs';
import path from 'path';

const router = Router();

// Clase ProductManager
class ProductManager {
    constructor() {
        this.path = path.join(__dirname, '/data/products.json'); // Ruta del archivo
        this.productsData = fs.existsSync(this.path) ? fs.readFileSync(this.path, 'utf-8') : '[]';
        this.products = JSON.parse(this.productsData);
    }

    getProducts() {
        return this.products;
    }

    addProduct(product) {
        let existingProduct = this.products.find(p => p.code === product.code);
        if (existingProduct) {
            throw new Error('El código del producto ya está en uso.');
        }
        
        const newId = this.getNextAvailableId();
        const newProduct = { id: newId, ...product };
        this.products.push(newProduct);
        this.saveToFile();
        return newProduct;
    }

    deleteProduct(id) {
        const index = this.products.findIndex(p => p.id === id);
        if (index === -1) {
            throw new Error('Producto no encontrado.');
        }
        this.products.splice(index, 1);
        this.saveToFile();
    }

    getNextAvailableId() {
        if (this.products.length === 0) return 1; // Si no hay productos, comenzamos en 1
        const ids = this.products.map(p => p.id).sort((a, b) => a - b);
        for (let i = 1; i <= ids.length; i++) {
            if (!ids.includes(i)) {
                return i; // Retornar el primer ID faltante
            }
        }
        return ids[ids.length - 1] + 1; // Si no hay huecos, asignar el siguiente ID
    }

    saveToFile() {
        fs.writeFileSync(this.path, JSON.stringify(this.products, null, 2), 'utf-8');
    }
}

// Instancia de ProductManager
const productManager = new ProductManager();

// Ruta para renderizar la vista con Handlebars
router.get('/', (req, res) => {
    res.render('realTimeProducts', { products: productManager.getProducts() });
});

// Función para configurar Socket.IO en app.js
export const setupSocket = (socketServer) => {
    socketServer.on('connection', (socket) => {
        console.log('Nuevo cliente conectado!, se conectó ->', socket.id);
        socket.emit('update-products', productManager.getProducts());
        // Agregar producto
        socket.on('add-product', (productData) => {
            try {
                io.emit('update-products', productManager.getProducts()); // Actualizar todos los clientes
            } catch (error) {
                socket.emit('error-message', error.message);
            }
        });
        // Eliminar producto
        socket.on('delete-product', ({ id }) => {
            try {
                productManager.deleteProduct(id);
                io.emit('update-products', productManager.getProducts()); // Actualizar todos los clientes
            } catch (error) {
                socket.emit('error-message', error.message);
            }
        });
    });
};

export default router;
