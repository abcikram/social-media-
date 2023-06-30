import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId;

const replySchema = new mongoose.Schema(
  {
    commentId: {
      type: ObjectId,
      ref: 'comment',
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
  },
  {
    timestamps: true,
  }
);

const replyModel = mongoose.model('reply', replySchema);

export default replyModel;
