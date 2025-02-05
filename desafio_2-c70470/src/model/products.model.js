import { Schema, model } from 'mongoose'

const productsCollection = 'products'

const productsSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    description: String,
    code: String,
    price: Number,
    status: Boolean,
    stock: Number,
    category: String,
    thumbnail: String

})

//ODM

export const productsModel = model(productsCollection, productsSchema)