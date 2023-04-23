import connec from '../configs/connectDBmongo.js'

// render data from table Hang 
const result = async (kind, key, value, limit, skip) => {
    const Renderdata = async () => {
        let data = await check();
        return data
    }
    const check = async () => {
        let query = '';
        switch (key) {
            case 'renderData':
                query = await connec.getDB().collection(kind).find().sort({ NgayNhap: -1 }).limit(limit).skip(skip).toArray();
                break;
            case 'renderDatanull':
                query = [];
                break;
            default:
                switch (kind) {
                    case 'ThuongHieu':
                        query = await connec.getDB().collection(kind).find({ MaThuongHieu: value }).toArray();
                    case 'Hang':
                        query = await connec.getDB().collection(kind).find({ MaLK: value }).toArray();
                    default:
                        query = await connec.getDB().collection(kind).find({ MaNCC: value }).toArray();
                }
                break;
        }
        return query;
    }
    return Renderdata()
}

export default { result };