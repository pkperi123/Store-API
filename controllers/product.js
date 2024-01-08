const Product = require('../models/products')

const getAllProductsStatic = async (req,res)=>{
    const search = 'a'
    const products = await Product.find({}).sort('-name price')
    res.status(200).json({products,nbhits:products.length})
}

const getAllProducts = async (req,res)=>{
    console.log(req.query)
    const {featured,company,name,sort} = req.query
    const queryObject = {}
    if(featured){
        queryObject.featured = featured === 'true'? true:false
    }
    if(company){
        queryObject.company = company
    }
    if(name){
        queryObject.name = {$regex: name, $options: 'i'}
    }
    let result = Product.find(queryObject)
    if(sort){
        const sortList = sort.split(',').join(' ')
        result = result.sort(sortList)
    }else{
        result = result.sort('createAt')
    }
    const products = await result
    res.status(200).json({products,nbhits:products.length})
}

module.exports = {getAllProducts,getAllProductsStatic}