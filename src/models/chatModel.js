import mongoose from "mongoose"

const chatSchema = new mongoose.Schema({
    members: Array,
    lastTimeMessage: {
        type: Date,
        default: null,
    },
    lastText:{
        type:String,
        default:""
    },
},{
    timestamps:true,
})

const chatModel = mongoose.model("chat",chatSchema)

export default chatModel