import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    setPrivate:{
      type:Boolean,
      default:false,
    },
    profilePicture: {
      type: [
        {
          ImageURL: String,
          FileId: String,
          active: {
            type:Boolean,
            default:true,
          },
        }
      ],
      default: []
    },
    coverPicture:{
      type: [
        {
          ImageURL: String,
          FileId: String,
          active: {
            type:Boolean,
            default:true,
          },
        }
      ],
      default: []
    },
    followers:{
      type: Array,
      default: [],
    },
    followings: {
      type: Array,
      default: [],
    },
    desc: {
      type: String,
      max: 50
    },
    country:{
        type:String,
    },
    city: {
      type: String,
      max: 50,
    },
  },
  {
    timestamps: true,
  }
);


const userModel = mongoose.model('user',userSchema);

export default userModel