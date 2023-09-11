import connec from '../configs/connectDBmongo.js'
import Joi from 'joi';

const Customercollection ='Customer'
const CustomerSchema = Joi.object({

    IDCustomer: Joi.string().alphanum().min(3).max(50).required(),

    NameCustomer: Joi.string().min(3).max(50).required(),

    Phone: Joi.string().min(9).max(12).required(),

    Email: Joi.string().email().default(""),

    NgayTao: Joi.date().required()

})

const validateSchema = async (data)=>{
    return await CustomerSchema.validateAsync(data,{abortEarly:false})
}

const createNew = async (data)=>{
    try {
        const value  = await validateSchema(data)
        const result = await connec.getDB().collection(Customercollection).insertOne(value)
        return result 
    } catch (error) {
        console.error(error);
    }
}

const Customermodel = createNew

export default {Customermodel}