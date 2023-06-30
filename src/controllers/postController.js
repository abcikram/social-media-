import postModel from "../models/postModels.js"; 
import { isValidObjectId } from "mongoose";
import userModel from "../models/userModel.js";

//create post :-

export const createPost = async (req, res) => {
    try {
        const userIdFromToken = req.userId;
        if (!isValidObjectId(userIdFromToken)) return res.status(400).json({ status: false, message: "Token is not valid" })

        const { desc, userId, img } = req.body;

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

        if (searchAccount == -1) res.status(400).json({status:false,message: "User can not see the post" })

        return res.status(200).json({ status: true, data: getUserPost })
        

    } catch (error) {
        return res.status(500).json({ status: false, message: error.message });
    }
} 