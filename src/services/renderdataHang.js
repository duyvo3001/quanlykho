import connec from '../configs/connectDBmongo.js'

// render data from table Hang 
const result = async (kind, key, value) => {
    const Renderdata = async () => {
        let data = await check();
        return data
    }

    const check = async () => {
        let query = '';
        if (key === 'renderData') {
            query = await connec.getDB().collection(kind).find({}).toArray()
        }
        else if (key === 'renderDatanull') {
            query = []
        }
        else {
            if (kind === 'ThuongHieu')
                query = await connec.getDB().collection(kind).find({
                    MaThuongHieu: value
                }).toArray()
            else if (kind === 'Hang')
                query = await connec.getDB().collection(kind).find({
                    MaLK: value
                }).toArray()
            else
                query = await connec.getDB().collection(kind).find({
                    MaNCC: value
                }).toArray()
        }
        return query;
    }
    return Renderdata()
}

export default{ result };