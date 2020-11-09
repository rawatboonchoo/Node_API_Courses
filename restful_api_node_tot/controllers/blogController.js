const model = require('../models/index');

exports.index = async (req, res, next) => {
    const blogs = await model.Blog.findAll({
        include: [
            {
                model: model.User,
                as: 'user',
                attributes: ['id','name','role']
            }
        ]
    });

    return res.status(200).json({
        data: blogs
    });
}