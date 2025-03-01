import { cartsModel } from './models/carts.models.js'

class cartsMongo{
    constructor(){
        this.model = cartsModel
    }

    getCarts = async () => {
        const carts = await this.model.find().lean()
        return carts
    }

    createCart = async () => {
        try {
            const newCart = await this.model.create({ products: [] });
            return newCart;
        } catch (error) {
            // Manejar el error de clave duplicada
            if (error.code === 11000) {
                // Si el error es por clave duplicada, intenta actualizar en lugar de insertar
                const existingCart = await this.model.findOneAndUpdate(
                    { /* Puedes agregar aquí tu criterio de búsqueda, por ejemplo, el título */ },
                    { $setOnInsert: { products: [] } }, // Establecer el campo products solo en la inserción
                    { upsert: true, new: true }
                );
                return existingCart;
            } else {
                // Otro tipo de error, lanzar el error
                throw error;
            }
        }
    }

    addProduct = async (uid, pid) => {
        // Buscar el carrito por el ID del usuario
        let cart = await this.model.findOne({ _id: uid });
    
        // Verificar si el carrito existe
        if (!cart) {
            throw new Error('Carrito no encontrado');
        }
        // Incrementar la cantidad si el producto ya está en el carrito
        const existingProductIndex = cart.products.findIndex(item => item.product.toString() === pid);
        if (existingProductIndex !== -1) {
            cart.products[existingProductIndex].quantity += 1;
        } else {
            // Si el producto no está en el carrito, agregarlo con una cantidad de 1
            cart.products.push({ product: pid, quantity: 1 });
        }
        // Guardar los cambios en la base de datos
        const resp = await this.model.findByIdAndUpdate({ _id: uid }, cart);
    
        return resp;
    }
    
}

export default cartsMongo
