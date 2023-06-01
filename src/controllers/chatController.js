
'use strict'
var Chat = require('../models/chat');
var Usuario = require('../models/usuario');
const mongoose = require('mongoose');
async function listarMensajes(req, res) {
    let userId = req.user.sub; // Asegúrate de obtener el userId correctamente. Esto depende de cómo manejes la autenticación.
    try {
        // Buscar mensajes donde el usuario es el usuarioOrigen o el usuarioDestinatario.
        let mensajes = await Chat.find({
            $or: [
                { usuarioOrigen: userId },
                { usuarioDestinatario: userId }
            ]
        })
        .populate('usuarioOrigen usuarioDestinatario', 'nombre apellido nick email image') // Poblar los campos del usuarioOrigen y usuarioDestinatario con los datos del usuario.
        .sort('-date'); // Esto ordenará los mensajes por fecha en orden descendente, por lo que los mensajes más recientes aparecerán primero.

        if (!mensajes) {
            return res.status(400).send({ message: 'Error al listar los mensajes' });
        } else {
            return res.status(200).send({ data: mensajes });
        }
    } catch (err) {
        return res.status(500).send({ message: err });
    }
}


async function listarMesajeConPersona(req, res) {
    try {
        
        const miCuenta =new mongoose.Types.ObjectId(req.user.sub); // Convertir el ID de miCuenta en un ObjectId de Mongoose
        const suCuenta =new mongoose.Types.ObjectId(req.body.suCuenta); // Convertir el ID de suCuenta en un ObjectId de Mongoose

        // Buscar mensajes donde el usuarioOrigen es miCuenta y el usuarioDestinatario es suCuenta
        const mensajesEnviados = await Chat.find({
            usuarioOrigen: miCuenta,
            usuarioDestinatario: suCuenta
        }).sort({ date: -1 }); // Ordenar por fecha en orden descendente

        // Buscar mensajes donde el usuarioOrigen es suCuenta y el usuarioDestinatario es miCuenta
        const mensajesRecibidos = await Chat.find({
            usuarioOrigen: suCuenta,
            usuarioDestinatario: miCuenta
        }).sort({ date: -1 }); // Ordenar por fecha en orden descendente

        const todosMensajes = [...mensajesEnviados, ...mensajesRecibidos];

        res.status(200).json({ mensajes: todosMensajes });
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
}

async function listarUltimoMensaje(req, res) {
    try {
        let usuarioId = new mongoose.Types.ObjectId(req.user.sub); // Convierte el ID de usuario a ObjectId

        const mensajes = await Chat.aggregate([
            {
                $match: {
                    $or: [
                        { usuarioOrigen: usuarioId },
                        { usuarioDestinatario: usuarioId }
                    ]
                }
            },
            {
                $sort: { date: -1 }
            },
            {
                $group: {
                    _id: {
                        $cond: {
                            if: { $eq: ['$usuarioOrigen', usuarioId] },
                            then: '$usuarioDestinatario',
                            else: '$usuarioOrigen'
                        }
                    },
                    ultimoMensaje: { $first: '$$ROOT' }
                }
            },
            {
                $lookup: {
                    from: 'usuarios',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'usuario'
                }
            },
            {
                $unwind: '$usuario'
            }
        ]);

        // Obtiene todos los usuarios
        const todosUsuarios = await Usuario.find({});
        // Filtra para obtener solo aquellos usuarios que no están en la lista de mensajes
        const usuariosSinMensajes = todosUsuarios.filter(usuario => {
            return !mensajes.some(mensaje => mensaje._id.equals(usuario._id));
        });

        // Genera registros con propiedades de mensajes nulas para usuarios sin mensajes
        const registrosSinMensajes = usuariosSinMensajes.map(usuario => ({
            _id: usuario._id,
            ultimoMensaje: {
                mensaje: null,
                usuarioOrigen: null,
                usuarioDestinatario: null,
                date: null,
            },
            usuario
        }));

        // Une los mensajes con los registros sin mensajes
        const resultado = [...mensajes, ...registrosSinMensajes];

        res.status(200).json({ mensajes: resultado });
    } catch (error) {
        res.status(500).json({ message: error.toString() });
    }
}



async function postMensaje(req, res) {
    var params = req.body;

    if (params.mensaje || params.usuarioDestinatario) {
        var chat = new Chat({
            mensaje: params.mensaje || null,
            date: params.date || null,
            ip: params.ip || null,
            usuarioOrigen: req.user.sub,
            usuarioDestinatario:params.usuarioDestinatario
        });

        try {
            let tareaGuardada = await chat.save();

            if (tareaGuardada) {
                res.status(200).send({ data: "Registrado correctamente." })
            } else {
                res.status(404).send({ message: 'No se ha podido registrar el usuario' })
            }

        } catch (err) {
            return res.status(500).send({ message: 'Error en la petición del usuario: ' + err.message });
        }
    } else {
        res.status(200).send({
            message: 'Rellene los datos necesarios'
        })
    }
}

module.exports = {
    listarMensajes,
    postMensaje,
    listarUltimoMensaje,
    listarMesajeConPersona,
}