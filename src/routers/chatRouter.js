import express from "express";
import { body, param } from "express-validator";
import { user_authentication } from "../middleware/auth.js";
import { createChat, findChat, findUserChat } from "../controllers/chatController.js";
const router = express.Router();

//createChat :- 
router.post('/create',[
    body('firstId').notEmpty().withMessage('firstId is required')
        .isMongoId().withMessage("firstId is not valid"),
    body('secondId').notEmpty().withMessage("second Id is required")
        .isMongoId().withMessage('secondId is not valid'),
],createChat)

//findUserChat :-
router.get('get/:userId',[
    param('userId').notEmpty().withMessage('userId is required')
    .isMongoId().withMessage("userId is not valid"),
],findUserChat)


//findChat :-
router.get('get/:firstId/:secondId',[
    param('firstId').notEmpty().withMessage('firstId is required')
        .isMongoId().withMessage("firstId is not valid"),
    param('secondId').notEmpty().withMessage("second Id is required")
        .isMongoId().withMessage('secondId is not valid'),
],findChat)























export default router