import express from "express";
import { body, param } from "express-validator";
import { user_authentication } from "../middleware/auth.js";
import {
  createReplyComments,
  getReplyComments,
  updateCommentReply,
} from "../controllers/replyController.js";
//import { updateComments } from "../controllers/commentController.js";
const router = express.Router();

//add reply on the comments
router.post(
  "/create/:commentId/replies",
  user_authentication,
  [
    param("commentId")
      .notEmpty()
      .withMessage("commentId is required")
      .isMongoId()
      .withMessage("commentId is not valid"),
    body("content")
      .notEmpty()
      .withMessage("comments is required")
      .isString()
      .withMessage("comments must be in string"),
  ],
  createReplyComments
);

//get reply of the comment :-
router.get("/get/:commentId", getReplyComments);

//update comment :-
router.put(
  "/update/:commentId/:replyId",
  user_authentication,
  [
    body("content")
      .notEmpty()
      .withMessage("comments is required")
      .isString()
      .withMessage("comments must be in string"),
  ],
  updateCommentReply
);

export default router;
