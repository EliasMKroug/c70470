import { Router } from 'express'
import cartsMongo  from '../dao/carts.dao.js'

const router = Router()

const cartsManager = new cartsMongo

//Endpoint para traer los carritos By ID
router.get('/:uid', async (req, res) => {
    try {
        const { uid } = req.params
        const allProducts = await cartsManager.getCartsById(uid)
        // Calcular la sumatoria total de productos
        const totalQuantity = allProducts.reduce((acc, item) => acc + item.quantity, 0);
        console.log({ allProducts, totalQuantity })
        res.render('cartProduct', { allProducts, totalQuantity })
    } catch (error) {
        res.status(404).json({ message: 'Error al encontrar los productos' })
        throw error
    }
})

//Endpoint para agregar productos
router.post('/:uid/products/:pid', async (req, res) => {
    const { uid, pid } = req.params
    const { quantity } = req.body 
    try { 
        console.log(quantity)
        if (quantity > 1) {
            const updateProducts = await cartsManager.updateProductToCart(uid,pid,quantity)
            console.log('Se agrego producto exitosamente', { updateProducts }) 
            res.redirect(`/carts/${uid}`)
        } else {
            const allProducts = await cartsManager.addProduct(uid, pid)
            console.log('Se agrego producto exitosamente', { allProducts }) 
            res.redirect(`/carts/${uid}`)
        }

    } catch (error) {
        res.status(404).json({ message: ' No pudo agregarse producto porque no existe ', payload: error})
        console.error("Error al agregar producto al carrito:", error);
        throw error;
    }
})


//Endpoint para Borrar productos
router.delete('/:uid/products/:pid', async (req, res) => {
    try {
        const { uid, pid } = req.params
        await cartsManager.deleteProductToCart(uid, pid)
        res.redirect(`/carts/${uid}`)
    } catch (error) {
        res.status(404).json({ message: 'Error al eliminar el producto', payload: error })
        console.error("Error al eliminar producto del carrito:", error)
    }
})

export default router