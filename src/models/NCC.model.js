import connec from '../configs/connectDBmongo.js'
import Joi from 'joi';

const NCCcollection = 'NCC'
const NCCSchema = Joi.object({

    MaNCC: Joi.string().alphanum().min(3).max(10).required(),

    TenNCC: Joi.string().min(3).max(50).required(),

    DiaChi: Joi.string().max(100).required(),

    SDT: Joi.string().min(9).max(12).required(),

    Email: Joi.string().email().required()
})

const validateSchema = async (data) => {
    return await NCCSchema.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
    try {
        const value = await validateSchema(data)
        const result = await connec.getDB().collection(NCCcollection).insertOne(value)
        return result
    } catch (error) {
        console.error(error);
    }
}

const NCCmodel = createNew

export default { NCCmodel }