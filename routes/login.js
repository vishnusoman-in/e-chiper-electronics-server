import express from "express";
import { login } from "../controllers/signin-up.js";


const router = express.Router();

// "shop/login"

router.post("/login", login); // if received login request  call login controller

export default router;
