import userModel from "../models/userModel.js";
import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { isValidObjectId } from "mongoose";
import ImageKit from "imagekit";
import { uploadImage } from "../config/uploadImage-kit.js";

//++++++++++++++++++++++++++++++++++++++++++++ user-Register +++++++++++++++++++++++++++++++++++++++++++++++++++++//

export const userRegister = async (req, res) => {
  try {
    const error = validationResult(req);

    if (!error.isEmpty()) {
      return res.status(400).json({ errors: error.array()[0].msg });
    }

    const { name, phone, email, password, city, country } = req.body;

    let phoneDuplicate = await userModel.findOne({ phone: phone });
    if (phoneDuplicate)
      return res
        .status(400)
        .json({ status: false, message: "Phone number is already exist" });

    let emailDuplicate = await userModel.findOne({ email: email });
    if (emailDuplicate)
      return res
        .status(400)
        .json({ status: false, message: "User email is already exist" });

    //encrypted password :-
    const salt = await bcrypt.genSalt(10);
    const newPassword = await bcrypt.hash(password, salt);

    const user = {
        name, phone, email, password:newPassword, city, country 
    };

    const userCreate = await userModel.create(user);

    res
      .status(201)
      .json({
        status: true,
        message: `${name} is created successfully`,
        data: userCreate,
      });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

//++++++++++++++++++++++++++++++++++++++++++  user - login ++++++++++++++++++++++++++++++++++++++++++++++++++++++++//

export const loginUser = async (req, res) => {
  try {
    const error = validationResult(req);

    if (!error.isEmpty()) {
      return res.status(400).json({ errors: error.array()[0].msg });
    }

    const { email, password } = req.body;

    const find_data = await userModel.findOne({ email: email });

    if (!find_data)
      return res
        .status(404)
        .json({ status: false, message: "email is not found" });

    //check encrypted password :-
    const passwordMatch = await bcrypt.compare(password, find_data.password);

    if (passwordMatch == false)
      return res
        .status(400)
        .json({ status: false, message: "Please enter correct password" });

    const user = await userModel.findOne({
      email: email,
      password: find_data.password,
    });

    if (!user)
      return res
        .status(400)
        .json({ status: false, message: "email or password are wrong" });

    const userToken = process.env.JWT_TOKEN;

    const token = jwt.sign(
      {
        userId: user._id.toString(),
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
};

//++++++++++++++++++++++++++++++++++++++++++++++ setProfile user +++++++++++++++++++++++++++++++++++++++++++++++++++++++//

export const updateProfile = async (req, res) => {
  try {
    const userIdFromToken = req.userId;
    if (!isValidObjectId(userIdFromToken))
      return res
        .status(400)
        .json({ status: false, message: "Token is not valid" });

    const error = validationResult(req);

    if (!error.isEmpty()) {
      return res.status(400).json({ errors: error.array()[0].msg });
    }

    const { name, phone, email, country, city } = req.body;

    let uploadObj = {
      name,
      phone,
      email,
      country,
      city,
    };

    const userUpdate = await userModel.findByIdAndUpdate(
      userIdFromToken,
      {
        $set: uploadObj,
      },
      {
        new: true,
      }
    );

    res.status(200).json({
      status: true,
      message: `${userUpdate.name} has been updated profile successfully`,
      data: userUpdate,
    });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

//++++++++++++++++++++++++++++++++++++++++++++ update Image +++++++++++++++++++++++++++++++++++++++++++++++++++++//

export const updateProfileImage = async (req, res) => {
  try {
    const userIdFromToken = req.userId;

    if (!isValidObjectId(userIdFromToken))
      return res
        .status(400)
        .json({ status: false, message: "Token is not valid" });

    const { type } = req.query;

    let file = req.file;

    // console.log("file",file);

    if (type.toLowerCase() !== "profilepicture" &&type.toLowerCase() !== "coverpicture")
      return res.status(400).json("Type is only profile and coverPicture");


    let findUser = await userModel.findOne({ _id: userIdFromToken });

    if (!file)
      return res
        .status(400)
        .json({ status: false, message: "Please Provide A File To Update..." });

    //uploadImage is a function which is imported from uploadTrialRoute.js file
    //calling this function , we get image url of the uploaded image .

    const image = await uploadImage(userIdFromToken, type, file);

    const imageURL = image.url;
    const FileId = image.fileId;

    const userImage = {
      imageURL: imageURL,
      FileId: FileId,
      active: true,
    };

    // console.log(userImage);

    if (type == "profilePicture" && file) {
      //when user first upload his/her profilePicture , then active true .
      if (findUser.profilePicture.length == 0) {
        let FirstUpdatedProfile = await userModel.findByIdAndUpdate(
          userIdFromToken,
          { $addToSet: { profilePicture: userImage } },
          { new: true }
        );

        return res.status(200).json(FirstUpdatedProfile);
      }

    //   let temp = findUser.profilePicture.map((profilePic) => {
    //     return {
    //       FileId: profilePic.FileId,
    //       active: false,
    //       _id: profilePic._id,
    //     };
    //   });

    //             console.log(temp,userImage);

    //     findUser.profilePicture.push(userImage);

    //     const updatedUser = await findUser.save();

      //when user upload his/her coverPicture 2nd time or so many time, then uploaded pic active true, remaining pic are false.
     
     
     
      findUser.profilePicture.forEach((profilePic) => {
        profilePic.active = false;
      });

      userImage.active = true;

      //we are push the latest upload Photo, which is active:true
      findUser.profilePicture.push(userImage);

      const updatedUser = await findUser.save();

      return res.status(200).json(updatedUser);
    }

    if (type == "coverPicture" && file) {
      //when user first upload his/her coverPicture , then active true .
      if (findUser.coverPicture.length == 0) {
        let FirstUpdatedCover = await userModel.findByIdAndUpdate(
          userIdFromToken,
          { $addToSet: { coverPicture: userImage } },
          { new: true }
        );

        return res.status(200).json(FirstUpdatedCover);
      }

      //when user upload his/her coverPicture 2nd time or so many time, then uploaded pic active true, remaining pic are false.
      findUser.coverPicture.forEach((profilePic) => {
        profilePic.active = false;
      });

      userImage.active = true;

      //we are push the latest upload Photo, which is active:true
      findUser.coverPicture.push(userImage);

      const updateCoverPhoto = await findUser.save();

      return res.status(200).json(updateCoverPhoto);
    }
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

//++++++++++++++++++++++++++++++++++++++++++++++ User delete Image ++++++++++++++++++++++++++++++++++++++++++++++++//

//if User is delete his / her profile :-

export const deleteImage = async(req,res) =>{
    try {
        
        const userIdFromToken = req.userId;

        if (!isValidObjectId(userIdFromToken))
          return res
            .status(400)
            .json({ status: false, message: "Token is not valid" });
     
        const { type } = req.query;

        if (type.toLowerCase() !== "profilepicture" &&type.toLowerCase() !== "coverpicture")
        return res.status(400).json("Type is only profile and coverPicture");
        
        const findUser = await userModel.findOne({_id:userIdFromToken})
      
        if(type.toLowerCase() ==  'profilepicture'){
            let activePhoto = findUser.profilePicture.filter((a) => a.active == true)
            let activephotoObj = activePhoto[0]

           const P = await userModel.findByIdAndUpdate(
            userIdFromToken,
            {$pull :{profilePicture:activephotoObj} },
            { $set : {"profilePicture.active": profilePicture[0]}},
              {
                new:true
              })

            console.log(P);

            res.send("hjkf")

        }
        
         
         







        
    } catch (error) {
        return res.status(500).json({ status: false, message: error.message });
    }
}



//++++++++++++++++++++++++++++++++++++++++++++++ get user +++++++++++++++++++++++++++++++++++++++++++++++++++++++++//

export const getProfile = async (req, res) => {
  try {
    const userIdFromToken = req.userId;
    if (!isValidObjectId(userIdFromToken))
      return res
        .status(400)
        .json({ status: false, message: "Token is not valid" });

    const userIdByParam = req.params.userId;
    if (!isValidObjectId(userIdByParam))
      return res
        .status(400)
        .json({ status: false, message: "userId By Param is not valid" });

    //authorization:-
    if (userIdByParam !== userIdFromToken) {
      res.status(403).json({ status: false, message: "unaothorize access" });
    }

    const user = await userModel.findById(userIdByParam);

    //he code uses object destructuring to extract specific properties from the user._doc object.
    // The properties being extracted are password and updatedAt.
    const { password, updatedAt, ...other } = user._doc;

    res.status(200).json({ status: true, data: other });
  } catch (err) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

//++++++++++++++++++++++++++++++++++++++++++++ delete user +++++++++++++++++++++++++++++++++++++++++++++++++++++++++//

export const deleteProfile = async (req, res) => {
  try {
    const userIdFromToken = req.userId;
    if (!isValidObjectId(userIdFromToken))
      return res
        .status(400)
        .json({ status: false, message: "Token is not valid" });

    const error = validationResult(req);

    if (!error.isEmpty()) {
      return res.status(400).json({ errors: error.array()[0].msg });
    }

    const userDelete = await userModel.findByIdAndDelete(userIdByParam);

    res
      .status(200)
      .json({
        status: true,
        message: `${userDelete.name} has been deleted successfully`,
        data: userDelete,
      });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

//+++++++++++++++++++++++++++++++++++++++++++ user-follow-another-user ++++++++++++++++++++++++++++++++++++++++++++++++++//

export const userFollow = async (req, res) => {
  try {
    const userIdFromToken = req.userId;
    if (!isValidObjectId(userIdFromToken))
      return res
        .status(400)
        .json({ status: false, message: "Token is not valid" });

    const error = validationResult(req);

    if (!error.isEmpty()) {
      return res.status(400).json({ errors: error.array()[0].msg });
    }

    //anotherUserId , whose I follow :-
    const { userId } = req.body;

    const curr_user = await userModel.findById(userIdFromToken);

    const anotherUser = await userModel.findOne({ _id: userId });

    if (anotherUser.followers.indexOf(userIdFromToken) == -1) {
      //current_user following update , the another userId will push my followings account
      await userModel.findOneAndUpdate(
        { _id: userIdFromToken },
        {
          $push: {
            followings: userId,
          },
        }
      );

      //anotherUser followers update , the his/her userId following section my  userId will push .
      await userModel.findOneAndUpdate(
        { _id: userId },
        {
          $push: {
            followers: userIdFromToken,
          },
        }
      );

      res
        .status(200)
        .json({
          status: true,
          message: `${curr_user.name} has following ${anotherUser.name}`,
        });
    } else {
      return res
        .status(400)
        .json({
          status: false,
          message: `${curr_user.name} already follow this user`,
        });
    }
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

//+++++++++++++++++++++++++++++++++++++++++++ user-unFollow-another-user ++++++++++++++++++++++++++++++++++++++++++++++++++//

export const userUnFollow = async (req, res) => {
  try {
    const userIdFromToken = req.userId;
    if (!isValidObjectId(userIdFromToken))
      return res
        .status(400)
        .json({ status: false, message: "Token is not valid" });

    const error = validationResult(req);

    if (!error.isEmpty()) {
      return res.status(400).json({ errors: error.array()[0].msg });
    }

    const { userId } = req.body;

    const curr_user = await userModel.findById(userIdFromToken);

    const anotherUser = await userModel.findOne({ _id: userId });

    // search In my-userId(curr_user) followings part his/her(anotherUser) her user Id exist or not :-
    if (curr_user.followings.indexOf(userId) == -1) {
      return res
        .status(400)
        .json({
          status: false,
          message: `${curr_user.name} do not follow this user`,
        });
    }
    //after unFollow:-

    //current_user following update
    await userModel.findOneAndUpdate(
      { _id: userIdFromToken },
      {
        $pull: {
          followings: userId,
        },
      }
    );

    //anotherUser followers update
    await userModel.findOneAndUpdate(
      { _id: userId },
      {
        $pull: {
          followers: userIdFromToken,
        },
      }
    );

    res
      .status(200)
      .json({
        status: true,
        message: `${curr_user.name} has unfollowing ${anotherUser.name}`,
      });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};
