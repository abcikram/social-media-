import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId


const commentSchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'post',
      required: true,
    },
    userId: {
      type: ObjectId,
      ref: 'user',
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  }, {
    timestamps:true,
  }
);

const  commentModel = mongoose.model('comment', commentSchema);

export default commentModel
