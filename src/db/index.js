import mongoose from "mongoose";

const connectDataBase = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGO_DB_URL}/${DB_NAME}`)
        console("Mongo DB connection failed")
    } catch (error) {
        throw Error("Database connection failed")
        process.exit(1)
    }
}

export {connectDataBase}