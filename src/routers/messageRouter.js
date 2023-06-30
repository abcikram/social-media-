import express from "express";
import { body, param } from "express-validator";
import { createMessage, getMessage } from "../controllers/messsageController.js";
const router = express.Router();


//create message :-
router.post('/create',createMessage)


//get message :-
router.get('/get/:chatId',getMessage)













export default router