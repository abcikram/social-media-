import { body } from "express-validator";
import countries from "country-list";

//+++++++++++++++++++++++++++++++++++++++ user Update validator +++++++++++++++++++++++++++++++++++++++++++++++++++//
 
export const updateUserValidator =   [
    body("name")
      .optional()
      .isString()
      .withMessage("name should be in string"),
    body("phone")
      .optional()
      .isMobilePhone()
      .withMessage("phone number is not valid"),
    body("email")
      .optional()
      .isEmail()
      .withMessage("email is not valid"),
    body("password")
      .optional()
      .isStrongPassword()
      .withMessage(
        "Length of the password must be between 8 to 15 characters , at least use one Uppercase and one unique characters"
      ),
    body("profilePicture")
      .optional()
      .isString()
      .withMessage("user profilePicture must be in string"),
    body("coverPicture")
      .optional()
      .isString()
      .withMessage("user coverPicture must be in string"),
    body("desc")
      .optional()
      .isString()
      .withMessage("user coverPicture must be in string")
      .isLength({ min: 50 })
      .withMessage("Your field must have a minimum length of 50 characters."),

    body("country")
      .optional()
      .isString()
      .withMessage("country must be in string"),
    body("city")
      .optional()
      .trim()
      .isLength({ min: 1, max: 12 })
      .withMessage("City is required")
      .isString()
      .withMessage("City must be a string"),
  ]



  //++++++++++++++++++++++++++++++++++++++++++++ user register validator ++++++++++++++++++++++++++++++++++++++++++//
  
  export const registerUserValidator = 
  [
    body("name")
      .notEmpty()
      .withMessage("name is required")
      .isString()
      .withMessage("name should be in string"),
    body("phone")
      .notEmpty()
      .withMessage("phone is required")
      .isMobilePhone()
      .withMessage("phone number is not valid"),
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
    body("profilePicture")
      .optional()
      .isString()
      .withMessage("user profilePicture must be in string"),
    body("coverPicture")
      .optional()
      .isString()
      .withMessage("user coverPicture must be in string"),
    body("desc")
      .optional()
      .isString()
      .withMessage("user coverPicture must be in string")
      .isLength({ min: 50 })
      .withMessage("Your field must have a minimum length of 50 characters."),

    body("country")
      .optional()
      .isString()
      .withMessage("country must be in string"),
    body("city")
      .optional()
      .trim()
      .isLength({ min: 1, max: 12 })
      .withMessage("City is required")
      .isString()
      .withMessage("City must be a string"),
  ]