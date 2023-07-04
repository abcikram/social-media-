import { validationResult } from "express-validator";
import messageModel from "../models/messageModel.js";
import chatModel from "../models/chatModel.js";
import { isValidObjectId } from "mongoose";


//sendMessage/created Message :-

export const createMessage = async(req,res) =>{
    try {
        const userIdFromToken = req.userId;

        if(!isValidObjectId(userIdFromToken)) return res.status(400).json("token is not valid")

        const error = validationResult(req);

        if (!error.isEmpty()) {
            return res.status(400).json({ errors: error.array()[0].msg });
        }

        const { chatId, senderId, text } = req.body;

        const FindChat =  await chatModel.findOne({
            members:{$all :[userIdFromToken,senderId]}
        })
        
        console.log(FindChat);

        let messageObj={}
        //if findChat is not exist , Then create Chat :-
        if(!FindChat){

          //if findChat is not exist , Then create Chat :-
            
          const newChat = new chatModel({
                members:[userIdFromToken,senderId],
                lastTimeMessage:Date.now(),
                lastText:text,
            })
            const createChat = await newChat.save(); //chat is created in chatSchema
            
            // in create messageObj where chatId we put latest created chatId  
            messageObj ={
                chatId:createChat._id,
                senderId:senderId,
                text:text
            }
        }
        else{
            // if chatId is already exist then update lastTimeMessage , lastText chat in chatSchema . 
            await chatModel.findByIdAndUpdate(chatId, {
                $set:{ lastTimeMessage : Date.now() , lastText : text}
            });
            messageObj={
                chatId:FindChat._id,
                senderId:senderId,
                text:text
            }
        }
         
        // Created the chat , when ever chatId found or not .
        const createMessage = await messageModel.create(messageObj) 

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