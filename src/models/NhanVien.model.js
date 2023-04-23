import connec from '../configs/connectDBmongo.js'
import Joi from 'joi';

const NhanViencollection ='NhanVien'
const NhanVienSchema = Joi.object({

    MaNV: Joi.string().min(3).max(50).required(),

    TenNV: Joi.string().min(3).max(50).required(),

    GioiTinh: Joi.number().required(),

    DiaChi: Joi.string().min(1).max(50).required(),

    NgaySinh: Joi.date().required(),

    USER_NV: Joi.string().min(3).max(50).required(),
    
    PASSWORD: Joi.string().min(5).max(100).required(),

    SDT: Joi.string().min(9).max(100).required(),

    Email : Joi.string().email().required(),

    NgayTao: Joi.date().required(),

    AccessRight : {
        create: Joi.string().min(3).max(10),
        read: Joi.string().min(3).max(10),
        update: Joi.string().min(3).max(10),
        Delete: Joi.string().min(3).max(10)
    }
})

const validateSchema = async (data)=>{
    return await NhanVienSchema.validateAsync(data,{abortEarly:false})
}

const createNew = async (data)=>{
    try {
        const value  = await validateSchema(data)   
        const result = await connec.getDB().collection(NhanViencollection).insertOne(value)
        return result;
    } catch (error) {
        console.error(error);
    }
}

const NhanVienmodel = createNew

export default {NhanVienmodel}