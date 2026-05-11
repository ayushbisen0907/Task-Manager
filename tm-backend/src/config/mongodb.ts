import mongoose from "mongoose";
// Import environment variables from .env file.
const connectMongoDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI as string
    );

    console.log("MongoDB connected");
  } catch (error) {
    console.error(error);

    process.exit(1);
  }
};

export default connectMongoDB;