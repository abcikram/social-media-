import { validationResult } from "express-validator";
import chatModel from "../models/chatModel.js";
import { isValidObjectId } from "mongoose";
import messageModel from "../models/messageModel.js";


//fetch user's all chat :-
export const fetchUserChat = async(req,res) =>{
    try {
        
        const userId = req.userId;

        const error = validationResult(req);

        if (!error.isEmpty()) {
            return res.status(400).json({ errors: error.array()[0].msg });
        }
   
        if (!isValidObjectId(userId)) return res.status(400).json({ status: false, message: "userId Token is not valid" })
    
        //if the ID exists in any of the members then let's return at
        const chats = await chatModel.find({
            members:{$in:[userId]}
        }).sort({lastTimeMessage:-1})
        
        res.status(201).json(chats)
    } catch (error) {
        return res.status(500).json({ status: false, message: error.message });
    }
}


//findChat :-
export const findChat = async(req,res) => {
    try{
        const userIdFromToken = req.userId;

        const error = validationResult(req);

        if (!error.isEmpty()) {
            return res.status(400).json({ errors: error.array()[0].msg });
        }
   
    // extracts firstId and secondId  from params    
    const {firstId,secondId} = req.params

    if(firstId != userIdFromToken) return res.status(403).json("Put right userId, firstI should be userIdFromToken")
    
    //In members Array we find contain firstId and secondId
    const chat = await chatModel.findOne({
        members:{$all :[firstId,secondId]}
    })

    const message = await messageModel.find({chatId :chat._id}).sort({createdAt:1})
        
    if(!message) return res.status(404).json({status:false,message:"message is not found"})
    
    res.status(200).json(message)

}catch(error){
    console.log(error)
    res.status(500).json(error)
  }
}

