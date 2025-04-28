import { productsModel } from "./models/products.models.js"

class productsMongo {
    constructor() {
        this.model = productsModel
    }

    getProducts = async (queryProduct) => {
        
        const { limit = 10, page = 1, sort = '',  ...query} = queryProduct
        const sortManager = {
            'asc': 1,
            'desc': -1
        }

        const products = await this.model.paginate(
            {...query},
            {
                limit,
                page,
                ...(sort && {sort: { price: sortManager[sort] }}),
                customLabels: { docs: 'payload' }
            }
        );
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

    addProduct = async (product, fileUploaded) => {
        try {
            const newProduct = await this.model.create({ ... product,
                thumbnail: fileUploaded,
            })
            return newProduct
        } catch (error) {
            console.error("Error al agregar el producto:", error);
            throw error;
        }
    }

    updateProduct = async (req,id) => {
        try {
            const { body } = req
            const product = body
            const updateProduct = await this.model.findByIdAndUpdate(id, 
                {
                    ...product,
                    ...(req?.file?.path && { thumbnail: req.file.path })
                }, 
                { new: true })
            return updateProduct
        } catch (error) {
            console.error("Error al actualizar el producto:", error);
            throw error;
        }
    }

    deleteProduct = async (pid) => {
        try {
            const pDel = await this.model.deleteOne({_id: pid})
            return pDel
        } catch (error) {
            console.error("Error al borrar el producto:", error);
            throw error;
        }
    }
}

export default productsMongo