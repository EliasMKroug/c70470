    import { Router } from 'express'
    import cartsMongo  from '../../dao/carts.dao.js'

    const router = Router()

    const cartsManager = new cartsMongo

    //Endpoint de creacion de Carrito
    router.post('/', async (req, res) => {
        try {
            const newCart = await cartsManager.createCart()
            res.status(201).json({ message: 'Cart created', payload: newCart })
        } catch (error) {
            console.error("Error al agregar producto al carrito:", error);
            throw error
        }

    })

    //Endpoint para traer los carritos By ID
    router.get('/:uid', async (req, res) => {
        try {
            const { uid } = req.params
            const allProducts = await cartsManager.getCartsById(uid)
            res.status(200).json({ productList: allProducts })
        } catch (error) {
            res.status(404).json({ message: 'Error al encontrar los productos' })
            throw error
        }
    })

    //Endpoint para actualizar un carrito
    router.put('/uid', async (req, res) =>{ 
        try {
            const { uid } = req.params
            const { products } = req.body
            const cartUpdated = await this.model.updateCart(uid, products)
    
            res.status(201).json({ message: 'Cart Updated', payload: cartUpdated })
        } catch (error) {
            res.status(401).json({ message: 'Error Al actualizar los productos' })
            throw error
        }

     })

    //Endpoint para agregar productos
    router.post('/:uid/products/:pid', async (req, res) => {
        try { 
            const { uid, pid } = req.params
            const addProductToCart = await cartsManager.addProduct(uid, pid) 
            res.status(201).json({ message: ' Producto agregado exitosamente ', payload: addProductToCart})
        } catch (error) {
            res.status(404).json({ message: ' No pudo agregarse producto porque no existe ', payload: error})
            console.error("Error al agregar producto al carrito:", error);
            throw error;
        }
    })

    //Endpoint para actualizar productos de un carrito
    router.put('/:uid/products/:pid', async (req, res) => {

        try {
            const { uid, pid } = req.params
            const { quantity } = req.body
            const prodUpdated = await cartsManager.updateProductToCart(uid, pid, quantity)
            res.status(201).json({ message: 'Producto actualizado Correctamente', payload: prodUpdated })

        } catch (error) {
            res.status(404).json({ message: ' No pudo actualizarce Carrito y productos', payload: error})
            console.error("Error al actualizar producto en el carrito:", error);
            throw error;
        }
    })

    //Endpoint para Borrar productos
    router.delete('/:uid/products/:pid', async (req, res) => {
        try { 
            const { uid, pid } = req.params
            const delProductToCart = await cartsManager.deleteProductToCart(uid, pid) 
            res.status(201).json({ message: ' Producto Borrado exitosamente ', payload: delProductToCart})
        } catch (error) {
            res.status(404).json({ message: ' No pudo agregarse producto porque no existe ', payload: error})
            console.error("Error al agregar producto al carrito:", error);
            throw error;
        }
    })

    export default router