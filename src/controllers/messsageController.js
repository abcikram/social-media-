import { validationResult } from "express-validator";
import messageModel from "../models/messageModel.js";

//createMessage :-

export const createMessage = async(req,res) =>{
    try {
        const error = validationResult(req);

        if (!error.isEmpty()) {
            return res.status(400).json({ errors: error.array()[0].msg });
        }
        const {chatId,senderId,text} = req.body

        const haha ={
            chatId:chatId,
            senderId:senderId,
            text:text
        }

        const createMessage = await messageModel.create( haha) 
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
        
        const message = await messageModel.find({chatId})
        
        res.status(200).json(message)
    } catch (error) {
        return res.status(500).json({ status: false, message: error.message });
    }
}