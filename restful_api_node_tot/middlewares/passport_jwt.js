const passwortjwt = require('passport')
const model = require('../models/index')


const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'w!z%C*F-JaNdRgUkXp2s5u8x/A?D(G+KbPeShVmYq3t6w9y$B&E)H@McQfTjWnZr';
passwortjwt.use(new JwtStrategy(opts,async (jwt_payload, done)=> {
    //jwt_payload เก็บ id name role
    try {
        const user = await model.User.findByPk(jwt_payload.id)
        //return done(null,jwt_payload.name)
        return done(null,user)
    } catch (error) {
        done(error)
    }
}));



//check token
module.exports.isLogin = passwortjwt.authenticate('jwt',{session:false})