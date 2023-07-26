import connec from '../configs/connectDBmongo.js'
import Joi from 'joi';

const Categorycollection ='Category'
const CategorySchema = Joi.object({

    Category: Joi.string().alphanum().min(3).max(50).required(),

    Date: Joi.date().required()

})

const validateSchema = async (data)=>{
    return await CategorySchema.validateAsync(data,{abortEarly:false})
}

const createNew = async (data)=>{
    try {
        const value  = await validateSchema(data)
        const result = await connec.getDB().collection(Categorycollection).insertOne(value)
        return result 
    } catch (error) {
        console.error(error);
    }
}

const Categorymodel = createNew

export default {Categorymodel}