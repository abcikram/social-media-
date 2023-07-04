import express from "express";
import { param } from "express-validator";
import { user_authentication } from "../middleware/auth.js";
import { fetchUserChat, findChat } from "../controllers/chatController.js";
const router = express.Router();

//createChat :- 
// we are create Chat logic in createMessage API.  

//fetchUserChat , user's all chat:-
router.get('/get/all',user_authentication,fetchUserChat) 


//find User Particular Chat :-
router.get('/get/:firstId/:secondId',user_authentication,[
    param('firstId').notEmpty().withMessage('firstId is required')
        .isMongoId().withMessage("firstId is not valid"),
    param('secondId').notEmpty().withMessage("second Id is required")
        .isMongoId().withMessage('secondId is not valid'),
],findChat)























export default router