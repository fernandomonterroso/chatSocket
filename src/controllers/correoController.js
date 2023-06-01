
 'use strict'
const nodemailer = require('nodemailer');
 var Usuario = require('../models/usuario');

 function correo(req, res) {
    var params = req.body;
    var userId=req.user.sub;
    var correoE;
    var password;
    var nombre;
    Usuario.findById({_id:userId},(err,usuarioEncontrado)=>{
        if(err) return res.status(500).send({message:'No se ha podido encontrar la peticion'});
        if(usuarioEncontrado) {
            correoE=usuarioEncontrado.email;
            password=usuarioEncontrado.password;
            nombre = usuarioEncontrado.nombre;
            console.log(correoE,password);
            
            var transporter = nodemailer.createTransport({
                service: "hotmail",
            
                secure: false, // true for 465, false for other ports
                auth: {
                    user: correoE, // Cambialo por tu email
                    pass: password // Cambialo por tu password
                }
            });
            const mailOptions = {
                from: `"${nombre}" <${correoE}>`,
                to: `"${params.email}"`, // Cambia esta parte por el destinatario
                subject: `"${params.asunto}"`,
                html: `
                <strong>Nombre:</strong> "${nombre}" <br/>
                <strong>E-mail:</strong> "${params.email}" <br/>
                <strong>Mensaje:</strong> ${params.asunto}
        `
            };
            transporter.sendMail(mailOptions, function (err, info) {
                if (err)
                    console.log(err)
                else
                    console.log(info);
            });
        }else{
        return res.status(404).send({message:'No hay ningun usuario en existencia'});
        }
    });

    
}


// module.exports = (formulario) => {
//  var transporter = nodemailer.createTransport({
//  service: 'hotmail',
//  auth: {
//  user: 'elmerfer_mejor@hotmail.com', // Cambialo por tu email
//  pass: 'monterroso10' // Cambialo por tu password
//  }
//  });
//  console.log(`${formulario.nombre}`);
// const mailOptions = {
//  from: `"${formulario.nombre}" <${formulario.email}>`,
//  to: `${formulario.nombre}`, // Cambia esta parte por el destinatario
//  subject: formulario.asunto,
//  html: `
//  <strong>Nombre:</strong> ${formulario.nombre} <br/>
//  <strong>E-mail:</strong> ${formulario.email} <br/>
//  <strong>Mensaje:</strong> ${formulario.mensaje}
//  `
//  };
// transporter.sendMail(mailOptions, function (err, info) {
//  if (err)
//  console.log(err)
//  else
//  console.log(info);
//  });
// }

module.exports = {

    correo

}