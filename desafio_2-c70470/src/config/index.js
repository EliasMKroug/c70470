import { connect } from 'mongoose'

export const connectDb = () => {
    console.log('DB conneted')
    //connect('mongodb://127.0.0.1:27017/preentrega_2')
    connect('mongodb+srv://emkroug95:r6Hn9AF7tOzvpDPx@emkroug.nbbwn13.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=emkroug')
}