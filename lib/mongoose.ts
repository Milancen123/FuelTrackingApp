import mongoose, { Mongoose } from 'mongoose';

const uri = process.env.MONGODB_URI as string;

if(!uri) {
    throw new Error("uri is not defined");
}

interface MongooseCache{
    conn:Mongoose | null;
    promise:Promise<Mongoose> | null;
}


declare global{
    var mongoose:MongooseCache;
}


let cached = global.mongoose;

if(!cached) {
    cached = global.mongoose={conn:null, promise:null};
}



const dbConnect= async ():Promise<Mongoose> => {
    if (cached.conn) {
        return cached.conn
    }
    if(!cached.promise) {
        cached.promise = mongoose.connect(uri, {
            dbName:"fuelTracking",
        }).then(result=>{
            console.log(result);
            return result;
        }).catch(error=>{
            console.log(error);
            return error;
        });

    }
    cached.conn = await cached.promise;
    return cached.conn;
}


export default dbConnect;