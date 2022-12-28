import mongoose from "mongoose";

const ProductSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price:{
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
   
    categoryname: { 
      type: String,
      required: true,
    },
    picture: String,
    picturePath: {
      type: String,
      required: true,
    },
    rating:{
      type: Number,
      default: "",
    },
    comments: {
      type: Array,
      default: [],
    },
    

  },
  { timestamps: true }
);

const Products = mongoose.model("Products", ProductSchema);

export default Products;
