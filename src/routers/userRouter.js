import express from "express";
import { body } from "express-validator";
const router = express.Router();
import { deleteProfile, loginUser, updateProfile, userRegister,userFollow, userUnFollow, getProfile } from "../controllers/userController.js";
import { user_authentication } from "../middleware/auth.js";
import { registerUserValidator , updateUserValidator} from "../middleware/userValidators.js";

//user register :-
router.post("/register",registerUserValidator,userRegister);

// user Login :-
router.post(
  "/login",
  [
    body("email")
      .notEmpty()
      .withMessage("email is required")
      .isEmail()
      .withMessage("email is not valid"),
    body("password")
      .notEmpty()
      .withMessage("password is required")
      .isStrongPassword()
      .withMessage(
        "Length of the password must be between 8 to 15 characters , at least use one Uppercase and one unique characters"
      ),
  ],
  loginUser
);



router.get('/get/:userId',user_authentication,getProfile)

//user update profile :-
router.put("/update/:userId",user_authentication,updateUserValidator,updateProfile);


//user delete profile :-
router.delete("/delete/:userId",user_authentication,deleteProfile);

//user follow another user :-
router.put('/:userId/follow',user_authentication,[
    body('userId').notEmpty().withMessage("userId is required")
        .isMongoId().withMessage('useId is not valid')
],userFollow)

//user unFollow another user :-
router.put('/:userId/unfollow',user_authentication,[
    body('userId').notEmpty().withMessage("userId is required")
        .isMongoId().withMessage('useId is not valid')],userUnFollow)


export default router;
