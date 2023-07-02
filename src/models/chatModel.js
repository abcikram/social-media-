import mongoose from "mongoose"

const chatSchema = new mongoose.Schema({
    members: Array,
    lastMessage: {
        type: Date,
        default: null,
    }
},{
    timestamps:true,
})

const chatModel = mongoose.model("chat",chatSchema)

export default chatModel