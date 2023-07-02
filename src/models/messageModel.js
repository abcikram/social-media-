import mongoose from "mongoose"
const ObjectId = mongoose.Types.ObjectId

const messageSchema = new mongoose.Schema({
    chatId: {
        type: ObjectId,
        ref: "chat",
        required:true,
    },
    senderId: {
        type: ObjectId,
        ref: "user",
        required: true,
    }, 
    text:String,
},{
    timestamps:true
})

const messageModel = mongoose.model("message",messageSchema)

export default messageModel