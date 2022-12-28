import express from "express";

import { getProductlistbycat, getProductlistbyid, getProductlistbyname, getProductlistfull, deleteProduct } from "../controllers/Productlist.js";
import { verifyToken } from "../middleware/jwtauth.js";
const router = express.Router();


/* READ PRODUCT WHOLE DATABASE*/  // "products/:category/productcategory"


router.get("/:productId/productids", verifyToken, getProductlistbyid); // get products by productId for cart

router.get("/:name/productname", getProductlistbyname); // get product by name for search

//.............................................................................................................

router.get("/collection", verifyToken, getProductlistfull); // get full products

router.delete("/:id/deleteit", verifyToken, deleteProduct)

router.get("/:category/productcategory", getProductlistbycat); // get product by category no need to verify token , it need to show even without login




export default router;

