import { MongoClient, ServerApiVersion } from 'mongodb';

let dbInstance = null
const connectMGDB = async (url) => {
    const client = new MongoClient(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverApi: ServerApiVersion.v1,
    }, { connectTimeoutMS: 30000 },
        { keepAlive: 1 })

    client.connect()

    dbInstance = client.db('qllk')
}

const getDB = () => {
    if (!dbInstance) throw new Error('disconnnection failed');
    return dbInstance
}

export default { connectMGDB, getDB };

