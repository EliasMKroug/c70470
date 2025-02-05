import { Router } from "express";
import { __dirname } from "../utils.js";
import fs from 'fs'
import { title } from "process";

const router = Router()

class ViewsManager{
    constructor(){
        this.productsData = fs.readFileSync(__dirname+'/data/products.json')
        this.products = JSON.parse(this.productsData); 
    }

    getProducts(){
        return this.products
    }
}

//ManagerViews
const viewManager = new ViewsManager()

//ruta con datos que va a generar el home.handlebars
router.get('/', (req, res) => {
    const productAll = viewManager.getProducts()
    const user = {
        username: 'eliaskroug',
        nombre: 'elias',
        apellido: 'kroug',
        role: 'admin'
    }
    res.render('home', { productAll,
        role: user.role === 'admin' })
})


export default router