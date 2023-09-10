import modelCaterory from "../models/Category.model"
import data from "../services/renderdataHang";
import connec from '../configs/connectDBmongo.js'
import mongoose from "mongoose"

let deleteCategory = async (req, res) => {
  let Category = req.params.item
  await connec.getDB().collection('Category').deleteMany({ Category })
  return res.status(200).json({ message: 'delete success' });
}

let editCategory = async (req, res) => {
  let { _id, Category } = req.body.formData

  let fileId = new mongoose.Types.ObjectId(_id);

  let querycheck = connec.getDB().collection('Category').find({ Category }).toArray()

  if (Object.keys(querycheck).length == 1)
    return res.status(404).json({ message: 'same Category' })

  let resultUpdate = await connec.getDB().collection('Category').updateOne(
    { _id: fileId }, {
    $set: { Category }
  })
  if (resultUpdate?.acknowledged == true)
    return res.status(200).json({ message: 'update success' });
  else
    return res.status(500).json({ message: 'update failed' });
}

let ImportCategory = async (req, res) => {
  let { IDcategory } = req.body.formData
  let querycheck = await connec.getDB().collection('Hang').find({
    Category: IDcategory
  }).toArray()

  if (Object.keys(querycheck).length == 1)
    return res.status(500).json({ message: 'trùng mã nhập hàng' })

  let data = {
    Category: IDcategory,
    Date: Date.now()
  }
  try {
    let result = await modelCaterory.Categorymodel(data)
    if (result.acknowledged === true) {
      return res.status(200).json({ message: 'Create category success' });
    }
    else {
      return res.status(500).json({ message: `Can not create category` })
    }
  } catch (error) {
    return res.status(500).json({ message: `Can not create category` })
  }
}
let getCategory = async (req, res) => {
  const pageIndex = req.params.pageIndex || 1;
  const limit = 16;
  const skip = (pageIndex - 1) * limit;
  return res.status(200).json({ result: await data.result('Category', 'renderData', '', limit, skip) });
}
export default { ImportCategory, getCategory, deleteCategory, editCategory }