// db.js
import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect("mongodb://sahil:980980@localhost:27017/online-classroom?authSource=admin", {
      serverSelectionTimeoutMS: 10000, // Optional: adjust timeout
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error}`);
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;



