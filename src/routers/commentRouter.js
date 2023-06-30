import express from "express";
import { body, param } from "express-validator";
import { addComments, deleteComments, getComments, updateComments } from "../controllers/commentController.js";
import { user_authentication } from "../middleware/auth.js";
const router = express.Router();


//add comments on post :-

router.post('/add',user_authentication,[
    body('postId').notEmpty().withMessage('postId is required')
        .isMongoId().withMessage("post Id is not valid"),
    body('userId').optional()
        .isMongoId().withMessage('userId is not valid'),
    body('content').notEmpty().withMessage('comments is required')
         .isString().withMessage("comments must be in string")
],addComments)

//get-comments on post :-

router.get('/get/post/:postId/comments',[
    param('postId').notEmpty().withMessage('postId is required')
        .isMongoId().withMessage("post Id is not valid"),
],getComments)

// update the comments by user :-

router.put('/update/:commentId/comments',user_authentication,[
    param('commentId').notEmpty().withMessage('commentId is required')
    .isMongoId().withMessage("commentId is not valid"),
    body('content').notEmpty().withMessage('comments is required')
    .isString().withMessage("comments must be in string")
],updateComments)


// delete the comments by user :-

router.delete('/delete/:commentId/comments',user_authentication,[
    param('commentId').notEmpty().withMessage('commentId is required')
    .isMongoId().withMessage("commentId is not valid"),
],deleteComments)



export default router