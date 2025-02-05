import { Schema, model } from 'mongoose'

const cartsCollection = 'carts'

const cartsSchema = new Schema({
    // userId: String
    products: {
        type: [{
            product: {
                type: Schema.Types.ObjectId,
                ref: 'products'
            },
            quantity: Number
        }]
    }
})

//ODM
export const cartsModel = model(cartsCollection, cartsSchema)