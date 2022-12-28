import express from "express";

import { getOrderlistbyid,  } from "../controllers/orderlist.js";
import { verifyToken } from "../middleware/jwtauth.js";
const router = express.Router();


/* READ order WHOLE DATABASE*/  // 


router.get("/:orderId/orderids", verifyToken, getOrderlistbyid); // get products by productId for cart


export default router;