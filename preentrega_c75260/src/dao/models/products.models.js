import { Schema, model } from 'mongoose'
import mongoosepaginatev2 from 'mongoose-paginate-v2'

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

productsSchema.plugin(mongoosepaginatev2)

//ODM
export const productsModel = model(productsCollection, productsSchema)