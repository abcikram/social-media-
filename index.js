import express from "express";
import dotenv from "dotenv";
import Colors from 'colors';
// import multer from 'multer'
import connectDB from "./mongoDB/db.js";
import userRouter from './src/routers/userRouter.js';
import postRouter from './src/routers/postRouter.js';
import commentRouter from './src/routers/commentRouter.js';
import replyRouter from './src/routers/replyRouter.js'
import chatRouter from './src/routers/chatRouter.js'
import messageRouter from './src/routers/messageRouter.js'




const app = express();

dotenv.config();

connectDB();

app.use(express.json());
// app.use(multer().any());

//global middleware :-
app.get('/',(req,res) =>{
    res.send("hello")
})
app.use('/api/user', userRouter)
app.use('/api/post', postRouter)
app.use('/api/comment',commentRouter)
app.use('/api/reply',replyRouter)
app.use('/api/chat',chatRouter)
app.use('/api/message',messageRouter)


const PORT =  process.env.PORT || 8000;

app.listen(PORT,() =>{
    console.log(`Server running on port ${PORT}`.yellow.bold)
})

