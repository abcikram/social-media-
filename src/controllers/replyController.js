import { isValidObjectId } from "mongoose";
import replyModel from "../models/replyModel.js";
import { validationResult } from "express-validator";

//add comments on comment :-
export const createReplyComments = async (req, res) => {
  try {
    const userIdFromToken = req.userId;
    const commentId = req.params.commentId;

    if (!isValidObjectId(userIdFromToken))
      return res
        .status(400)
        .json({ status: false, message: "Token is not valid" });
    if (!isValidObjectId(commentId))
      return res
        .status(400)
        .json({ status: false, message: "commentId is not valid" });

    const error = validationResult(req);

    if (!error.isEmpty()) {
      return res.status(400).json({ errors: error.array()[0].msg });
    }

    const { content } = req.body;

    const replyObject = {
        commentId : commentId,
        content: content,
        userId :userIdFromToken
    };

    const addCommentReply = await replyModel.create(replyObject);

    res
      .status(201)
      .json({
        status: true,
        message: "user replies this comment",
        data: addCommentReply,
      });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};


//get reply on particular comment :-

//add comments on comment :-
export const getReplyComments = async (req, res) => {
    try {
      const commentId = req.params.commentId;
  
      if (!isValidObjectId(commentId))
        return res
          .status(400)
          .json({ status: false, message: "commentId is not valid" });
  
    
      const getCommentReply = await replyModel.find({commentId}).sort({createAt :-1}).populate({path:"commentId"
     ,select:" -_id content"}).populate({path:"userId", select:"-_id name"}); 
      res
        .status(200)
        .json({
          status: true,
          data: getCommentReply,
        });
    } catch (error) {
      return res.status(500).json({ status: false, message: error.message });
    }
  };
  

//updateCommentReply :-

export const updateCommentReply = async(req,res) =>{
    try {

        const userIdFromToken = req.userId

        const error = validationResult(req);

        if (!error.isEmpty()) {
            return res.status(400).json({ errors: error.array()[0].msg });
        }

        const {commentId,replyID} = req.params;
        const {content} = req.body

        const getComment = await replyModel.findOne({commentId:commentId, userId:userIdFromToken,_id: replyID});
         
        if(!getComment) return res.status(403).json({status:false,message:"Unauthorize access"})
        
        const updateCommentReply = await commentModel.findOneAndUpdate({userId:userIdFromToken,_id:commentId},{
            $set: {content:content}
        },{new:true}) 

        res.status(200).json({status:true,data:updateCommentReply})

    } catch (error) {
        return res.status(500).json({ status: false, message: error.message });
    }
}

