const express = require('express')
const router = express.Router()
const { Category } = require('../modes/category')

//http://localhost:4000/api/category
// req: request res: response
router.get(`/`, async (req, res) => {
    const categoryList = await Category.find()

    if (!categoryList) {
        res.status(500).json({ success: false })
    }

    res.send(categoryList)
})

router.get('/:id', async (req, res) => {
    const category = await Category.findById(req.params.id)
    if (!category) {
        res.status(500).json({ message: 'Category tìm theo ID không có. ' })
    }
    res.status(200).send(category);
    
})

router.post(`/`, async (req, res) => {
    let category = new Category({
        name: req.body.name,
    })
    category = await category.save()
    if (!Category) return res.status(404).send('không tạo được Category !')
    res.send(category)
})


router.put('/:id', async(req, res)=>{
    const category= await Category.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
        }
    )
    if (!category)
    return res.status(400).send('Không thể sửa Category');
    res.send(category);
})

router.delete('/:id', (req, res) => {
    Category.findByIdAndRemove(req.params.id)
        .then((category) => {
            if (Category) {
                return res
                    .status(200)
                    .json({ success: true, message: 'Category đã được xoá ~' })
            } else {
                return res
                    .status(404)
                    .json({
                        success: false,
                        message: 'Category không tìm thấy !',
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
