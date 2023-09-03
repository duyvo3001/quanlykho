import jwt from 'jsonwebtoken';

const AccessHandler = (type, action) => {//create middleware access right handler
    return (req, res, next) => {
        const token = req.headers?.authorization
        const data = jwt.verify(token, process.env.ACCESS_TOKEN)
        const dataAccess = data?.accessrights?.[type]?.[action]

        if (dataAccess == false || dataAccess == undefined) {
            return res.status(403).json({ message: "not allowed" })
        }
        next()
    }
}

const authenToken = (req, res, next) => {// middleware authentoken handler
    const token = req.headers?.authorization
    // console.info(token)
    if (!token)
        return res.status(401).json({ message: 'k co token' })

    jwt.verify(token, process.env.ACCESS_TOKEN, (err, data) => {
        if (err) { return res.status(401).json({ message: 'sai token' }) }
        next();
    })

}

module.exports = {
    authenToken, AccessHandler
}