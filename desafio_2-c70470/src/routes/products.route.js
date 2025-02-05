import { Router } from 'express'
import { __dirname } from '../utils.js';
import fs from 'fs'
import path from 'path'  

const router = Router()

//Creacion de productsManager
class ProductManager {
    constructor() {      
        this.nextId = 1;
        this.path = path.join(__dirname+'/data/products.json'); // Ruta del archivo
        this.productsData = fs.readFileSync(this.path)
        this.products = JSON.parse(this.productsData);           
    }
  
    getProducts() {
        return this.products;
    }

    getProductById(id) {
        const product = this.products.find((p) => p.id === id);
        if (!product) {
          throw new Error('Producto no encontrado');
        }
        return product;
    }

    addProduct(product) {
      let existingProduct = this.products.find(p => p.id === product.id);
      if (existingProduct) {
        throw new Error('El código del producto ya está en uso.');
      }
      const id = this.nextId++;
      const newProduct = { id, ...product};
      this.products.push(newProduct);
      this.saveToFile();
      return newProduct;
    }
  
    updateProduct(id, updatedFields) {
      const index = this.products.findIndex((p) => p.id === id);
      if (index === -1) {
        throw new Error('Product not found');
      }
      this.products[index] = { ...this.products[index], ...updatedFields };
      this.saveToFile();
      return this.products[index];
    }
  
    deleteProduct(id) {
      const index = this.products.findIndex(p => p.id === id);
      if (index === -1) {
        throw new Error('Product not found');
      }
      this.products.splice(index, 1);
      this.saveToFile();
    }

    saveToFile() {
      fs.writeFileSync(this.path, JSON.stringify(this.products, null, 2), 'utf-8');
    }


}

//INICIO DE CRUD

//Defino mi clase ProductManager
const productManager = new ProductManager()

//Endpoint para veo todos los productos
router.get('/', (req, res) => {
    let productsAll = productManager.getProducts()
    const limit = parseInt(req.query.limit);
    if (limit) {
        res.json(productsAll.slice(0, limit));
    } else {
        res.json(productsAll);
    }
})

//Endpoint para filtar producto especifico
router.get('/:pid', (req, res) => {
    let productId = parseInt(req.params.pid)
    try {
    const productById = productManager.getProductById(productId);
    res.json(productById);
    } catch (error) {
    res.status(404).json({ error: 'El producto no existe' });
    }
})

//Endpoint para agregar producto
router.post('/', (req, res) => {
    try {

        // Extraer los datos del cuerpo de la solicitud
        const { title, description, code, price, status, stock, category, thumbnail } = req.body;
        
        // Verificar si todos los campos obligatorios están presentes
        if (!title || !description || !code || !price || !status || !stock || !category) {
            throw new Error('Todos los campos son obligatorios.');
        }

        // Crear el nuevo objeto de producto
        const newProduct = {
            id: productManager.nextId++,
            title,
            description,
            code,
            price,
            status,
            stock,
            category,
            thumbnail:"Sin imagen"
        };

        productManager.addProduct(newProduct);
        
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Endpoint para actualizar un producto por ID
router.put('/:pid', (req, res) => {
    const productId = parseInt(req.params.pid);
    const updatedFields = req.body;
    try {
        // Verificar si se proporcionaron campos para actualizar
        if (Object.keys(updatedFields).length === 0) {
            throw new Error('No se proporcionaron campos para actualizar.');
        }
        const updatedProduct = productManager.updateProduct(productId, updatedFields);
        res.json(updatedProduct);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Endpoint para eliminar un producto por ID
router.delete('/:pid', (req, res) => {
    const productId = parseInt(req.params.pid);
    try {
        productManager.deleteProduct(productId);
        res.status(200).json({ message: 'Producto eliminado exitosamente' });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

export default router