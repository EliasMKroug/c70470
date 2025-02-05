import { Schema, model } from 'mongoose'

const usersCollection = 'users'

const userSchema = new Schema({
    first_name: String,
    last_name: String,
    email: {
        type: String,
        required: true,
        unique: true
    },
    gender: String
})

//odm
export const userModel = model(usersCollection, userSchema)
