const { check } = require('express-validator');

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// /api/users/
router.get('/', userController.index );

// /api/users/30
router.get('/:id', userController.show );

// /api/users/search?name=j&age=10
router.post('/search', userController.search );

// /api/users/
router.post('/', [
    check('name').not().isEmpty().withMessage('ป้อนข้อมูลชื่อ-สกุล'),
    check('email').not().isEmpty().withMessage('ป้อนข้อมูลอีเมล์ด้วย')
    .isEmail().withMessage('รูปแบบอีเมล์ไม่ถูกต้อง'),
    check('password').not().isEmpty().withMessage('ป้อนข้อมูลรหัสผ่านด้วย')
    .isLength({min: 3}).withMessage('รหัสผ่านต้องอย่างน้อย 3 ตัวอักษรขึ้นไป'),
] ,userController.insert );


// /api/users/login
router.post('/login', [
    //check('name').not().isEmpty().withMessage('ป้อนข้อมูลชื่อ-สกุล'),
    check('email').not().isEmpty().withMessage('ป้อนข้อมูลอีเมล์ด้วย')
    .isEmail().withMessage('รูปแบบอีเมล์ไม่ถูกต้อง'),
    check('password').not().isEmpty().withMessage('ป้อนข้อมูลรหัสผ่านด้วย')
    .isLength({min: 3}).withMessage('รหัสผ่านต้องอย่างน้อย 3 ตัวอักษรขึ้นไป'),
] ,userController.login );

//ลบ user by id
// /api/users/30
router.delete('/:id', userController.destroy );

//แก้ไข user by id
// /api/users/30
router.put('/:id', userController.update );

module.exports = router;
