import express from "express";
import { body, param } from "express-validator";
import { createMessage, getMessage } from "../controllers/messsageController.js";
import { user_authentication } from "../middleware/auth.js";
const router = express.Router();
 

//create message :-
router.post('/create',user_authentication,
    [
        body('chatId').optional()
            .isMongoId().withMessage('chatId is not valid'),
        body('senderId').notEmpty().withMessage('senderId is required')
            .isMongoId().withMessage('senderId is not valid'),
        body('text').notEmpty().withMessage("text is required")
            .isString().withMessage('text must be in string')
], createMessage)


//get message :-
router.get('/get/:chatId',user_authentication, [
    param('chatId').isMongoId().withMessage('chatId is not valid'),
]
, getMessage)


export default router