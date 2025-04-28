import { cartsModel } from './models/carts.models.js'

class cartsMongo{
    constructor(){
        this.model = cartsModel
    }


    getCartsById = async (uid) => {
        const cartFinded = await this.model.findById(uid).populate('products.product')
        const prodFinded = cartFinded?.products
        return prodFinded
    }

    createCart = async () => {
        try {
            const newCart = await this.model.create({ products: [] });
            return newCart;
        } catch (error) {
            // Manejar el error de clave duplicada
            if (error.code === 11000) {
                const existingCart = await this.model.findOneAndUpdate(
                    {},
                    { $setOnInsert: { products: [] } }, 
                    { upsert: true, new: true }
                );
                return existingCart;
            } else {
                throw error;
            }
        }
    }

    updateCart = async (uid, products) => {
        const cartFinded = await this.model.findById(uid).lean()
        const newCart = {
            ...cartFinded,
            products
        }
        const cartUpdated = await this.model.findByIdAndUpdate(uid, newCart, { new: true })
        return cartUpdated
    }

    addProduct = async (uid, pid) => {
        const cartFinded = await this.model.findById(uid)
        if (!cartFinded) {
            throw new Error('Carrito no encontrado');
        }
        const existingProductIndex = cartFinded.products.findIndex(item => item.product.toString() === pid);
        if (existingProductIndex !== -1) {
            cartFinded.products[existingProductIndex] = { product: cartFinded.products[existingProductIndex].product, quantity: cartFinded.products[existingProductIndex].quantity + 1 }
        } else {
            cartFinded.products.push({ product: pid, quantity: 1 });
        }
        // Guardar los cambios en la base de datos
        const cartUpdated = await this.model.findByIdAndUpdate(uid, cartFinded, { new: true },).populate('products.product')
    
        return cartUpdated;
    }

    updateProductToCart = async (uid, pid, quantity) => {

        const cartFinded = await this.model.findById(uid).lean()
        
        const indexProd = cartFinded.products.findIndex(prod => prod.product.toString() === pid)

        cartFinded.products[indexProd] = { ...cartFinded.products[indexProd], quantity }

        const cartUpdated = await this.model.findByIdAndUpdate(uid, cartFinded, { new: true }).populate('products.product')

        return cartUpdated
    }

    deleteProductToCart = async (uid,pid) => {
        const cartFinded = await this.model.findById(uid)
        if (!cartFinded) {
            throw new Error('Carrito no encontrado');
        }
        const existingProductIndex = cartFinded.products.findIndex(item => item.product.toString() === pid);
        
        // Guardar los cambios en la base de datos
        await this.model.findByIdAndDelete(uid, existingProductIndex, { new: true },)
        const cartDeleted = await this.model.findById(uid) 
        return cartDeleted;
    }
    
    deleteProductsToCart = async (uid, pid) => {
        const updatedCart = await this.model.findByIdAndUpdate(
            uid,
            { $pull: { products: { product: pid } } }, // Elimina el producto específico del array
            { new: true } // Devuelve el carrito actualizado
        );

        if (!updatedCart) {
            throw new Error('Carrito no encontrado');
        }

        return updatedCart;

    };
    
    
}

export default cartsMongo
