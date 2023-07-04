import userModel from "../models/userModel.js";
import { validationResult } from "express-validator";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { isValidObjectId } from "mongoose";
import ImageKit from "imagekit";
import { uploadImage } from "../config/uploadImage-kit.js";



//++++++++++++++++++++++++++++++++++++++++++++ user-Register +++++++++++++++++++++++++++++++++++++++++++++++++++++//

export const userRegister = async(req,res) =>{
    try {
        const error = validationResult(req);

        if (!error.isEmpty()) {
            return res.status(400).json({ errors: error.array()[0].msg });
        }

        const { name , phone , email, password , city , country } = req.body

        let phoneDuplicate = await userModel.findOne({phone:phone})
        if (phoneDuplicate) return res.status(400).json({ status: false, message: "Phone number is already exist" })
        
        let emailDuplicate = await userModel.findOne({ email: email })
        if (emailDuplicate) return res.status(400).json({ status: false, message: "User email is already exist" })

        //encrypted password :-
        const salt = await bcrypt.genSalt(10);
        const newPassword = await bcrypt.hash(password, salt);
      
        const user = {
            name: name,
            phone: phone,
            email: email,
            password: newPassword,
        }

        if(city)  user.city = city;

        if(country) user.country = country; 
       
        const userCreate = await userModel.create(user);

        res.status(201).json({ status: true, message:`${name} is created successfully`, data: userCreate })

    } catch (error) {
        return res.status(500).json({ status: false, message: error.message });
    }
}


//++++++++++++++++++++++++++++++++++++++++++  user - login ++++++++++++++++++++++++++++++++++++++++++++++++++++++++//


export const loginUser = async(req,res) =>{
    try {
        
        const error = validationResult(req);

        if (!error.isEmpty()) {
            return res.status(400).json({ errors: error.array()[0].msg });
        }

       const {email, password} = req.body
        
        const find_data = await userModel.findOne({email:email})

        if(!find_data) return res.status(404).json({status:false,message:"email is not found"});
        

        //check encrypted password :-
        const passwordMatch = await bcrypt.compare(password, find_data.password)

        if (passwordMatch == false)
            return res.status(400).json({ status: false, message: "Please enter correct password" });

        const user = await userModel.findOne({
            email: email,
            password: find_data.password,
        });

        if (!user)
            return res.status(400).json({ status: false, message: "email or password are wrong" });

        const userToken = process.env.JWT_TOKEN

        const token = jwt.sign(
            {
                userId: user._id.toString()
            },
            userToken
        );

        res.status(200).json({
            status: true,
            message: `${user.name} Login Successfully`,
            userId: user._id,
            token: token,
        });


    } catch (error) {
        return res.status(500).json({ status: false, message: error.message });
    }
}


//++++++++++++++++++++++++++++++++++++++++++++++ setProfile user +++++++++++++++++++++++++++++++++++++++++++++++++++++++//

export const updateProfile = async (req, res) => {
    try {

        const userIdFromToken = req.userId;
        if(!isValidObjectId(userIdFromToken)) return res.status(400).json({status:false,message:"Token is not valid"})

        const error = validationResult(req);

        if (!error.isEmpty()) {
            return res.status(400).json({ errors: error.array()[0].msg });
        }
        
        const {name,phone,email,country,city} = req.body;
         
        let uploadObj = {};

        if (name) uploadObj.name = name;
        if (phone) uploadObj.phone = phone
        if (email) uploadObj.email = email
        if (country) uploadObj.country = country
        if (city) uploadObj.city = city
        
        const userUpdate = await userModel.findByIdAndUpdate(userIdFromToken, {
            $set:uploadObj
        }, {
            new: true
        });

        res.status(200).json({
            status: true,
            message: `${userUpdate.name} has been updated profile successfully`,
            data: userUpdate
        })

    } catch (error) {
        return res.status(500).json({ status: false, message: error.message });
    }
}


//++++++++++++++++++++++++++++++++++++++++++++ update Image +++++++++++++++++++++++++++++++++++++++++++++++++++++//

export const updateProfileImage = async (req, res) => {
    try {

        const userIdFromToken = req.userId;

        if (!isValidObjectId(userIdFromToken))
            return res.status(400).json({ status: false, message: "Token is not valid" })

        const { type } = req.query;

        let file = req.file

        // console.log("file",file);

        if (type != ('profilePicture' || 'coverPicture'))
            return res.status(400).json("Type is only profile and coverPicture")

        let uploadObj = {};

        if (!file) return res.status(400).json({ status: false, message: 'Please Provide A File To Update...' })

        //uploadImage is a function which is imported from uploadTrialRoute.js file
        //calling this function , we get image url of the uploded image .

        const imageUrl = await uploadImage(file)

        //console.log(imageUrl);

        if (type == 'profilePicture' && file) {

            uploadObj.profilePicture = imageUrl;
        }

        if (type == 'coverPicture' && file) {
            uploadObj.coverPicture = imageUrl;
        }

        //update profile or cover Image :-
        const userUpdate = await userModel.findByIdAndUpdate("649c136a31e08666b8433b83", {
            $set: uploadObj
        }, {
            new: true
        });

        res.status(200).json({ status: true, message: `${userUpdate.name} has been updated picture`, data: userUpdate })

    } catch (error) {
        return res.status(500).json({ status: false, message: error.message });
    }
}

//++++++++++++++++++++++++++++++++++++++++++++++ get user +++++++++++++++++++++++++++++++++++++++++++++++++++++++++//

export const getProfile = async (req, res) => {
    try {
        
        const userIdFromToken = req.userId;
        if(!isValidObjectId(userIdFromToken)) return res.status(400).json({status:false,message:"Token is not valid"})

        const userIdByParam = req.params.userId;
        if(!isValidObjectId(userIdByParam)) return res.status(400).json({status:false,message:"userId By Param is not valid"})
        
        //authorization:-
       if(userIdByParam !== userIdFromToken) {
          
         res.status(403).json({ status: false, message: "unaothorize access" })
        }

        const user = await userModel.findById(userIdByParam);

        //he code uses object destructuring to extract specific properties from the user._doc object.
        // The properties being extracted are password and updatedAt.
        const { password, updatedAt, ...other } = user._doc;

        res.status(200).json({status:true,data:other});
    } catch (err) {
        return res.status(500).json({ status: false, message: error.message });
    }
  }


//++++++++++++++++++++++++++++++++++++++++++++ delete user +++++++++++++++++++++++++++++++++++++++++++++++++++++++++//

export const deleteProfile = async (req, res) => {
    try {

        const userIdFromToken = req.userId;
        if(!isValidObjectId(userIdFromToken)) return res.status(400).json({status:false,message:"Token is not valid"})

        const userIdByParam = req.params.userId;
        if(!isValidObjectId(userIdByParam)) return res.status(400).json({status:false,message:"params userId is not valid"})

        const error = validationResult(req);

        if (!error.isEmpty()) {
            return res.status(400).json({ errors: error.array()[0].msg });
        }
        
        //authorization:-
        if (userIdByParam !== userIdFromToken) {
            return res.status(403).json({ status: false, message: "Unauthorize user"})
        }

        const userDelete = await userModel.findByIdAndDelete(userIdByParam);

        res.status(200).json({ status: true, message: `${userDelete.name} has been deleted successfully`, data: userDelete })

    } catch (error) {
        return res.status(500).json({ status: false, message: error.message });
    }
}


//+++++++++++++++++++++++++++++++++++++++++++ user-follow-another-user ++++++++++++++++++++++++++++++++++++++++++++++++++//

export const userFollow = async(req,res) =>{
    try {

        const userIdFromToken = req.userId;
        if(!isValidObjectId(userIdFromToken)) return res.status(400).json({status:false,message:"Token is not valid"})
          
       
        const error = validationResult(req);

        if (!error.isEmpty()) {
            return res.status(400).json({ errors: error.array()[0].msg });
        }

         //anotherUserId , whose I follow :-
        const {userId} = req.body
        
        const curr_user = await userModel.findById(userIdFromToken);

        const anotherUser = await userModel.findOne({_id:userId });
      
        if(anotherUser.followers.indexOf(userIdFromToken) == -1)
        {
            //current_user following update , the another userId will push my followings account
            await userModel.findOneAndUpdate({_id:userIdFromToken},{
                $push:{
                   followings: userId
                }
            })

            //anotherUser followers update , the his/her userId following section my  userId will push .
            await userModel.findOneAndUpdate({_id:userId},{
                $push:{
                   followers: userIdFromToken
                }
            })
            
            res.status(200).json({ status: true,message:`${curr_user.name} has following ${anotherUser.name}`})

        }else{
            return res.status(400).json({ status: false, message: `${curr_user.name} already follow this user`})
        }

    } catch (error) {
        return res.status(500).json({ status: false, message: error.message });
    }
}

//+++++++++++++++++++++++++++++++++++++++++++ user-unFollow-another-user ++++++++++++++++++++++++++++++++++++++++++++++++++//

export const userUnFollow = async(req,res) =>{
    try {

        const userIdFromToken = req.userId;
        if(!isValidObjectId(userIdFromToken)) return res.status(400).json({status:false,message:"Token is not valid"})

        const error = validationResult(req);

        if (!error.isEmpty()) {
            return res.status(400).json({ errors: error.array()[0].msg });
        }

        const {userId} = req.body
        
        
        const curr_user = await userModel.findById(userIdFromToken);

        const anotherUser = await userModel.findOne({_id:userId });
      
      // search In my-userId(curr_user) followings part his/her(anotherUser) her user Id exist or not :-    
        if(curr_user.followings.indexOf(userId) == -1)
        {
            return res.status(400).json({ status: false, message: `${curr_user.name} do not follow this user`})
        }
        //after unFollow:-

        //current_user following update 
            await userModel.findOneAndUpdate({_id:userIdFromToken},{
                $pull:{
                   followings: userId
                }
            })

            //anotherUser followers update 
            await userModel.findOneAndUpdate({_id:userId},{
                $pull:{
                   followers: userIdFromToken
                }
            })

            res.status(200).json({ status: true,message:`${curr_user.name} has unfollowing ${anotherUser.name}`})
        
    } catch (error) {
        return res.status(500).json({ status: false, message: error.message });
    }
}