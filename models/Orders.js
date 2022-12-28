import mongoose from "mongoose";

const OrderSchema = mongoose.Schema(
  {
    orderaddress: {
      type: String,
      required: true,
    },
    orderprice:{
      type: Number,
      required: true,
    },
    orderstatus: { 
      type: Boolean,
      required: true,
    },
    productlist: {
      type: Array,
      default: [],
    },
    quantitylist: {
      type: Array,
      default: [],
    },
    orderdate : {
       type: Date, 
       required: true, 
       default: Date.now 
    },
    orderextras: {
      type: Array,
      default: [],
    },
    

  },
  { timestamps: true }
);

const Orders = mongoose.model("Orders", OrderSchema);

export default Orders;
