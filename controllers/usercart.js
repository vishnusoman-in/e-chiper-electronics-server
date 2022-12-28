import User from "../models/User.js";

var a= true;


export const getCart = async (req, res) => {
    try {
  
      const { userId } = req.params;
      const user = await User.findById(userId);
      if (!user) return res.status(400).json({ msg: "User does not exist. " });
      res.status(200).json(user);
  
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  };





  export const addCart = async (req, res) => {
    try {
      const { userId, productId } = req.params;
      const user = await User.findById(userId); 
      if (!user) return res.status(400).json({ msg: "User does not exist. " });

      if(user.cartitems.includes(productId))
      {
        user.cartquantity[user.cartitems.indexOf(productId)] = user.cartquantity[user.cartitems.indexOf(productId)] + 1;
      }
      else{
        user.cartitems.push(productId); 
        user.cartquantity.push(1,); 
      }
   
    

      await user.save();

     // console.log(user)
  
      res.status(200).json(user);

    } catch (err) {
      res.status(404).json({ message: err.message });
      //console.log(err.message)
    }
  };




  export const removeCart = async (req, res) => {
    try {
      const { userId, productId } = req.params;
      const user = await User.findById(userId); 
      if (!user) return res.status(400).json({ msg: "User does not exist. " });

   
     if (user.cartitems.includes(productId)){

     user.cartitems = user.cartitems.filter(function(element, index) {
      
        if(element !== productId){ // logic to filter only first occuence of productid
          
          return true;
        }
        if(element == productId){ //a == true
           
          if(user.cartquantity[index] == 1 ){
            user.cartquantity.splice(index, 1);
            return false;
          }
          if(user.cartquantity[index] > 1 ){
            user.cartquantity[index] = (user.cartquantity[index]-1)
            return true;
          }
          
          
        }
       
         
      });

    }
      a=true;
      await user.save();
      //console.log(user)
      res.status(200).json(user);
      
      
    } catch (err) {
      res.status(404).json({ message: err.message });
      //console.log(err)
    }
  };