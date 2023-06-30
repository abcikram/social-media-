import { validationResult } from "express-validator";
import commentModel from "../models/commentModel.js";
import { isValidObjectId } from "mongoose";


//add comments on post :-
export const addComments = async(req,res) =>{
    try {

        const userIdFromToken = req.userId;
        console.log(userIdFromToken);

        if(!isValidObjectId(userIdFromToken)) return res.status(400).json({status:false,
            message:"Token is not valid"})

        const error = validationResult(req);

        if (!error.isEmpty()) {
            return res.status(400).json({ errors: error.array()[0].msg });
        }

        const {postId, content} = req.body;

        req.body.userId = userIdFromToken

        const addComment = await commentModel.create(req.body);
         
        res.status(201).json({status:true,message:"comment is added on the post", data:addComment})

    } catch (error) {
        return res.status(500).json({ status: false, message: error.message });
    }
}

// GetComments on post :-

export const getComments = async(req,res) =>{
    try {
        const error = validationResult(req);

        if (!error.isEmpty()) {
            return res.status(400).json({ errors: error.array()[0].msg });
        }

        const {postId} = req.params;

        const getComment = await commentModel.find({postId:postId});
         
        res.status(200).json({status:true,data:getComment})

    } catch (error) {
        return res.status(500).json({ status: false, message: error.message });
    }
}

//update Comments :-

export const updateComments = async(req,res) =>{
    try {

        const userIdFromToken = req.userId

        const error = validationResult(req);

        if (!error.isEmpty()) {
            return res.status(400).json({ errors: error.array()[0].msg });
        }

        const {commentId} = req.params;
        const {content} = req.body

        const getComment = await commentModel.findOne({_id:commentId, userId:userIdFromToken});
         
        if(!getComment) return res.status(403).json({status:false,message:"Unauthorize access"})
        
        const updateComment = await commentModel.findOneAndUpdate({userId:userIdFromToken,_id:commentId},{
            $set: req.body
        },{new:true}) 

        res.status(200).json({status:true,message:"userComment has been updated",data:updateComment})

    } catch (error) {
        return res.status(500).json({ status: false, message: error.message });
    }
}

//delete Comments :-

export const deleteComments = async(req,res) =>{
    try {

        const userIdFromToken = req.userId

        const error = validationResult(req);

        if (!error.isEmpty()) {
            return res.status(400).json({ errors: error.array()[0].msg });
        }

        const {commentId} = req.params;
      

        const getComment = await commentModel.findOne({_id:commentId, userId:userIdFromToken});
         
        if(!getComment) return res.status(403).json({status:false,message:"Unauthorize access"})
        
        const deleteComment = await commentModel.findOneAndDelete({userId:userIdFromToken,_id:commentId}) 

        res.status(200).json({status:true,message:"userComment has been deleted"})

    } catch (error) {
        return res.status(500).json({ status: false, message: error.message });
    }
}

//reply the comments :-
export const replyComments = async(req,res) =>{
    try {

        const userIdFromToken = req.userId;

        if(!isValidObjectId(userIdFromToken)) return res.status(400).json({status:false,
            message:"Token is not valid"})

        const error = validationResult(req);

        if (!error.isEmpty()) {
            return res.status(400).json({ errors: error.array()[0].msg });
        }

        const {postId, content} = req.body;

        req.body.userId = userIdFromToken

        const addComment = await commentModel.create(req.body);
         
        res.status(201).json({status:true,message:"comment is added on the post", data:addComment})

    } catch (error) {
        return res.status(500).json({ status: false, message: error.message });
    }
}