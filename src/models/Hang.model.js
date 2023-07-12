import connec from '../configs/connectDBmongo.js'
import Joi from 'joi';

const Hangcollection = 'Hang'
const HangSchema = Joi.object({

    MaLK: Joi.string().alphanum().min(3).max(50).required(),

    TenLK: Joi.string().min(3).max(200).required(),

    Donvi: Joi.string().min(3).max(50).required(),

    Soluong: Joi.number().required(),

    NgayNhap: Joi.date().required(),

    MaThuongHieu: Joi.string().min(3).max(50).required(),

    MaNCC: Joi.string().min(3).max(50).required(),

    Color: Joi.string(),

    MaKho: Joi.string().min(3).max(50).required(),

    GiaBanLe: Joi.number().required(),

    TinhTrangHang: Joi.string().min(3).max(50).required(),

})

const validateSchema = async (data) => {
    return await HangSchema.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
    try {
        const value = await validateSchema(data)
        const result = await connec.getDB().collection(Hangcollection).insertOne(value)
        return result
    } catch (error) {
        return error
    }
}

const Hangmodel = createNew

export default { Hangmodel }