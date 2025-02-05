import { Router } from 'express'
import cartsManagerMongo  from '../../dao/cartsManagerMongo.js'

const router = Router()

const cartsManager = new cartsManagerMongo

//Endpoint para traer los carritos
router.get('/', async (req, res) => {
    try {
        const carts = await cartsManager.getCarts()
        res.send({status: 'success', payload: carts})
    } catch (error) {
        // Manejo de errores
        console.error("Error al buscar carritos:", error);
        throw error;
    }
})

//Endpoint de creacion de Carrito
router.post('/', async (req, res) => {
    try {
        const newCart = await cartsManager.createCart()
        res.send({status: 'success', payload: newCart})
    } catch (error) {
        // Manejo de errores
        console.error("Error al crear carrito:", error);
        throw error;
    }
})

//Endpoint para agregar productos
router.post('/:uid/products/:pid', async (req, res) => {
    try {
        const { uid,pid } = req.params
        const addProductToCart = await cartsManager.addProduct(uid,pid) 
        res.send({status: 'success', payload: addProductToCart})
    } catch (error) {
        // Manejo de errores
        console.error("Error al agregar producto al carrito:", error);
        throw error;
    }
})

export default router