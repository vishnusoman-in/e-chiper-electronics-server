import Orders from "../models/Orders.js";

export const getOrderlistbyid = async (req, res) => { // for cart
    try {
      
      const { orderId } = req.params;
      const myArray = orderId.split(',');
      const orders = []
      
      
    

    for (let index = 0; index < myArray.length; index++) {
      
      const order = await Orders.findById(myArray[index])
      orders.push(order)
    }   
    

      

      res.status(200).json(orders);
     // console.log(orders)
  
    } catch (err) {
      res.status(404).json({ message: err.message });
     // console.log(err)
      
    }
  };