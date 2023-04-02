import connec from '../configs/connectDBmongo.js'
import Joi from 'joi';

const Documentcollection = 'Document'
const DocumentSchema = Joi.object({

    IdDocument: Joi.string().alphanum().min(3).max(50).required(),

    DocumentNumber: Joi.string().min(3).max(50).required(),

    DocumentNumber2: Joi.string().min(3).max(50).required(),

    ImportDay: Joi.string().min(3).max(50).required(),

    ExportDay: Joi.string().min(3).max(50).required(),

    Status: Joi.string().min(3).max(50).required(),

    detailDocument: {
        IdDocument: Joi.string().min(3).max(50).required,
        Barcode: Joi.string().min(3).max(50).required,
        Quantity: Joi.string().min(3).max(50).required,
        Pricelist: Joi.string().min(3).max(50).required
    },


})

const validateSchema = async (data) => {
    return await DocumentSchema.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
    try {
        const value = await validateSchema(data)
        const result = await connec.getDB().collection(Documentcollection).insertOne(value)
        return result
    } catch (error) {
        console.error(error);
    }
}

const Documentmodel = createNew

export default { Documentmodel }