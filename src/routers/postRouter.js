import express from "express";
import { body } from "express-validator";
const router = express.Router();

import { createPost, getPost, likePost, timelinePost, updatePost } from "../controllers/postController.js";
import { user_authentication } from "../middleware/auth.js";


//create-Post :-
router.post('/create',user_authentication, [
    body('desc').optional().isString('desc is in string'),
    body('img').optional().isString('image is in string')
], createPost)


//get-post :-
router.get('/get/:userId',user_authentication,getPost)

//update-post :-
router.put('/update/:postId',user_authentication,updatePost)

//delete-post :-
router.put('/delete/:postId',user_authentication,updatePost)

//like dislike post :-
router.put('/:postId/like',user_authentication,likePost)

//timelinePost :-
router.get('/timeline/all',user_authentication,timelinePost)




export default router