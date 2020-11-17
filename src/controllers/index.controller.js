const MessagingResponse = require('twilio').twiml.MessagingResponse;
const {sendMessage} = require('../twilio/send-sms')
const {sendWhatsapp} = require('../twilio/send-wapp')
const {sendCode, verifyCode} = require('../twilio/verify')
const SMS = require('../models/sms')
const User = require('../models/user')
const Owner = require('../models/owner')
const Business = require('../models/business')
const Associate = require('../models/associate')
const Turns = require('../models/turns')
const Rates = require('../models/rates')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const {getSocket} = require('../sockets')
const _ = require('underscore');
const jwt = require('jsonwebtoken');

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// const mailgun = require("mailgun-js");
// const DOMAIN = 'sandbox8bd3a94342c64f6e8e86dd9bd14993af.mailgun.org';
// const mg = mailgun({apiKey: process.env.MG_API, domain: DOMAIN});

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const saltRounds = 10

const paymentIntent = async (req, res) => {
  console.log(req.body)

  stripe.charges.create(
    {
      amount: req.body.amount,
      currency: 'mxn',
      source: req.body.source,
      description: req.body.description
    },
    function(err, charge) {
      // asynchronously called
      if(err){
        console.log(err)
        return res.status(400).json({mensaje: "Error de procesamiento de pago"})
      }else{
        console.log(charge)
        return res.status(200).json(charge)
      }
    }
  );

  /*const paymentIntent = await stripe.paymentIntents.create({
    amount: 2500,
    currency: "mxn"
  })
  res.send({
    clientSecret: paymentIntent.client_secret
  })*/
}

const forgotPass = async (req, res) => {
  const ownerDB = await Owner.findOne({email: req.body.email})
  if(!ownerDB){
    return res.status(400).json({
      mensaje: 'No existe este correo registrado'
    })
  }
  crypto.randomBytes(20, (err, buffer)=>{
    if(err){
      console.log(err)
      return res.status(500).json({mensaje: 'Hubo un error. Intenta de nuevo más tarde'})
    }else{
      var token = buffer.toString('hex')
      const msg = {
        to: req.body.email,
        from: 'recuperacion@filasinfila.com',
        subject: 'Reestablecimiento de contraseña de tu registro en FilaSinFila',
        text: 'Reestablece tu contraseña',
        html: `
            <h2>Da click en el siguiente link para reestablecer tu contraseña</h2>
            <p>${process.env.CLIENT_URL}/resetPass/${token}</p>
        `
      }
      return ownerDB.updateOne({resetLink: token, resetExpires: Date.now() + 86400000}, (err, success) => {
        if(err){
          return res.status(400).json({mensaje: 'Hubo un error. Intenta de nuevo más tarde'})
        }else{
          sgMail.send(msg)
          .then(() => {
            return res.json({mensaje: 'Correo de recuperación de contraseña ha sido enviado'})
          }, error => {
            console.error(error);
        
            if (error.response) {
              console.error(error.response.body)
              return res.status(500).json({mensaje: 'Error al enviar el correo: ' + error.response.body})
            }
          })
        }
      })
    }
  })
}

const resetPass = async (req, res) => {
  const resetToken = req.body.resetLink
  const newPass = req.body.newPass
  if(resetToken){
    Owner.findOne({resetLink: resetToken, resetExpires: {$gt: Date.now()}}, (err, owner) => {
      if(err){
        return res.status(400).json({mensaje: 'Token de recuperación expirado o no válido'})
      }
      npass = bcrypt.hashSync(newPass, saltRounds)
      const obj = {
        pass: npass,
        resetLink: '',
        resetExpires: ''
      }

      owner = _.extend(owner, obj)
      owner.save((err, result) => {
        if(err){
          return res.status(400).json({mensaje: 'Error al actualizar la contraseña'})
        }else{
          return res.status(200).json({mensaje: 'La contraseña ha sido actualizada'})
        }
      })
    })
  }else{
    return res.status(500).json({mensaje: 'Token de recuperación no solicitado o emitido'})
  }
}

const loginUser = async (req, res) => {
    let body = req.body;

  try {
    // Buscamos email en DB
    //const usuarioDB = await User.findOne({email: body.email});
    //console.log(usuarioDB)

    // Evaluamos si existe el usuario registrado
    //if(!usuarioDB){
      // Evaluamos si existe el negocio registrado
      const ownerDB = await Owner.findOne({email: body.email})
      if(!ownerDB){
        // Evaluamos si existe el asociado registrado
        const associateDB = await Associate.findOne({email: body.email})
        if(!associateDB){
          return res.status(400).json({
            mensaje: 'Usuario o contraseña inválidos',
          });
        }

        // Checamos la contraseña del asociado registrado
        if( !bcrypt.compareSync(body.pass, associateDB.pass) ){
          return res.status(400).json({
            mensaje: 'Usuario o contraseña inválidos',
          });
        }
        // Generar Token para asociado
        let token = jwt.sign({
          data: {
            role: associateDB.role,
            email: associateDB.email,
            telefono: associateDB.telefono,
            nombre: associateDB.nombre,
            associateID: associateDB._id,
            businessID: associateDB.businessID,
            ownerID: associateDB.ownerID
          }
        }, 'secret', { expiresIn: 60 * 60 * 24 * 30}) // Expira en 30 días

        // Pasó las validaciones del asociado
        return res.json({
          mensaje: 'Autenticación correcta',
          role: associateDB.role,
          email: associateDB.email,
          telefono: associateDB.telefono,
          nombre: associateDB.nombre,
          associateID: associateDB._id,
          businessID: associateDB.businessID,
          ownerID: associateDB.ownerID,
          token: token
        })
      }

      // Checamos la contraseña del negocio registrado
      if( !bcrypt.compareSync(body.pass, ownerDB.pass) ){
        return res.status(400).json({
          mensaje: 'Usuario o contraseña inválidos',
        });
      }

      // Generar Token del negocio registrado
      let token = jwt.sign({
          data: {
            role: ownerDB.role,
            email: ownerDB.email,
            telefono: ownerDB.telefono,
            nombre: ownerDB.nombre,
            nombreF: ownerDB.nombreF,
            direccionF: ownerDB.direccionF,
            ownerID: ownerDB._id
          }
      }, 'secret', { expiresIn: 60 * 60 * 24 * 30}) // Expira en 30 días

      // Pasó las validaciones del negocio registrado
      return res.json({
        mensaje: 'Autenticación correcta',
        role: ownerDB.role,
        email: ownerDB.email,
        telefono: ownerDB.telefono,
        nombre: ownerDB.nombre,
        nombreF: ownerDB.nombreF,
        direccionF: ownerDB.direccionF,
        ownerID: ownerDB._id,
        token: token
      })
    //}

    /*// Checamos la contraseña del usuario registrado
    if( !bcrypt.compareSync(body.pass, usuarioDB.pass) ){
      return res.status(400).json({
        mensaje: 'Usuario o contraseña inválidos',
      });
    }
    // Generar Token del usuario registrado
    let token = jwt.sign({
        data: {
          role: usuarioDB.role,
          sms: usuarioDB.sms,
          email: usuarioDB.email,
          telefono: usuarioDB.telefono,
          nombre: usuarioDB.nombre,
          userID: usuarioDB._id
        }
    }, 'secret', { expiresIn: 60 * 60 * 24 * 30}) // Expira en 30 días

    // Pasó las validaciones del usuario registrado
    return res.json({
      mensaje: 'Autenticación correcta',
      role: usuarioDB.role,
      sms: usuarioDB.sms,
      email: usuarioDB.email,
      telefono: usuarioDB.telefono,
      nombre: usuarioDB.nombre,
      userID: usuarioDB._id,
      token: token
    })*/
    
  } catch (error) {
    return res.status(500).json({
      mensaje: 'Ocurrio un error',
      error
    });
  }
}

const searchTel = async (req, res) => {
  const telDB = await User.findOne({telefono: req.body.tel})
  console.log(req.body.tel)
  if(telDB){
    return res.json({
      existe: true,
      role: telDB.role,
      sms: telDB.sms,
      email: telDB.email,
      telefono: telDB.telefono,
      nombre: telDB.nombre,
      userID: telDB._id,
    })
  }else{
    return res.json({
      existe: false
    })
  }
}

const searchUser = async (req, res) => {
  const mailDB = await User.findOne({email: req.body.email});
  const telDB = await User.findOne({telefono: req.body.tel});
  console.log(req.body.email)
  console.log(req.body.tel)
  if(mailDB || telDB){
    console.log("YA REGISTRADO")
    return res.status(400).json({
      mensaje: 'El correo y/o teléfono ya estan registrados.',
    });
  } else {
    console.log("NO REGISTRADO")
    return res.json({mensaje: "OK"})
  }

}

const searchOwner = async (req, res) => {
  const mailDB = await Owner.findOne({email: req.body.email});
  const telDB = await Owner.findOne({telefono: req.body.tel});

  if(mailDB || telDB){
    return res.status(400).json({
      mensaje: 'El correo y/o teléfono ya estan registrados.',
    });
  } else {
    return res.json({mensaje: "OK"})
  }
}

const createUser = async (req, res) => {
    const body = {
        nombre: req.body.nombre,
        email: req.body.email,
        telefono: req.body.tel,
        pass: req.body.pass,
        role: req.body.role
    }

    console.log(body)

    /*const mailDB = await User.findOne({email: req.body.email});
    const telDB = await User.findOne({telefono: req.body.tel});

    if(mailDB || telDB){
      return res.status(400).json({
        mensaje: 'El correo y/o teléfono ya estan registrados.',
      });
    }*/

    // body.pass = bcrypt.hashSync(req.body.pass, saltRounds)

    try {
        const userDB = await User.create(body)
        return res.json({
          message: "OK",
          role: userDB.role,
          sms: userDB.sms,
          email: userDB.email,
          telefono: userDB.telefono,
          nombre: userDB.nombre,
          userID: userDB._id,
        })
    } catch (error) {
        return res.status(500).json({
            mensaje: 'Ocurrio un error al registrarte. Intenta de nuevo.',
            error
        })
    }
}

const createOwner = async (req, res) => {
  const body = {
      nombre: req.body.nombre,
      email: req.body.email,
      telefono: req.body.tel,
      nombreF: req.body.nombreF,
      direccionF: req.body.direccionF,
      role: req.body.role
  }

  const mailDB = await Owner.findOne({email: req.body.email});
  const telDB = await Owner.findOne({telefono: req.body.tel});

  if(mailDB || telDB){
    return res.status(400).json({
      mensaje: 'El correo y/o teléfono ya estan registrados.',
    });
  }

  body.pass = bcrypt.hashSync(req.body.pass, saltRounds)

  try {
      const ownerDB = await Owner.create(body)
      return res.json({
        message: "OK",
        nombre: ownerDB.nombre,
        email: ownerDB.email,
        telefono: ownerDB.telefono,
        nombreF: ownerDB.nombreF,
        direccionF: ownerDB.direccionF,
        role: ownerDB.role,
        ownerID: ownerDB._id
      })
  } catch (error) {
      return res.status(500).json({
          mensaje: 'Ocurrio un error al registrarte. Intenta de nuevo.',
          error
      })
  }
}

const createAssociate = async (req, res) => {
  const body = {
      nombre: req.body.nombre,
      email: req.body.email,
      telefono: req.body.tel,
      businessID: req.body.businessID,
      ownerID: req.body.ownerID,
      role: req.body.role
  }

  const mailDB = await Associate.findOne({email: req.body.email});
  const telDB = await Associate.findOne({telefono: req.body.tel});

  if(mailDB || telDB){
    return res.status(400).json({
      mensaje: 'El correo y/o teléfono ya estan registrados.',
    });
  }

  body.pass = bcrypt.hashSync(req.body.pass, saltRounds)

  try {
      const associateDB = await Associate.create(body)
      return res.json({
        message: "OK",
        nombre: associateDB.nombre,
        email: associateDB.email,
        telefono: associateDB.telefono,
        businessID: associateDB.businessID,
        ownerID: associateDB.ownerID,
        role: associateDB.role,
        associateID: associateDB._id,
        _id: associateDB._id
      })
  } catch (error) {
      return res.status(500).json({
          mensaje: 'Ocurrio un error al registrarte. Intenta de nuevo.',
          error
      })
  }
}

const updateAssociate = async(req, res) => {

  let id = req.params.id;
  let body = _.pick(req.body, ['nombre', 'email', 'telefono']);

  try {
    // {new:true} nos devuelve el negocio actualizado
    const associateDB = await Associate.findByIdAndUpdate(id, body);

    return res.json({mensaje: "OK"});

  } catch (error) {
    return res.status(400).json({
      mensaje: 'Ocurrio un error. Intenta de nuevo más tarde',
      error
    })
  }  
}

const updateAssociatePass = async(req, res) => {

  let id = req.params.id;
  let pass = req.body.pass

  npass = bcrypt.hashSync(pass, saltRounds)

  try {
    // {new:true} nos devuelve el negocio actualizado
    const associateDB = await Associate.findByIdAndUpdate(id, {pass: npass});

    return res.json({mensaje: "OK"});

  } catch (error) {
    return res.status(400).json({
      mensaje: 'Ocurrio un error. Intenta de nuevo más tarde',
      error
    })
  }  
}

const updateUser = async(req, res) => {

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'telefono', 'sms']);
  
    try {
      // {new:true} nos devuelve el usuario actualizado
      const usuarioDB = await User.findByIdAndUpdate(id, body);
  
      return res.json({mensaje: "OK"});
  
    } catch (error) {
      return res.status(400).json({
        mensaje: 'Ocurrio un error. Intenta de nuevo más tarde',
        error
      })
    }  
}

const updateOwner = async(req, res) => {

  let id = req.params.id;
  let body = _.pick(req.body, ['nombre', 'email', 'telefono', 'nombreF', 'direccionF']);
  /* if(body.pass){
    body.pass = bcrypt.hashSync(req.body.pass, saltRounds);
  } */

  try {
    // {new:true} nos devuelve el dueño de negocio actualizado
    const ownerDB = await Owner.findByIdAndUpdate(id, body);

    return res.json({mensaje: "OK"});

  } catch (error) {
    return res.status(400).json({
      mensaje: 'Ocurrio un error. Intenta de nuevo más tarde',
      error
    })
  }  
}

const createBusiness = async(req, res) => {
  const body = {
    nombreC: req.body.nombreC,
    direccionC: req.body.direccionC,
    tokens: req.body.tokens,
    ownerID: req.body.ownerID,
    turnoActual: req.body.turnoActual,
    personasActual: req.body.personasActual,
    maxPersonas: req.body.maxPersonas,
    turnosAcumulado: req.body.turnosAcumulado,
    principal: req.body.principal
  }

  try {
    const businessDB = await Business.create(body)
    return res.json({
      message: "OK",
      nombreC: businessDB.nombreC,
      direccionC: businessDB.direccionC,
      tokens: businessDB.tokens,
      ownerID: businessDB.ownerID,
      turnoActual: businessDB.turnoActual,
      personasActual: businessDB.personasActual,
      maxPersonas: businessDB.maxPersonas,
      turnosAcumulado: businessDB.turnosAcumulado,
      principal: businessDB.principal,
      businessID: businessDB._id,
      _id: businessDB._id
    })
  } catch (error) {
    return res.status(500).json({
      mensaje: 'Ocurrio un error al registrar el negocio. Intenta de nuevo.',
      error
    })
  }
}

const updateBusiness = async(req, res) => {

  let id = req.params.id;
  let body = _.pick(req.body, ['nombreC', 'direccionC']);

  try {
    // {new:true} nos devuelve el negocio actualizado
    const businessDB = await Business.findByIdAndUpdate(id, body);

    return res.json({mensaje: "OK"});

  } catch (error) {
    return res.status(400).json({
      mensaje: 'Ocurrio un error. Intenta de nuevo más tarde',
      error
    })
  }  
}

const checkInBusiness = async(req, res) => {

  let id = req.params.id;
  let personasU = req.body.personasActual + 1
  let turnoU = req.body.turnoActual + 1

  try {
    // {new:true} nos devuelve el negocio actualizado
    const turnsDB = await Turns.findOne({businessID: id, turnoAsignado: turnoU})
    if(turnsDB){
      if(turnsDB.status=="espera"){
        const businessDB = await Business.findByIdAndUpdate(id, {personasActual: personasU, turnoActual: turnoU});
        const turnsDB = await Turns.findOneAndUpdate({businessID: id, turnoAsignado: turnoU},{status: "ok"});
        const userDB = await User.findOne({_id: turnsDB.userID});
        // Proceso para enviar mensaje al usuario
        if(businessDB.tokens <= 0){
          return res.json({mensaje: "ok-usuario-nosms", userID: turnsDB.userID});
        }else{
          let userPhoneSMS = userDB.telefono
          let userPhoneW = userDB.telefono
          let message = "FilaSinFila: " + userDB.nombre + " ya es tu turno! Puedes ingresar al establecimiento"
          
          const resultS = await sendMessage(message, userPhoneSMS);
          tokensMinus = businessDB.tokens - 1
          console.log(tokensMinus)
          const businessDB2 = await Business.findByIdAndUpdate(id, {tokens: tokensMinus});
          return res.json({mensaje: "ok-usuario", userID: turnsDB.userID});
        }
        /*if(userDB.sms=="SMS"){
          const resultS = await sendMessage(message, userPhoneSMS);
        } else {
          const resultW = await sendWhatsapp(message, userPhoneW);
        }*/
      }else if(turnsDB.status=="dejado"){
        const businessDB = await Business.findByIdAndUpdate(id, {turnoActual: turnoU});
        return res.json({mensaje: "ok-usuariodejado"});
      }
    }else{
        // const businessDB = await Business.findByIdAndUpdate(id, {personasActual: personasU});
        return res.json({mensaje: "ok-nousuario"});
    }

  } catch (error) {
    return res.status(400).json({
      mensaje: 'Ocurrio un error. Intenta de nuevo más tarde',
      error
    })
  }  
}

const checkOutBusiness = async(req, res) => {

  let id = req.params.id;
  let personasU = req.body.personasActual - 1
 
  try {
    
    const businessDB = await Business.findByIdAndUpdate(id, {personasActual: personasU});
  
    return res.json({mensaje: "OK"});

  } catch (error) {
    return res.status(400).json({
      mensaje: 'Ocurrio un error. Intenta de nuevo más tarde',
      error
    })
  }  
}

const changeMax = async(req, res) => {

  let id = req.params.id;
  let body = _.pick(req.body, ['maxPersonas']);

  try {
    // {new:true} nos devuelve el negocio actualizado
    const businessDB = await Business.findByIdAndUpdate(id, body);

    return res.json({mensaje: "OK"});

  } catch (error) {
    return res.status(400).json({
      mensaje: 'Ocurrio un error. Intenta de nuevo más tarde',
      error
    })
  }  
}

const addTokens = async(req, res) => {

  let id = req.params.id;
  let body = _.pick(req.body, ['tokens']);

  try {
    // {new:true} nos devuelve el negocio actualizado
    const businessDB = await Business.findByIdAndUpdate(id, body);

    return res.json({mensaje: "OK"});

  } catch (error) {
    return res.status(400).json({
      mensaje: 'Ocurrio un error. Intenta de nuevo más tarde',
      error
    })
  }  
}

const deleteBusiness = async(req, res) => {

  let id = req.params.id;

  try {
    // {new:true} nos devuelve el negocio actualizado
    const businessDB = await Business.findByIdAndDelete(id, function (err) {
      if(err) console.log(err);
      console.log("Successful delete");
    });;

    return res.json(businessDB);

  } catch (error) {
    return res.status(400).json({
      mensaje: 'Ocurrio un error. Intenta de nuevo más tarde',
      error
    })
  }  
}

const deleteAssociate = async(req, res) => {

  let id = req.params.id;

  try {
    // {new:true} nos devuelve el negocio actualizado
    const associateDB = await Associate.findByIdAndDelete(id, function (err) {
      if(err) console.log(err);
      console.log("Successful delete");
    });;

    return res.json(associateDB);

  } catch (error) {
    return res.status(400).json({
      mensaje: 'Ocurrio un error. Intenta de nuevo más tarde',
      error
    })
  }  
}

const getUser = async(req, res) => {

  let id = req.params.id;

  const userDB = await User.findOne({_id: id});

  return res.json({
    role: userDB.role,
    sms: userDB.sms,
    email: userDB.email,
    telefono: userDB.telefono,
    nombre: userDB.nombre,
    userID: userDB._id,
  })

}

const getOwner = async(req, res) => {

  let id = req.params.id;

  const ownerDB = await Owner.findOne({_id: id});

  return res.json({
    role: ownerDB.role,
    email: ownerDB.email,
    telefono: ownerDB.telefono,
    nombre: ownerDB.nombre,
    nombreF: ownerDB.nombreF,
    direccionF: ownerDB.direccionF,
    ownerID: ownerDB._id
  })


}

const getAssociate = async(req, res) => {

  let id = req.params.id;

  const associateDB = await Associate.findOne({_id: id});

  return res.json({
    role: associateDB.role,
    email: associateDB.email,
    telefono: associateDB.telefono,
    nombre: associateDB.nombre,
    associateID: associateDB._id,
    businessID: associateDB.businessID,
    ownerID: associateDB.ownerID,
    _id: associateDB._id
  })


}

const getBusiness = async(req, res) => {

    let id = req.params.id;

    const businessDB = await Business.findOne({ownerID: id, principal: true});

    return res.json({
      nombreC: businessDB.nombreC,
      direccionC: businessDB.direccionC,
      tokens: businessDB.tokens,
      ownerID: businessDB.ownerID,
      turnoActual: businessDB.turnoActual,
      personasActual: businessDB.personasActual,
      maxPersonas: businessDB.maxPersonas,
      turnosAcumulado: businessDB.turnosAcumulado,
      businessID: businessDB._id,
      _id: businessDB._id
    })


}

const getListBusiness = async(req, res) => {
  let id = req.params.id;
  const businessDB = await Business.find({ownerID: id, principal: false})
  console.log(businessDB)
  return res.json(businessDB)
}

const getListAssociates = async(req, res) => {
  let id = req.params.id;
  const associateDB = await Associate.find({ownerID: id})
  console.log(associateDB)
  return res.json(associateDB)
}

const generateQR = async(req, res) => {
  const businessQR = await Business.findOne({businessID: req.body.businessID});
  
  return res.json({
    businessID: businessQR._id
  })
}

const detectQR = async(req, res) => {
  let id = req.params.id;
  console.log(id)
  const businessQR = await Business.findOne({_id: id});
  
  return res.json({
    nombreC: businessQR.nombreC,
    direccionC: businessQR.direccionC,
    tokens: businessQR.tokens,
    ownerID: businessQR.ownerID,
    turnoActual: businessQR.turnoActual,
    turnosAcumulado: businessQR.turnosAcumulado,
    personasActual: businessQR.personasActual,
    maxPersonas: businessQR.maxPersonas,
    businessID: businessQR._id
  })
}

const takeTurn = async(req, res) => {

  let id = req.params.id;

  try {
    // {new:true} nos devuelve el negocio actualizado
    const businessDB = await Business.findOne({_id: id});
    const turnsDB = await Turns.create({
      userID:  req.body.userID,
      businessID: businessDB._id,
      status: "espera",
      turnoAsignado: businessDB.turnosAcumulado + 1
    });
    const updateB = await Business.findByIdAndUpdate(id, {turnosAcumulado: businessDB.turnosAcumulado + 1})
    const updateU = await User.findByIdAndUpdate(req.body.userID, {turnoActual: businessDB.turnosAcumulado + 1})

    return res.json({mensaje: "OK", turnID: turnsDB._id, turnoActual: turnsDB.turnoAsignado, turnoNegocio: businessDB.turnoActual});

  } catch (error) {
    return res.status(400).json({
      mensaje: 'Ocurrio un error. Intenta de nuevo más tarde',
      error
    })
  } 
}

const getTurn = async(req, res) => {

  let id = req.params.id;

  try {
    // {new:true} nos devuelve el negocio actualizado
    const turnsDB = await Turns.findOne({_id: id});
    
    return res.json({status: turnsDB.status});

  } catch (error) {
    return res.status(400).json({
      mensaje: 'Ocurrio un error. Intenta de nuevo más tarde',
      error
    })
  } 
}

const dropTurn = async(req, res) => {

  let id = req.params.id;

  try {
    // {new:true} nos devuelve el negocio actualizado
    const turnsDB = await Turns.findByIdAndUpdate(id, {status:"dejado"});
    
    return res.json({mensaje: "OK"});

  } catch (error) {
    return res.status(400).json({
      mensaje: 'Ocurrio un error. Intenta de nuevo más tarde',
      error
    })
  } 
}

const sendCodeNumber = async (req, res) => {
    let phone = req.body.phone
    try{
      const codeSMS = await sendCode(phone)
      console.log(codeSMS)
      return res.json(codeSMS)
    } catch (error) {
      return res.status(400).json({
        mensaje: 'Ocurrio un error. Intenta de nuevo más tarde',
        error
      })
    }
}

const verifyCodeNumber = async (req, res) => {
    let phone = req.body.phone
    let code = req.body.code
    try {
      const verify = await verifyCode(phone, code)
      console.log(verify)
      return res.json(verify)
    } catch (error) {
      return res.status(400).json({
        mensaje: 'Ocurrio un error. Intenta de nuevo más tarde',
        error
      })
    }
}

const indexController = async (req, res) => {
    const messages = await SMS.find().sort('-createdAt').lean();
    res.render('index', { messages })
}

const postMessage = async (req, res) => {
    
    const {message, phone} = req.body;

    if(!message || !phone) return res.json("Missing message or phone");
    
    const result = await sendMessage(req.body.message, req.body.phone);
    
    console.log(result.sid);

    await SMS.create({Body: req.body.message, To: req.body.phone});

    return res.json({mensaje: "OK"})
}

const postWhatsapp = async (req, res) => {
    
    const {message, phone} = req.body;

    if(!message || !phone) return res.json("Missing message or phone");
    
    const result = await sendWhatsapp(req.body.message, req.body.phone);
    
    console.log(result);

    await SMS.create({Body: req.body.message, To: req.body.phone});

    return res.json({mensaje: "OK"})

}

const receiveMessage = async (req, res) => {
    console.log(req.body.Body);

    const saveSMS = await SMS.create({
        Body: req.body.Body,
        From: req.body.From
    })

    getSocket().emit('new message', saveSMS)

    const twiml = new MessagingResponse();

    // twiml.message('This is my response');

    res.send(twiml.toString());
}

const rateBusiness = async(req, res) => {

  try {
    const ratesDB = await Rates.create({userID: req.body.userID, businessID: req.body.businessID, rateOverall: req.body.rateOverall, rateTime: req.body.rateTime})
    return res.json({
      message: "OK"
    })
  } catch (error) {
    return res.status(500).json({
      mensaje: 'Ocurrio un error al calificar. Intenta de nuevo.',
      error
    })
  }
}

module.exports = {
    indexController,
    postMessage,
    postWhatsapp,
    receiveMessage,
    loginUser,
    forgotPass,
    resetPass,
    createUser,
    createOwner,
    createAssociate,
    createBusiness,
    searchTel,
    searchUser,
    searchOwner,
    updateUser,
    updateOwner,
    updateBusiness,
    updateAssociate,
    updateAssociatePass,
    deleteBusiness,
    deleteAssociate,
    checkInBusiness,
    checkOutBusiness,
    changeMax,
    addTokens,
    getUser,
    getOwner,
    getAssociate,
    getBusiness,
    getListBusiness,
    getListAssociates,
    generateQR,
    detectQR,
    takeTurn,
    getTurn,
    dropTurn,
    sendCodeNumber,
    verifyCodeNumber,
    rateBusiness,
    paymentIntent
}