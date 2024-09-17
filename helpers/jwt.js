const {expressjwt} = require('express-jwt');

function authJWT(){

    const secret = process.env.secret;

    return expressjwt({
        secret,
        algorithms: ['HS256']
    })
};

module.exports = authJWT;