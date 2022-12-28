import express from "express";

import { register } from "../controllers/signin-up.js";

const router = express.Router();

// "shop/register"

router.post("/register", register); // if received login request  call login controller

export default router;
