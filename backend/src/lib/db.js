import mongoose from "mongoose";

console.log("mongo uri:", process.env.MONGO_URI);
export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log("database connected", conn.connection.host);
  } catch (error) {
    console.log("error in connecting to the database", error);
  }
};
