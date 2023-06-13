import connec from '../configs/connectDBmongo.js'

const paidProduct = async (req,res)=>{
    console.log(req.body)
    console.log(await req.body.Render)
}

export default {paidProduct}