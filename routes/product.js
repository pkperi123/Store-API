const express = require('express')
const router = express.Router()

const {getAllProducts,getAllProductsStatic} = require('../controllers/product')
const { get } = require('lodash')

router.route('/').get(getAllProducts)
router.route('/static').get(getAllProductsStatic)

module.exports = router