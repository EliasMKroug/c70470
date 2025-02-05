import { Router } from 'express'
import { __dirname } from '../utils.js'
import fs from 'fs'
import path from 'path'
import { error } from 'console'
import { captureRejectionSymbol } from 'events'

const router = Router()

class cartsManager {

    constructor(){
        this.nextId = 1
        this.path = path.join(__dirname+'/data/carrito.json')
        this.cartData = fs.readFileSync(this.path)
        this.carts = JSON.parse(this.cartData);
        this.loadNextId()
    }

    addCart(products) {
        let cartId = this.nextId++
        // Verificar si el ID generado ya existe
        while (this.carts.some(cart => cart.id === cartId)) {
            cartId = this.nextId++
        }
        const newCart = {
            id: cartId,
            products: products
        }
        //this.saveCart(newCart)
        this.carts.push(newCart)

        try {
            fs.writeFileSync(this.path, JSON.stringify(this.carts, null, 4))
        } catch (error) {
            console.error('Error al escribir en el archivo de carritos:', error)
        }
        return newCart
    }

    findCart(cid){
        const cart = this.carts.find(cart => cart.id === cid);
        console.log(cart)
        if (!cart) {
            throw new Error('Carrito no encontrado');
        }
        return cart;
    }  

    addProductToCart(cid, productId) {
        try {
            const cart = this.findCart(cid);
            const existingProduct = cart.products.find(product => product.productId === productId);
            if (existingProduct) {
                // Si el producto ya existe en el carrito, aumentar la cantidad
                existingProduct.quantity++;
            } else {
                // Si el producto no existe, agregarlo al carrito con una cantidad inicial de 1
                this.carts.products.push({
                    productId: productId,
                    quantity: 1
                });
            }
            try {
                fs.writeFileSync(this.path, JSON.stringify(this.carts, null, 4))
            } catch (error) {
                console.error('Error al escribir en el archivo de carritos:', error)
            }
            return cart;
        } catch (error) {
            console.error('Error en addProductToCart:', error);
            throw new Error('Error interno del servidor');
        }
    }
    
    saveCart(cart) {
        try {
            const updatedCarts = this.carts.map(existingCart => {
                if (existingCart.id === cart.id) {
                    // Si el carrito existe, verifica si el producto ya está en el carrito
                    const existingProductIndex = existingCart.products.findIndex(product => product.productId === cart.products.productId);
                    if (existingProductIndex !== -1) {
                        // Si el producto ya existe, aumenta la cantidad
                        //existingCart.products[existingProductIndex].quantity += cart.products[0].quantity;
                        existingCart.products[existingProductIndex].quantity++
                    } else {
                        // Si el producto no existe, agrégalo al carrito
                        existingCart.products.push(cart.products[0]);
                    }
                    return existingCart;
                }
                return existingCart;
            });
    
            fs.writeFileSync(this.path, JSON.stringify(updatedCarts, null, 4));
            this.carts = updatedCarts; // Actualiza el estado interno de los carritos
        } catch (error) {
            console.error('Error al escribir en el archivo de carritos:', error);
        }
    }
    


    loadNextId() {
        try {
            const data = fs.readFileSync(this.path, 'utf8')
            const carts = JSON.parse(data)
            if (carts.length > 0) {
                const lastCart = carts[carts.length - 1]
                this.nextId = lastCart.id + 1
            } else {
                this.nextId = 1
            }
        } catch (error) {
            console.error('Error al leer el archivo de carritos:', error)
        }
    }
};

//Manager de carrito
const managerCarts = new cartsManager()

//Endpoint para agregar producto a un carrito
router.post('/', (req, res) => {
    try{
        const products = req.body
        const newCart = managerCarts.addCart(products)
        res.status(201).json(newCart)
    }
    catch(error){
        res.status(500).send('Error interno del servidor')
    }
});

//Endpoint para filtrar los productos de un carrito especifico
router.get('/:cid', (req, res) => {
    try {
        const cid = parseInt(req.params.cid);
        const cart = managerCarts.findCart(cid)
        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }
        res.json(cart);
    } catch (error) {
        res.status(500).send('Error interno del servidor');
    }
});

//Endpoint para agregar un producto a un carrito
router.post('/:cid/product/:pid', (req, res) => {
    try {
        const cid = parseInt(req.params.cid);
        const pid = parseInt(req.params.pid);       
        const cart = managerCarts.addProductToCart(cid, pid);
        
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).send('Error interno del servidor');
    }
});

export default router
