import { validationResult } from "express-validator";
import chatModel from "../models/chatModel.js";
import { isValidObjectId } from "mongoose";

//createChat :-
export const createChat = async(req,res) =>{
    try {
        const error = validationResult(req);

        if (!error.isEmpty()) {
            return res.status(400).json({ errors: error.array()[0].msg });
        }
        const {firstId, secondId} = req.body;
        
        const chat = await chatModel.findOne({
        members:{$all :[firstId,secondId]}
        }) 

        if(chat) return res.status(200).json(chat)

        const newChat = new chatModel({
            members:[firstId,secondId]
        })
        const response = await newChat.save();
        res.status(201).json(response)
    } catch (error) {
        return res.status(500).json({ status: false, message: error.message });
    }
}

//findUserChat :-
export const findUserChat = async(req,res) =>{
    try {
        const error = validationResult(req);

        if (!error.isEmpty()) {
            return res.status(400).json({ errors: error.array()[0].msg });
        }
        const {userId} = req.params;
       
        if (!isValidObjectId(userId)) return res.status(400).json({ status: false, message: "userId is not valid" })
    
        //if the ID exists in any of the members then let's return at
        const chats = await chatModel.find({
            members:{$in:[userId]}
        }).sort({lastMessage:-1})
        
        res.status(201).json(chats)
    } catch (error) {
        return res.status(500).json({ status: false, message: error.message });
    }
}


//findChat :-
export const findChat = async(req,res) => {
    try{
        const error = validationResult(req);

        if (!error.isEmpty()) {
            return res.status(400).json({ errors: error.array()[0].msg });
        }
    // extracts firstId and secondId  from params    
    const {firstId,secondId} = req.params
    
    //In members Array we find contain firstId and secondId
    const chat = await chatModel.findOne({
        members:{$all :[firstId,secondId]}
    })

    res.status(200).json(chat)
}catch(error){
    console.log(error)
    res.status(500).json(error)
  }
}

