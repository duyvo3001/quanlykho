import connec from '../configs/connectDBmongo.js'
import Joi from 'joi';

const KhoHangcollection ='KhoHang'
const KhoHangSchema = Joi.object({

    MaKho: Joi.string().alphanum().min(3).max(50).required(),

    TenKho: Joi.string().max(100).required(),

    DiaChi: Joi.string().min(3).max(200).required(),
    
    SDT: Joi.string().min(5).max(20).required(),

    NgayTao: Joi.date().required()

})

const validateSchema = async (data)=>{
    return await KhoHangSchema.validateAsync(data,{abortEarly:false})
}

const createNew = async (data)=>{
    try {
        const value  = await validateSchema(data)
        const result = await connec.getDB().collection(KhoHangcollection).insertOne(value)
        return result 
    } catch (error) {
        console.error(error);
    }
}

const KhoHangmodel = createNew

export default {KhoHangmodel}