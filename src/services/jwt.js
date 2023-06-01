'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'monterroso';

exports.createToken = function(user){
    var payload = {
        sub: user._id,
        nombre: user.nombre,
        apellido: user.apellido,
        nick: user.nick,
        email: user.email,
        image: user.image,
        iat: moment().unix(),
        exp: moment().add(30, 'days').unix
    };

    return jwt.encode(payload, secret);
}