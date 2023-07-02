import { validationResult } from "express-validator";
import messageModel from "../models/messageModel.js";
import chatModel from "../models/chatModel.js";

//createMessage :-

export const createMessage = async(req,res) =>{
    try {
        const error = validationResult(req);

        if (!error.isEmpty()) {
            return res.status(400).json({ errors: error.array()[0].msg });
        }
        const { chatId, senderId, text } = req.body;

        const FindProperChat = await chatModel.findOne({
            _id: chatId, members: {
            $in:[senderId]
            }
        })
        
        if (!FindProperChat) return res.status(404).json({
            status: false,
            message: "This sender is not belongs to this chatId"
        })

        const message ={
            chatId:chatId,
            senderId:senderId,
            text:text
        }

        await chatModel.findByIdAndUpdate(chatId, {
            $set:{ lastMessage : Date.now()}
        });

        const createMessage = await messageModel.create(message) 
        
        res.status(201).json(createMessage)

    } catch (error) {
        return res.status(500).json({ status: false, message: error.message });
    }
}


//get through ChatId :-
export const getMessage = async(req,res) =>{
    try {
        const error = validationResult(req);

        if (!error.isEmpty()) {
            return res.status(400).json({ errors: error.array()[0].msg });
        }

        const {chatId} = req.params
        
        const message = await messageModel.find({ chatId })
        
        if(!message) return res.status(404).json({status:false,message:"message is not found"})
        
        res.status(200).json(message)
    } catch (error) {
        return res.status(500).json({ status: false, message: error.message });
    }
}