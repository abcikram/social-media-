import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId;

const postSchema = new mongoose.Schema(
    {
        userId: {
          type: ObjectId,
          ref:'user',
          required: true,
        },
        desc: {
          type: String,
          max: 500,
        },
        img: {
          imageURL: String,
          fileId : String,
        },
        likes: {
          type: Array,
          default: [],
          required:true,
        },
      },
      { timestamps: true }
    );


const postModel = mongoose.model('post',postSchema);

export default postModel