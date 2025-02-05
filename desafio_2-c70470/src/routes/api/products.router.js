import { Router } from 'express'
//import { productsModel } from '../../model/products.model.js'
import productsManager from '../../dao/productsManagerMongo.js'

const router = Router()

const productManager = new productsManager

//Enpoint productos
router.get('/', async (req, res) => {
    const products = await productManager.getProducts()
    res.send({status: 'success', payload:products})
})

//Endpoint productos por id
router.get('/:uid', async (req, res) => {
    const { uid } = req.params
    const product = await productManager.getProductById(uid)
    res.send({status: 'success', payload: product})
})

//Endpoint creacion de producto
router.post('/', async (req, res)=>{
        const { body } = req
        const newProduct = await productManager.addProduct(body)
        res.send({status: 'success', payload: newProduct})
})

//Endpoint actualizar producto
router.put('/:pid', async (req, res) => {
    const { pid } = req.params
    const { body } = req
    //res.send(pid)
    //res.send(body)
    const updateProduct = await productManager.updateProduct(pid,body)
    res.send({status: 'success', message: `Product ${pid} updated`, payload: updateProduct})
})

//Endpint borrar productos
router.delete('/:pid', async (req, res) => {
    const { pid } = req.params
    const productDel = await productManager.deleteProduct(pid)
    res.send({ status: 'success', payload: `Product ${pid} deleted` });
})


export default router