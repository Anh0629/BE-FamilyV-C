const express = require('express')
const router = express.Router()
const { product } = require('../modes/product')
const { Category } = require('../modes/category') 

//http://localhost:4000/api/products
// req: request res: response
router.get(`/`, async (req, res) => {
    const productList = await product.find().populate('category')
    if (!productList) {
        res.status(500).json({ success: false })
    }
    res.send(productList)
});


router.get(`/:id`, async (req, res) =>{
    const Product = await product.findById(req.params.id).populate('category')

    if (!Product) {
        return res.status(500).json({ success: false })
    }

    res.send(Product)
})

router.get(`/category/:id`, async(req,res)=>{
    const Pd = await Category.findById(req.params.id)
    console.log(Pd)
    const a = await product.findById()
    if( a == Pd)
    {
        return res.send(list);
    }
   
     
     
});

router.post(`/`, async (req, res) => {
    try {
        const category= await Category.findById(req.body.category);

        if (!category) {
            return res.json({ status: false, message: 'Category khong hop le' });
        } else {
            const Product = new product({
                name: req.body.name,
                description: req.body.description,
                image: req.body.image,
                price: req.body.price,
                category: req.body.category,
                countInStock: req.body.countInStock,
            });
            
            Product.save().then(() => {
                return res.json({ status: true, message: 'Dang san pham thanh cong' });
            }).catch((err) => {
                return res.json({ status: false, message: err.message });
            });
        }
    } catch (err) {
        return res.json({ status: false, message: err.message });
    }
})

router.put('/:id', async(req, res)=>{
    const Product= await product.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            description: req.body.description,
            image: req.body.image,
            price: req.body.price,
            category: req.body.category,
            countInStock: req.body.countInStock,
        }
    )
    if (!Product)
    return res.status(400).send('Kh??ng th??? s???a s???n ph???m');
    res.send(Product);
})


router.delete('/:id', (req, res) => {
    product.findByIdAndRemove(req.params.id)
        .then((Product) => {
            if (product) {
                return res
                    .status(200)
                    .json({ success: true, message: 's???n ph???m ???? ???????c xo?? ~' })
            } else {
                return res
                    .status(404)
                    .json({
                        success: false,
                        message: 'S???n ph???m kh??ng t??m th???y !',
                    })
            }
        })
        .catch((err) => {
            return res.status(400).json({
                error: err,
                success: false,
            })
        })
})
module.exports = router
