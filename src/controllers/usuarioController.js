'use strict'

var bcrypt = require("bcrypt-nodejs");
var User = require('../models/usuario');
var jwt = require('../services/jwt')
var path = require('path');
var fs = require('fs');

async function registrar(req, res) {
    var user = new User();
    var params = req.body;
    console.log(req.body);
    if (params.nombre && params.nick && params.email && params.password) {
        user.nombre = params.nombre;
        user.apellido = params.apellido;
        user.nick = params.nick;
        user.email = params.email;
        user.image = null;

        try {
            let users = await User.find({
                $or: [
                    { email: user.email.toLowerCase() },
                    { nick: user.nick.toLowerCase() }
                ]
            });

            if (users && users.length >= 1) {
                return res.status(500).send({ message: 'El Usuario ya existe' });
            } else {
                user.password = params.password;
                let userGuardado = await user.save();

                if (userGuardado) {
                    res.status(200).send({ user: userGuardado })
                } else {
                    res.status(404).send({ message: 'no se a podido registrar al usuario' })
                }
            }
        } catch (err) {
            return res.status(500).send({ message: 'Error en la peticion de Usuario' });
        }
    } else {
        res.status(200).send({
            message: 'Rellene los datos necesarios'
        });
    }
}


async function login(req, res) {
    var params = req.body;
    var emailOrNick = params.emailOrNick;
    var password = params.password;

    try {
        let user = await User.findOne({ $or: [{ email: emailOrNick }, { nick: emailOrNick }] });

        if (user) {
            if (user.password === password) {
                return res.status(200).send({token: jwt.createToken(user),user:user});
            } else {
                return res.status(401).send({ message: 'Contraseña incorrecta' });
            }
        } else {
            return res.status(404).send({ message: 'El usuario no ha podido loguearse' });
        }
    } catch (err) {
        return res.status(500).send({ message: 'Error en la peticion' });
    }
}



function subirImagen(req, res) {
    var userId = req.params.id;
    if (req.files) {
        var file_path = req.files.image.path;
        console.log(file_path);
        var file_split = file_path.split('\\');
        console.log(file_split);

        var file_name = file_split[3];
        console.log(file_name);

        var ext_xplit = file_name.split('\.');
        console.log(ext_xplit);

        var file_ext = ext_xplit[1];
        console.log(file_ext);

        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif' || file_ext == 'jfif') {
            User.findByIdAndUpdate(userId, { image: file_name }, { new: true }, (err, usuarioActualizado) => {
                if (err) return res.status(500).send({ mesagge: 'error en la peticion' })

                if (!usuarioActualizado) return res.status(404).send({ mesagge: 'No se a podido actualizar el usuario' })

                return res.status(200).send({ user: usuarioActualizado })

            })
        } else {
            return removeFilerOfUploads(res, file_path, 'Extension no valida')
        }
    }
}

function removeFilerOfUploads(res, file_path, message) {
    fs.unlink(file_path, (err) => {
        return res.status(200).send({
            mesagge: message
        })
    })
}

function getImageFile(req, res) {
    var image_file = req.params.imageFile;
    var path_file = './src/uploads/users/' + image_file;
    fs.exists(path_file, (exists) => {
        if (exists) {
            res.sendFile(path.resolve(path_file));
        } else {
            res.status(200).send({ mesagge: 'no existe la imagen' });
        }
    })
}

function editarUsuario(req, res) {
    var userId = req.params.id;
    var params = req.body;

    //BORRAR LA PROPIEDAD DE PASSWORD
    delete params.password;

    if (userId != req.user.sub) {
        return res.status(500).send({ mesagge: 'No tiene los permiso para editar este usuario' });
    }

    User.findByIdAndUpdate(userId, params, { new: true }, (err, usuarioActualizado) => {
        if (err) return res.status(500).send({ mesagge: 'Error en la peticion' })

        if (!usuarioActualizado) return res.status(404).send({ mesagge: 'No se han podido actualizar los datos del usuario' })

        return res.status(200).send({ user: usuarioActualizado });
    })
}



module.exports = {
    registrar,
    login,
    subirImagen,
    getImageFile,
    editarUsuario,

}