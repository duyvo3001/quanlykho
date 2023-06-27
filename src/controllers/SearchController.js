import connec from '../configs/connectDBmongo.js'
import data from "../services/renderdataHang";
const searchfunc = (search) => {
  var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
  if (format.test(search)) {
    return true;
  } else {
    return false;
  }
}
const SearchStock = async (req, res) => {
  let { search } = req.body.formData;

  if (searchfunc(search)) {
    return res.status(500).json({ message: 'chứa kí tự đặt biệt' })
  }

  let datarender = await data.result('Hang', '', search, '', '')

  if (datarender == null) {
    return res.status(500).json({ message: 'rong!' })
  }

  return res.status(200).json({ result: datarender })
}
const SearchCustomer = async (req, res) => {
  
  let datarender = await connec.getDB().collection("Customer").find({}).toArray();

  if (datarender == null) {
    return res.status(500).json({ message: 'rong!' })
  }

  return res.status(200).json({ result: datarender })
}
const SearchStockExport = async (req, res) => {

  let datarender = await connec.getDB().collection("Hang").find({}).toArray();

  if (datarender == null) {
    return res.status(500).json({ message: 'rong!' })
  }

  return res.status(200).json({ result: datarender })
}
export default { SearchStock, SearchStockExport, SearchCustomer }