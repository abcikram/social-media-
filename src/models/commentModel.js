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
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }
);

const Comment = mongoose.model('comment', commentSchema);

module.exports = Comment;
