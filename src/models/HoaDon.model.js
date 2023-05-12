import connec from '../configs/connectDBmongo.js'
import Joi from 'joi';

const HoaDoncollection = 'HoaDon'
const HoaDonSchema = Joi.object({
    MaHD: Joi.string().alphanum().min(3).max(50).required(),

    MaLK: Joi.string().alphanum().min(3).max(50).required(),

    MaKH: Joi.string().min(3).max(10).required(),

    MaNV: Joi.string().min(3).max(50).required(),

    NgayLapHD: Joi.date().default(Date.now)
})

const validateSchema = async (data) => {
    return await HoaDonSchema.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
    try {
        const value = await validateSchema(data)
        const result = await connec.getDB().collection(HoaDoncollection).insertOne(value)
        return result
    } catch (error) {
        console.error(error);
    }
}

const HoaDonmodel = createNew

export default { HoaDonmodel }