import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

/* REGISTER USER */
export const register = async (req, res) => {

  try {

    const {
      firstName,
      lastName,
      email,
      password,
      address,
      
      
    } = req.body; // we receive these variables in request

    const usercheck = await User.findOne({ email: email });
    if (usercheck) return res.status(400).json({ msg: "Email already exist. " });
    

    const salt = await bcrypt.genSalt(); // salt password using bcrypt
    const passwordHash = await bcrypt.hash(password, salt); // hash password using bcrpt

    const newUser = new User({ // create a new data set from received data
      firstName,
      lastName,
      email,
      password: passwordHash,
      address,
      cartitems:[],
      cartquantity:[],
      orders:[],
      extras:[],
      
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);

  } catch (err) {
    res.status(500).json({ error: err.message });
   // console.log(`error: ${err.message}`)
  }

};


/* LOGGING IN */
export const login = async (req, res) => {

  try {

    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) return res.status(400).json({ msg: "User does not exist. " }); // check if user is there

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials. " }); // check if hash password is found 

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET); //sign jwt , process.env.JWT_SECRET is a secert string we add
    delete user.password; // delete the password from user input
    res.status(200).json({ token, user }); // send back the jwt token with user data as json back to client

  } catch (err) {
    res.status(500).json({ error: err.message });
    //console.log(err.message)
  }

};
