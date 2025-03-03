import { fileURLToPath } from 'url'
import { dirname } from "path"
import multer from 'multer'

//Ruta /src export __dirname
const __filename = fileURLToPath(import.meta.url)
export const __dirname = dirname(__filename)    

//Carga de archivo con multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, __dirname + '/public/image')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

export const uploader = multer({ storage })

