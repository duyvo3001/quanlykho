import jwt from 'jsonwebtoken';

const use = fn => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);

//create middleware access right handler


// middleware authentoken handler
const authenToken = (req, res, next) => {
    const token = req.headers?.authorization
    console.info(token)
    if (!token)
        return res.status(401).json({ message: 'k co token' })

    jwt.verify(token, process.env.ACCESS_TOKEN, (err, data) => {
        if (err) { return res.status(401).json({ message: 'sai token' }) }
        next();
    })

    const test = jwt.verify(token, process.env.ACCESS_TOKEN)
    console.info(test)
}

module.exports = {
    use, authenToken
}