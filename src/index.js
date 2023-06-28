import express from "express";
import dotenv from "dotenv";
import Colors from 'colors';
import multer from 'multer'
import connectDB from "../mongoDB/db.js";
import userRouter from './routers/userRouter.js'


const app = express();

dotenv.config();

connectDB();

app.use(express.json());
app.use(multer().any());

//global middleware :-
app.use('/api/user',userRouter)



const PORT =  process.env.PORT || 8000;

app.listen(PORT,() =>{
    console.log(`Server running on port ${PORT}`.yellow.bold)
})

