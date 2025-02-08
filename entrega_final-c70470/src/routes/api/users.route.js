import { Router } from 'express'
import { userModel } from '../../model/users.model.js'

const router = Router()

router.get('/', async(req, res) => {
    const users = await userModel.find({})
    res.send({status: 'success', users})
})

router.post('/', async (req, res) => {
    const { body } = req
    const result = await userModel.create(body)
    res.send({status: 'success', data: result})
})

router.get('/:uid', async (req, res) => {
    const { uid } = req.params
    const userFound = await userModel.findOne({_id: uid})
    res.send({status: 'success', payload: userFound})
})
router.put('/:uid', async  (req, res) => {
    const { body } = req
    const result = await userModel.updateOne(body)
    res.send({status: 'success', data: result})
})

router.delete('/:uid', (req, res) => {
    res.send('delete User')
})


export default router