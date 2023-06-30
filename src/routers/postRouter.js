import express from "express";
import { body } from "express-validator";
const router = express.Router();

import { createPost, getPost } from "../controllers/postController.js";


//create-Post :-
router.post('/create', [
    body('desc').optional().isString('desc is in string'),
    body('img').optional().isString('image is in string')
], createPost)


//get-post :-
router.get('/get/:userId', getPost)

//update-post :-
router.put('/update/:userId',)












export default router