import express from "express";

import { getCart, addCart,removeCart  } from "../controllers/usercart.js";
import { verifyToken } from "../middleware/jwtauth.js";
const router = express.Router();


/* READ CART DATA OF USER*/ //  "user/:userId/getting"

router.get("/:userId/getting", verifyToken, getCart); // get details of a user

/* UPDATE CART*/
router.post("/:userId/:productId/add", verifyToken, addCart); // update cartitems of a user

router.post("/:userId/:productId/remove", verifyToken, removeCart); // update cartitems of a user

export default router;