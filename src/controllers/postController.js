import postModel from "../models/postModels.js"; 
import { isValidObjectId } from "mongoose";
import userModel from "../models/userModel.js";

//create post :-

export const createPost = async (req, res) => {
    try {
        const userIdFromToken = req.userId;
        if (!isValidObjectId(userIdFromToken)) return res.status(400).json({ status: false, message: "Token is not valid" })

        const { desc, img } = req.body;

        req.body.userId = userIdFromToken

        const createPost = await postModel.create(req.body)

        res.status(201).json({status:true,data:createPost})
        
    } catch (error) {
        return res.status(500).json({ status: false, message: error.message });
    }
} 


//getPost :-

export const getPost = async (req, res) => {
    try {
        const userIdFromToken = req.userId;
        if (!isValidObjectId(userIdFromToken)) return res.status(400).json({ status: false, message: "Token is not valid" })

        const userIdByParam = req.params.userId;
        if (!isValidObjectId(userIdByParam)) return res.status(400).json({ status: false, message: "userId is not valid" })

        const getUserPost = await postModel.findOne({ userId: userIdByParam })

        // if user search self-Post account :-
        if (userIdByParam === userIdFromToken) {      
            return res.status(200).json({status:true,data:getUserPost})
        }

        //if user search another post :-

        const getUser = await userModel.findOne({ _id: userIdByParam })

        if (getUser.setPrivate == false) {

            return res.status(200).json({ status: true, data: getUserPost })
        }

        //if setPrivate true , then I search anothr person following me or not :-

        const searchAccount = getUser.followings.indexOf(userIdFromToken)

        if (searchAccount == -1) res.status(400).json({status:false,message: "User can not see the post"})

        return res.status(200).json({ status: true, data: getUserPost })
        

    } catch (error) {
        return res.status(500).json({ status: false, message: error.message });
    }
} 

// UPDATE POST :-


export const updatePost = async (req, res) => {
    try {
        const userIdFromToken = req.userId;
        if (!isValidObjectId(userIdFromToken)) return res.status(400).json({ status: false, message: "Token is not valid" })

        const postId = req.params.postId;
        if (!isValidObjectId(postId)) return res.status(400).json({ status: false, message: "postId is not valid" })

        const findPost = await postModel.findOne({ _id:postId ,userId:userIdFromToken})

        // if user search self-Post account :-
        if (!findPost) {      
            return res.status(403).json({status:true,message:"Unauthorize access"})
        }
        
        const updatePost = await postModel.findOneAndUpdate({_id:postId},{
            $set: req.body,
        },{new:true}) 

        return res.status(200).json({ status: true, data: updatePost })
        

    } catch (error) {
        return res.status(500).json({ status: false, message: error.message });
    }
} 


//deletePost :-

export const deletePost = async (req, res) => {
    try {
        const userIdFromToken = req.userId;
        if (!isValidObjectId(userIdFromToken)) return res.status(400).json({ status: false, message: "Token is not valid" })

        const postId = req.params.postId;
        if (!isValidObjectId(postId)) return res.status(400).json({ status: false, message: "postId is not valid" })

        const findPost = await postModel.findOne({ _id:postId ,userId:userIdFromToken})

        // if user search self-Post account :-
        if (!findPost) {      
            return res.status(403).json({status:true,message:"Unauthorize access"})
        }
        
        const postDelete = await postModel.findOneAndDelete({_id:postId}) 

        return res.status(200).json({ status: true,message:`the post is successfully deleted`, data: postDelete })
        

    } catch (error) {
        return res.status(500).json({ status: false, message: error.message });
    }
} 

//like dislike post :-

export const likePost = async (req, res) => {
    try {
        const userIdFromToken = req.userId;
        if (!isValidObjectId(userIdFromToken)) return res.status(400).json({ status: false, message: "Token is not valid" })

        const postId = req.params.postId;
        if (!isValidObjectId(postId)) return res.status(400).json({ status: false, message: "postId is not valid" })

        const findPost = await postModel.findOne({ _id:postId ,userId:userIdFromToken})

        // if user search self-Post account :-
        if (!findPost) {      
            return res.status(403).json({status:true,message:"Unauthorize access"})
        }
        
        if (!findPost.likes.includes(userIdFromToken)) {
            await findPost.updateOne({ $push: { likes: userIdFromToken } });
            res.status(200).json("The post has been liked");
          } else {
            await post.updateOne({ $pull: { likes: userIdFromToken } });
            res.status(200).json("The post has been disliked");
          }

    } catch (error) {
        return res.status(500).json({ status: false, message: error.message });
    }
} 

//time-line-Post :-



export const timelinePost = async (req, res) => {
    try {
        const userIdFromToken = req.userId;
        if (!isValidObjectId(userIdFromToken)) return res.status(400).json({ status: false, message: "Token is not valid" })

         const currentUser = await userModel.findOne({_id:userIdFromToken})

        let posts = await postModel.find({userId:{$in:currentUser.followings}}).sort({createdAt:-1}).limit(1*5)
        
        res.status(200).json({status:true,data:posts})

    } catch (error) {
        return res.status(500).json({ status: false, message: error.message });
    }
} 
