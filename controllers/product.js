const Product = require('../models/products')

const getAllProductsStatic = async (req,res)=>{
    const products = await Product.find({}).sort('name').select('name price').limit(5).skip(3)
    res.status(200).json({products,nbhits:products.length})
}

const getAllProducts = async (req,res)=>{
    console.log(req.query)

    const {featured,company,name,sort,fields,numericFilters} = req.query
    const queryObject = {}

    if(numericFilters){
        const operatorMap = {
            '>': '$gt',
            '>=': '$gte',
            '=': '$eq',
            '<': '$lt',
            '<=': '$lte',
        }
        const regEX = /\b(<|>|>=|=|<|<=)\b/g
        let filters = numericFilters.replace(regEX,(match)=>`-${operatorMap[match]}-`)
        const options = ['price','rating']
        filters = filters.split(',').forEach((item) => {
            const [field,operator,value]=item.split('-')
            if(options.includes(field)){
                queryObject[field] = {[operator]:Number(value)}
            }            
        });
    }

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

//Sort

    if(sort){
        const sortList = sort.split(',').join(' ')
        result = result.sort(sortList)
    }else{
        result = result.sort('createAt')
    }

//Select

    if(fields){
        const fieldsList = fields.split(',').join(' ')
        result = result.select(fieldsList)
    }

    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const skip = (page-1)*limit

    result = result.skip(skip).limit(limit)

    const products = await result
    res.status(200).json({products,nbhits:products.length})
}

module.exports = {getAllProducts,getAllProductsStatic}