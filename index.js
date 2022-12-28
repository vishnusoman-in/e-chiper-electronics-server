import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer"; // node.js middleware for handling form , primarely for uploading file

import helmet from "helmet";
import morgan from "morgan";
import cloudinary from "cloudinary";
import Stripe from 'stripe';
import fs from "fs";

import Products from "./models/Products.js";
import User from "./models/User.js";
import Order from "./models/Orders.js";

import path from "path";
import { fileURLToPath } from "url";

import loginRoutes from "./routes/login.js";
import registerRoutes from "./routes/register.js";
import productRoutes from "./routes/productfetch.js";
import cartRoutes from "./routes/usercartfetch.js";
import orderRoutes from "./routes/userorderfetch.js";

import { verifyToken } from "./middleware/jwtauth.js";

/* CONFIGURATIONS */
const __filename = fileURLToPath(import.meta.url); // This grab file url when using import instead
const __dirname = path.dirname(__filename);

dotenv.config(); // to use .env files

const app = express(); // invoke express application
app.use(express.json()); 
app.use(helmet()); //security
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));// for parsing json data from client
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true })); // for parsing form (input) data from client
app.use(cors({
  origin: ["http://localhost:3000", "https://e-chiper-electronics.onrender.com" ]
}));//add values in prouction enviorment
app.use("/assets", express.static(path.join(__dirname, "public/assets"))); // local storage directory

/* FILE STORAGE */
const storage = multer.diskStorage({

  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },

  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },

}); // this is from github from multer





const upload = multer({ storage }); // 'upload' - save uploaded file to your local storage 

// cloudinary

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key:process.env.CLOUDINARY_API_KEY,
  api_secret:process.env.CLOUDINARY_API_SECRET
})

const uploads = (file,folder) => {
// new Promise
  return new Promise  ((resolve) => {

      cloudinary.uploader.upload(file, (result) => {
          resolve ({url: result.url, id: result.public_id})
         //resolve(url= result.url)
      }, {

          resource_type: "auto",
          folder: folder

      })

  })


}



/* ROUTES */
app.use("/shop", loginRoutes); //authroutes is just a name to specify the location : routes/users.j
app.use("/shop", registerRoutes);
app.use("/products", productRoutes);
app.use("/user", cartRoutes);
app.use("/orders", orderRoutes);

// route with admin upload file

app.post("/products/uploads", verifyToken, upload.single("picture"), async (req, res) => { // verifyToken,

  try {

    const { name,price, description,categoryname,picture } = req.body; 

    

  const uploader = async (path) => await uploads(path, "picture")
   const urls = []
   const files = req.file
   //for(const file of files) - for mutiple files , also change upload.array("picture")
   const {path} = files
   const newPath = await uploader(path)
   urls.push(newPath)
   fs.unlinkSync(path)

   
   //console.log(urls[0].url)


    
    

    const newProduct = new Products({ // created a new post
      name,
      price,
      description,
      categoryname,
      picture,
      picturePath: urls[0].url,
      rating: 0,
      comments: [],
    });

    await newProduct.save(); // save all updates 'Post'

    const product = await Products.find(); // grab the all Posts to send it as res
    res.status(200).json(product);


   //console.log("image uploaded")

  } catch (err) {
    res.status(409).json({ message: err.message });
  }

});// (path of route, middleware, middleware, controller) // on posts we have img  |createPost|



/* MONGOOSE SETUP */
const PORT = process.env.PORT || 6001;
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));

    
  })
  .catch((error) => console.log(`Mongodb did not connect:${error} `));



  // stripe setup server-side...........................................................

  const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY);

  const storeItems = new Map([ // products details stored on database (for easy purpose directed on server itself)
    [1, { priceInCents: 10000, name: "Learn React Today" }],
    [2, { priceInCents: 20000, name: "Learn CSS Today" }],
  ])
  
  app.post("/create-checkout-session", async (req, res) => {
    try {

      const userdetails = await User.findById(req.body.items);

      const products =  userdetails.cartitems;
      const quanty = userdetails.cartquantity;
      
      const procart = []

      for (let i = 0; i < products.length; i++) {
      
        const product = await Products.findById(products[i])
        procart.push(product)
      }   

     // console.log(procart)

      const session = await stripe.checkout.sessions.create({

        payment_method_types: ["card"],

        mode: "payment",

        shipping_options: [
          {
            shipping_rate_data: {
              type: 'fixed_amount',
              fixed_amount: {amount: 0, currency: 'inr'},
              display_name: 'Free shipping',
              delivery_estimate: {
                minimum: {unit: 'business_day', value: 5},
                maximum: {unit: 'business_day', value: 7},
              },
            },
          },
        ],
  
        line_items: procart.map(({_id,name,price,description,categoryname,picturePath,rating,comments,}, index) => {
          
         
          return {
  
            price_data: {

              currency: "inr",

              product_data: {
                name: procart[index].name,
              },

              unit_amount: procart[index].price * 100,
            },

            quantity: quanty[index], //item.quantity
            
          }

        }),

        client_reference_id : userdetails._id.valueOf(),

         // ${process.env.CLIENT_URL}
        success_url: `${process.env.SERVER_URL}/success`,
        success_url: `${process.env.SERVER_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
        //success_url: `${process.env.CLIENT_URL}/success`,
        cancel_url: `${process.env.CLIENT_URL}/cancel`,
      })
      res.json({ url: session.url })
  
    } catch (e) {
      res.status(500).json({ error: e.message })
      console.log(e.message)
    }
  })

  // if payment sucess we will process the order..................

  app.get('/success', async (req, res) => {
    const sessionreceive = await stripe.checkout.sessions.retrieve(req.query.session_id);
   // const customer = await stripe.customers.retrieve(sessionreceive.customer);
   if(sessionreceive){
    //console.log(sessionreceive.client_reference_id)
    const userdetails = await User.findById(sessionreceive.client_reference_id);
    const products =  userdetails.cartitems;
    const quanty = userdetails.cartquantity;
    //create a new order
     
    const newOrder = new Order({ // create a new data set from received data
      orderaddress: userdetails.address,
      orderprice: sessionreceive.amount_total,
      orderstatus: false,
      productlist: products,
      quantitylist:quanty,
      orderdate:new Date(),
      orderextras:[],
    
      
    });

    const savedOrder = await newOrder.save();
   
   // console.log(savedOrder._id.valueOf())

    //delete cart items from user
    userdetails.cartitems = [];
    userdetails.cartquantity = [];
    userdetails.orders.push(savedOrder._id.valueOf())
    await userdetails.save();

   }

    res.send(
      `<html>
      <body>
      <h1>
      Payment Done! Thanks for your order, ${sessionreceive.customer_details.name}
      <a href=${process.env.CLIENT_URL}>Go to Chiper electronics to view order</a>
      </h1>
      </body>
      </html>`
    
      );
    
  });


  