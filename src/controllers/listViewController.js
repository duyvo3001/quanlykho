import { result} from "../services/renderdataHang";
let viewListPage = async (req,res)=>{
    return res.render('viewList.ejs',{ result: await result('renderData', '')})
}
export default {viewListPage}