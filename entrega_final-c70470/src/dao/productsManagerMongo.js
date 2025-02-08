import { productsModel } from "../model/products.model.js"

class productManagerMongo {
    constructor() {
        this.model = productsModel
    }

    getProducts = async () => { 
        const products = await this.model.find().lean()
        return products 
    }

    getProductById = async (id) => {
        
        try {
            const product = await this.model.findOne({_id: id})
            return product
        } catch (error) {
            // Manejo de errores
            console.error("Error al Buscar el producto:", error);
            throw error;
        }
    }

    addProduct = async (product) => {
        try {
            const newProduct = await this.model.create(product)
            return newProduct
        } catch (error) {
            // Manejo de errores
            console.error("Error al agregar el producto:", error);
            throw error;
        }
    }

    updateProduct = async (pid,product) => {
        try {
            const updatedProduct = await this.model.updateOne({_id: pid},product)
            return updatedProduct
        } catch (error) {
            // Manejo de errores
            console.error("Error al actualizar el producto:", error);
            throw error;
        }
    }

    deleteProduct = async (pid) => {
        try {
            const pDel = await this.model.deleteOne({_id: pid})
            return pDel
        } catch (error) {
            // Manejo de errores
            console.error("Error al borrar el producto:", error);
            throw error;
        }
    }
}

export default productManagerMongo