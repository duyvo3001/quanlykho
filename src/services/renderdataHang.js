import sqlConfig from '../configs/connecDB';
const sql = require("mssql");

// render data from table Hang 
const result = async (getvalueHang, valueMaLK) => {
    const Renderdata = async ()=>{
        await sql.connect(sqlConfig)
        let data = [];
        data = await sql.query(check());
        return data.recordset
    }
    const check = () =>{
        let query = '' ;
        if (getvalueHang === 'renderData') {
            query = `SELECT TOP (10)*
               FROM [quanlylinhkien].[dbo].[Hang] 
               ORDER BY  NgayNhap DESC
               `;
        }
        else if (getvalueHang === 'renderDatanull') {
            query = `select * from Hang where MaLK=''`
        }
        else {
            query = `select * from Hang where MaLK='${valueMaLK}'`
        }
        return query;
    }
    return Renderdata()
}
const resultThuongHieu = async (key, value) => {
    const Renderdata = async ()=>{
        await sql.connect(sqlConfig)
        let data = [];
        data = await sql.query(check());
        return data.recordset
    }
    const check = () =>{
        let query = '' ;
        if(key === 'renderData'){
            query = `SELECT TOP (10)* from ThuongHieu order by MaThuongHieu desc`
        }
        else if(key === 'renderDatanull'){
            query = `select * from ThuongHieu where MaThuongHieu=''`
        }
        else {
            query = `select * from ThuongHieu where MaThuongHieu='${value}'`
        }
        return query;
    }
    return Renderdata()
}
const resultNCC = async (key,value) => {
    const Renderdata = async ()=>{
        await sql.connect(sqlConfig)
        let data = [];
        data = await sql.query(check());
        return data.recordset
    }
    const check = () =>{
        let query = '' ;
        if(key === 'renderData'){
            query = `SELECT TOP (10)* from NCC order by MaNCC desc`
        }
        else if(key === 'renderDatanull'){
            query = `select * from NCC where MaNCC =''`
        }
        else {
            query = `select * from NCC where MaNCC='${value}'`
        }
        return query;
    }
    return Renderdata()
}
export { result, resultThuongHieu, resultNCC };