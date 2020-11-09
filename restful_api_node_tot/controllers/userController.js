const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken')
const model = require('../models/index');

exports.index = async (req, res, next) => {
    // const user = await model.User.findAll();
    // const user = await model.User.findAll({
    //     attributes: ['id','name','role'],
    //     order: [['id','desc']]
    // });
    // const user = await model.User.findAll({
    //     attributes: { exclude: ['password', 'role'] },
    //     order: [['id','desc']]
    // });
    // const user = await model.User.findAll({
    //     attributes: { exclude: ['password', 'role'] },
    //     where: {
    //         email: 'john@gmail.com'
    //     },
    //     order: [['id','desc']]
    // });
    // const user = await model.User.findAll({
    //     attributes: ['id',['name','fullname'],'role'],
    //     order: [['id','desc']]
    // });

    // const sql = 'select id,name,role from users order by id desc';
    // const user = await model.sequelize.query(sql, {
    //     type: model.sequelize.QueryTypes.SELECT
    // });

    //Pagination
    //http://localhost:3000/api/users?page=1&pageSize=5
    //http://localhost:3000/api/users
    const { page, pageSize } = req.query;
    const myPage = page ? parseInt(page) : 1;
    const myPageSize = pageSize ? parseInt(pageSize) : 5;

    const user = await model.User.findAndCountAll({
        attributes: { exclude: ['password'] },
        order: [ ['id','desc'] ],
        offset: (myPage - 1) * myPageSize,
        limit: myPageSize
    });

    return res.status(200).json({
        total: user.count,
        data: user.rows
    });
}

exports.show = async (req, res, next) => {
   try {

    const { id } = req.params;

    const user = await model.User.findByPk(id, {
        attributes: { exclude: ['password'] },
        include: [
            { 
               model: model.Blog,
               as: 'blogs',
               attributes: ['id','title']
            }
        ],
        order: [
            ['blogs', 'id', 'desc']
        ]
    });

    if (!user) {
        const error = new Error('ไม่พบ id นี้ในระบบ');
        error.statusCode = 404;
        throw error;
    }

    return res.status(200).json({
        data: user
    });
       
   } catch (error) {
       next(error);
   }
}

exports.search = async (req, res, next) => {
    const { name } = req.query;

    const user = await model.User.findAll({
       attributes: { exclude: ['password'] },
       where: {
           name: {
               [model.Sequelize.Op.like]: '%' + name + '%'
           }
       }
    });

    return res.status(200).json({
        data: user
    });
}

//login
exports.login = async (req, res, next) => {
    try {
     const {email,password} = req.body;
 
     //validation
     const validation = validationResult(req);
     if (!validation.isEmpty()) {
         const error = new Error('ข้อมูลที่ส่งมาไม่ถูกต้อง');
         error.statusCode = 422;
         error.validation = validation.array()
         throw error;
     }
 
     //check email ใน database
     const userEmail = await model.User.findOne({ where: { email: email } });
     if (!userEmail) {
         const error = new Error('ไม่พอผู้ใช้นี้ในระบบ');
         error.statusCode = 404;
         throw error;
     }
 
     //compare chreck pass
    const isValid = await bcrypt.compare(password,userEmail.password)
     if (!isValid) {
        const error = new Error('รหัสผ่านไม่ถูกต้อง');
        error.statusCode = 401;
        throw error;
     }
     //สร้าง token
     const token = jwt.sign({
         id : userEmail.id,
         role: userEmail.role,
         name : userEmail.name,
     },'w!z%C*F-JaNdRgUkXp2s5u8x/A?D(G+KbPeShVmYq3t6w9y$B&E)H@McQfTjWnZr',
     {
         expiresIn:"2 days"
     })

     //console.log(token);
     return res.status(201).json({
        // message: 'เข้าระบบเรียบร้อย'
        access_token : token,
        token_type:'Bearer'
     });
 
    } catch (error) {
        next(error);
    }
 }

exports.insert = async (req, res, next) => {
   try {
    const {name,email,password} = req.body;

    //validation
    const validation = validationResult(req);
    if (!validation.isEmpty()) {
        const error = new Error('ข้อมูลที่ส่งมาไม่ถูกต้อง');
        error.statusCode = 422;
        error.validation = validation.array()
        throw error;
    }

    //check email ซ้ำ
    const userEmail = await model.User.findOne({ where: { email: email } });
    if (userEmail) {
        const error = new Error('อีเมล์ซ้ำ มีผู้ใช้งานแล้ว');
        error.statusCode = 400;
        throw error;
    }

    //gensalt
    const salt = await bcrypt.genSalt(10);
    //hash password
    const hashPassword = await bcrypt.hash(password, salt);

    //insert user
    const user = await model.User.create({
        name: name,
        email: email,
        password: hashPassword
    });

    return res.status(201).json({
        message: 'เพิ่มข้อมูลเรียบร้อย',
        user: {
            id: user.id,
            name: user.name,
            email: user.email
        }
    });

   } catch (error) {
       next(error);
   }
}

//ลบ user by id
exports.destroy = async (req, res, next) => {
    try {
 
     const { id } = req.params;
 
     const user = await model.User.findByPk(id);
 
     if (!user) {
         const error = new Error('ไม่พบ id นี้ในระบบ');
         error.statusCode = 404;
         throw error;
     }

     //ลบ
     await model.User.destroy({
         where: { id: id }
     });
 
     return res.status(200).json({
         message: 'ลบข้อมูลเรียบร้อย'
     });
        
    } catch (error) {
        next(error);
    }
 }


 //แก้ไข user by id
 exports.update = async (req, res, next) => {
    try {
     const { id, name, password} = req.body;

     //เช็ค id ว่าเท่ากันหรือไม่
     if (req.params.id != id) {
        const error = new Error('รหัสที่ต้องการแก้ไขไม่ถูกต้อง');
        error.statusCode = 400;
        throw error;
     }
 
     //gensalt
     const salt = await bcrypt.genSalt(10);
     //hash password
     const hashPassword = await bcrypt.hash(password, salt);
 
     //update user
     await model.User.update({
         name: name,
         password: hashPassword
     }, {
         where: { id: id}
     });
 
     return res.status(200).json({
         message: 'แก้ไขข้อมูลเรียบร้อย'
     });
 
    } catch (error) {
        next(error);
    }
 }