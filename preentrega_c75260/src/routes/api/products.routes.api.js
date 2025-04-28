import { Router } from 'express'
//import { productsModel } from '../../model/products.model.js'
import productsMongo from '../../dao/products.dao.js'
import { uploader } from '../../utils.js'

const router = Router()

const productManager = new productsMongo

//Enpoint productos con query params
router.get('/', async (req, res) => {
    const products = await productManager.getProducts(req.query)
    res.send({status: 'success', payload:products})
})

//Endpoint productos por id
router.get('/:uid', async (req, res) => {
    const { uid } = req.params
    const product = await productManager.getProductById(uid)
    res.send({status: 'success', payload:product})
})

//Endpoint creacion de producto
router.post('/', uploader.single("file"), async (req, res)=>{
    if(!req.file) return res.status(402).json({ message: "Error en algun campo" })
    
    const thumbnail = req.file.path.split('public')[1]
    const prod = req.body
    const newProduct = await productManager.addProduct(prod, thumbnail)

    res.status(201).json({status: 'success', payload: newProduct})
})

//Endpoint actualizar producto
router.put('/:pid', uploader.single('file'), async (req, res) => {
    const { pid } = req.params
    const updateProduct = await productManager.updateProduct(req,pid)
    res.status(201).json({status: 'success', message: `Product updated`, payload: updateProduct})
})

//Endpint borrar productos
router.delete('/:pid', async (req, res) => {
    const { pid } = req.params
    const productDel = await productManager.deleteProduct(pid)
    const stat = productDel ? 200 : 400
    res.status(stat).json({ message: `Product deleted`, payload: productDel});
})


export default router