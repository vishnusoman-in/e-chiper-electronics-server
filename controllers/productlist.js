import Products from "../models/Products.js";




export const getProductlistfull = async (req, res) => {
  try {

    
    const products = await Products.find();
    if (!products) return res.status(400).json({ msg: "product does not exist. " });
    
    res.status(200).json(products);

  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};




export const deleteProduct = async (req, res) => {
  try {

    const { id } = req.params;
    await Products.findByIdAndDelete(id);
    
    const products = await Products.find();

    res.status(200).json(products);

  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};





export const getProductlistbycat = async (req, res) => {
    try {
  
      const { category } = req.params;
      const product = await Products.find({categoryname: category});
      if (!product) return res.status(400).json({ msg: "product does not exist. " });
      
      res.status(200).json(product);
  
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  };




  export const getProductlistbyname = async (req, res) => {
    try {
  
      const { name } = req.params;
      const product = await Products.find({name: {$regex: '.*.*' + name, $options: 'i'}});
      if (!product) return res.status(400).json({ msg: "product does not exist. " });

      res.status(200).json(product);
      //console.log(product)
  
    } catch (err) {
      res.status(404).json({ message: err.message });
      //console.log(err)
    }
  };




  export const getProductlistbyid = async (req, res) => { // for cart
    try {
      
      const { productId } = req.params;
      const myArray = productId.split(',');
      const products = []
      
      //console.log(myArray)
    

    for (let index = 0; index < myArray.length; index++) {
      
      const product = await Products.findById(myArray[index])
       products.push(product)
    }   
    

      

      res.status(200).json(products);
      //console.log(products)
  
    } catch (err) {
      res.status(404).json({ message: err.message });
      //console.log(err)
      
    }
  };


  