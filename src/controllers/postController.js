import postModel from "../models/postModels.js"; 
import { isValidObjectId } from "mongoose";
import userModel from "../models/userModel.js";
import { deleteImage, uploadImage } from "../config/uploadImage-kit.js";

//create post :-
export const createPost = async (req, res) => {
    try {
        const userIdFromToken = req.userId;
        if (!isValidObjectId(userIdFromToken)) return res.status(400).json({ status: false,
             message: "Token is not valid"
        })

        const { desc } = req.body;

        const {type} = req.query;

        // console.log(type);
        
        let file = req.file;     
              
        //we are not use create method for getting postId before save the mongoDB , so that why we use save method 
        let postObj = new postModel({
            desc:desc,
            userId:userIdFromToken
        })
        
        // console.log(postObj);

        //find the postId from the postObj before saving on mongoDB 
        const postId = postObj._id
 
        if(file){
            if(type.toLowerCase() != 'post'){
                return res.status(400).json("Type is only post")
            }
            var imageUrl = await uploadImage(userIdFromToken,type,file,postId)
        } 
        
        postObj.img.imageURL = imageUrl.url
        postObj.img.fileId = imageUrl.fileId

        //save the postObj in mongoDB
        await postObj.save();

        res.status(201).json({status:true,message:"user's post is created",data:postObj})
        
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

        //if setPrivate is false , Then another user see his/her post
        if (getUser.setPrivate == false) {

            return res.status(200).json({ status: true, data: getUserPost })
        }

        //if setPrivate true , then I search another person following me or not :-

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

        const { desc } = req.body;

        const findPost = await postModel.findOne({ _id:postId ,userId:userIdFromToken})

        // if user search self-Post account :-
        if (!findPost) {      
            return res.status(403).json({status:true,message:"Unauthorize access"})
        }
        
        // user only update the desc of the post , not image :-
        const updatePost = await postModel.findOneAndUpdate({_id:postId},{
            $set:{desc},
        },{new:true}) 

        return res.status(200).json({ status: true,message:"User update his post", data: updatePost })
        
    } catch (error) {
        return res.status(500).json({ status: false, message: error.message });
    }
} 


//DeletePost :-

export const deletePost = async (req, res) => {
    try {
        const userIdFromToken = req.userId;
        if (!isValidObjectId(userIdFromToken)) return res.status(400).json({ status: false, message: "Token is not valid" })

        const postId = req.params.postId;
        if (!isValidObjectId(postId)) return res.status(400).json({ status: false, message: "postId is not valid" })

        const findPost = await postModel.findOne({ _id:postId ,userId:userIdFromToken})

        // if user search self-Post account :-
        if (!findPost) {      
            return res.status(403).json({status:true,message:"Unauthorize access or post is not found or already deleted"})
        }
        
        //find the fileId for delete image  
        const fileId = findPost.img.fileId
        
        //calling delete Image by fileId 
        const a = await deleteImage(fileId);

        const postDelete = await postModel.findOneAndDelete({_id:postId}) 

        return res.status(200).json({ status: true,message:`use is delete this post successfully` })
        

    } catch (error) {
        return res.status(500).json({ status: false, message: error.message });
    }
} 

//Like dislike post :-

export const likePost = async (req, res) => {
    try {
        const userIdFromToken = req.userId;
        if (!isValidObjectId(userIdFromToken)) return res.status(400).json({ status: false, message: "Token is not valid" })

        const postId = req.params.postId;
        if (!isValidObjectId(postId)) return res.status(400).json({ status: false, message: "postId is not valid" })

        const findPost = await postModel.findOne({ _id:postId})

        // if user search self-Post account :-
        if (!findPost) {      
            return res.status(404).json({status:true,message:"Post is not exist or deleted"})
        }
        
        if (!findPost.likes.includes(userIdFromToken)) {
            await findPost.updateOne({ $push: { likes: userIdFromToken } });

            res.status(200).json({message:"This post has been liked"});
          } else {
            await findPost.updateOne({ $pull: { likes: userIdFromToken } });
            res.status(200).json({message:"The post has been disliked"});
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
