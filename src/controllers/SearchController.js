import   data  from "../services/renderdataHang";
const searchfunc = (search)=>{
    var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    if(format.test(search)){
      return true;
    } else {
      return false;
    }
}
const SearchStock = async (req, res) => {
    let { search } = req.body;
    searchfunc(search) ? res.send('chứa kí tự đặt biệt') : 
    res.render('ImportStock.ejs', { result: await data.result('Hang','',search) })
}

const SearchSupplier = async (req, res) => {
    let { search } = req.body;
    searchfunc(search) ? res.send('chứa kí tự đặt biệt') : 
    res.render('importNCC.ejs', { result: await data.result('NCC','',search) })
}

const SearchBrand = async (req, res) => {
    let { search } = req.body;
    searchfunc(search) ? res.send('chứa kí tự đặt biệt') : 
    res.render('importThuongHieu.ejs', { result: await data.result('ThuongHieu','',search) })
}
export default { SearchStock, SearchSupplier, SearchBrand }