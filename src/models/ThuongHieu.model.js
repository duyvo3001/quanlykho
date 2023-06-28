import connec from '../configs/connectDBmongo.js'
import Joi from 'joi';

const ThuongHieucollection ='ThuongHieu'
const ThuongHieuSchema = Joi.object({

    MaThuongHieu: Joi.string().alphanum().min(3).max(50).required(),

    TenThuongHieu: Joi.string().min(2).max(50).required(),

    NgayNhap: Joi.date().required()

})

const validateSchema = async (data)=>{
    return await ThuongHieuSchema.validateAsync(data,{abortEarly:false})
}

const createNew = async (data)=>{
    try {
        const value  = await validateSchema(data)
        const result = await connec.getDB().collection(ThuongHieucollection).insertOne(value)
        return result 
    } catch (error) {
        console.error(error);
    }
}

const ThuongHieumodel = createNew

export default {ThuongHieumodel}