import express from "express";
import { body, param } from "express-validator";
import { createMessage, getMessage } from "../controllers/messsageController.js";
const router = express.Router();


//create message :-
router.post('/create',
    [
        body('chatId').notEmpty().withMessage('ChatId is required')
            .isMongoId().withMessage('chatId is not valid'),
        body('senderId').notEmpty().withMessage('senderId is required')
            .isMongoId().withMessage('senderId is not valid'),
], createMessage)


//get message :-
router.get('/get/:chatId', [
    param('chatId').isMongoId().withMessage('chatId is not valid'),
]
, getMessage)



export default router