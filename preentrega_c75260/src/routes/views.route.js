import { Router } from "express";
import productsMongo from '../dao/products.dao.js'

const router = Router()

//ManagerViews
const viewManagerMongo = new productsMongo()

//ruta con datos que va a generar el home.handlebars
// router.get('/', async (req, res) => {})


export default router