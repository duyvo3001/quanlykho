import data from "../services/renderdataHang";
import connec from '../configs/connectDBmongo.js'
let barcodePage = async (req, res) => {
    if (req.params.item === 'all') {
        return res.render('barcode.ejs', { result: await data.result('Hang', 'renderData', '') })     
    } else {
        return res.render('barcode.ejs', { result: await data.result('Hang', 'renderData', '') })
    }
}
let printbarcode = async (req, res) => {

}
export default { barcodePage }; 