import express from "express";
import dotenv from "dotenv";
import Colors from 'colors';
// import multer from 'multer'
import connectDB from "../mongoDB/db.js";
import userRouter from './routers/userRouter.js';
import postRouter from './routers/postRouter.js';
import commentRouter from './routers/commentRouter.js';
import replyRouter from './routers/replyRouter.js'
import chatRouter from './routers/chatRouter.js'
import messageRouter from './routers/messageRouter.js'




const app = express();

dotenv.config();

connectDB();

app.use(express.json());
// app.use(multer().any());

//global middleware :-
app.use('/api/user', userRouter)
app.use('/api/post', postRouter)
app.use('/api/comment',commentRouter)
app.use('/api/reply',replyRouter)
app.use('/api/chat',chatRouter)
app.use('/api/message',messageRouter)


const PORT =  process.env.PORT || 8002;

app.listen(PORT,() =>{
    console.log(`Server running on port ${PORT}`.yellow.bold)
})

