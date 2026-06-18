// lib/mongoose.ts

import mongoose, {Mongoose} from 'mongoose';
import logger from "@/lib/logger";
import "@/database"

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
    throw new Error('MongoDB URI must be defined');
}

interface MongooseCache {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
}

declare global {
    var mongoose: MongooseCache;
}

let cached = global.mongoose;
if (!cached) {
    cached = global.mongoose = {conn: null, promise: null};
}

const dbConnect = async () => {
    if (cached.conn) {
        logger.info('Using existing mongodb connection');
        return cached.conn;
    }

    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI, { dbName: "devflow" })
            .then((result) => {
                logger.info('Connected to MongoDB');
                return result;
            })
            .catch((error) => {
                logger.error("Error Connecting To MongoDB", error);
                cached.promise = null; 
                throw error;
            });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null; 
        throw e;
    }

    return cached.conn;
}
export default dbConnect;