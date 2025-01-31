import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      "Please enter a valid email",
    ],
  },
  password: {
    type: String,
    required: true,
  },
  profilePic : {
    type: String,
    default: "https://res.cloudinary.com/djxkexzvz/image/upload/v1631485353/default-profile-pic.jpg"
  },
},{timestamps : true});

const User = mongoose.model("User", userSchema);

export default User;