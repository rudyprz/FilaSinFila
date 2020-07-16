const MessagingResponse = require('twilio').twiml.MessagingResponse;
const {sendMessage} = require('../twilio/send-sms')
const {sendWhatsapp} = require('../twilio/send-wapp')
const {sendCode, verifyCode} = require('../twilio/verify')
const SMS = require('../models/sms')
const User = require('../models/user')
const Owner = require('../models/owner')
const Business = require('../models/business')
const Associate = require('../models/associate')
const bcrypt = require('bcrypt')
const {getSocket} = require('../sockets')
const _ = require('underscore');
const jwt = require('jsonwebtoken');

const saltRounds = 10

const loginUser = async (req, res) => {
    let body = req.body;

  try {
    // Buscamos email en DB
    const usuarioDB = await User.findOne({email: body.email});
    console.log(usuarioDB)

    // Evaluamos si existe el usuario registrado
    if(!usuarioDB){
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
            check: true
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
    }

    // Checamos la contraseña del usuario registrado
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
    })
    
  } catch (error) {
    return res.status(500).json({
      mensaje: 'Ocurrio un error',
      error
    });
  }
}

const createUser = async (req, res) => {
    const body = {
        nombre: req.body.nombre,
        email: req.body.email,
        telefono: req.body.tel,
        role: req.body.role
    }

    const mailDB = await User.findOne({email: body.email});
    const telDB = await User.findOne({tel: body.tel});

    if(mailDB || telDB){
      return res.status(400).json({
        mensaje: 'El correo y/o teléfono ya estan registrados.',
      });
    }

    body.pass = bcrypt.hashSync(req.body.pass, saltRounds)

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

  const mailDB = await Owner.findOne({email: body.email});
  const telDB = await Owner.findOne({tel: body.tel});

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
        telefono: ownerDB.tel,
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
      role: req.body.role
  }

  const mailDB = await Associate.findOne({email: body.email});
  const telDB = await Associate.findOne({tel: body.tel});

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
        telefono: associateDB.tel,
        businessID: associateDB.businessID,
        role: associateDB.role,
        associateID: associateDB._id
      })
  } catch (error) {
      return res.status(500).json({
          mensaje: 'Ocurrio un error al registrarte. Intenta de nuevo.',
          error
      })
  }
}

const updateUser = async(req, res) => {

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'tel', 'sms']);
  
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
    maxPersonas: req.body.maxPersonas
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
      businessID: businessDB._id
    })
  } catch (error) {
    return res.status(500).json({
      mensaje: 'Ocurrio un error al registrarte. Intenta de nuevo.',
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
  let body = _.pick(req.body, ['personasActual']);

  try {
    // {new:true} nos devuelve el negocio actualizado
    const businessDB = await Business.findByIdAndUpdate(id, body, {new: true, runValidators: true});

    return res.json(businessDB);

  } catch (error) {
    return res.status(400).json({
      mensaje: 'Ocurrio un error. Intenta de nuevo más tarde',
      error
    })
  }  
}

const checkOutBusiness = async(req, res) => {

  let id = req.params.id;
  let body = _.pick(req.body, ['personasActual', 'turnoActual']);

  try {
    // {new:true} nos devuelve el negocio actualizado
    const businessDB = await Business.findByIdAndUpdate(id, body, {new: true, runValidators: true});

    return res.json(businessDB);

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
  })


}

const getBusiness = async(req, res) => {

    let id = req.params.id;

    const businessDB = await Business.findOne({ownerID: id});

    return res.json({
      nombreC: businessDB.nombreC,
      direccionC: businessDB.direccionC,
      tokens: businessDB.tokens,
      ownerID: businessDB.ownerID,
      turnoActual: businessDB.turnoActual,
      personasActual: businessDB.personasActual,
      maxPersonas: businessDB.maxPersonas,
      businessID: businessDB._id
    })


}

const generateQR = async(req, res) => {
  const businessQR = await Business.findOne({businessID: req.body.businessID});
  
  return res.json({
    businessID: businessQR._id
  })
}

const detectQR = async(req, res) => {
  let id = req.params.id;
  const businessQR = await Business.findOne({_id: id});
  if(!businessQR){
    return res.status(400).json({
      mensaje: 'No se encontro ningún negocio registrado con los datos del QR escaneado',
    });
  }
  return res.json({
    nombreC: businessDB.nombreC,
    direccionC: businessDB.direccionC,
    tokens: businessDB.tokens,
    ownerID: businessDB.ownerID,
    turnoActual: businessDB.turnoActual,
    personasActual: businessDB.personasActual,
    maxPersonas: businessDB.maxPersonas,
    businessID: businessDB._id
  })
}

const takeTurn = async(req, res) => {

  let id = req.params.id;
  let body = _.pick(req.body, ['turnoActual']);

  try {
    // {new:true} nos devuelve el negocio actualizado
    const userDB = await User.findByIdAndUpdate(id, body, {new: true, runValidators: true});

    return res.json(userDB);

  } catch (error) {
    return res.status(400).json({
      mensaje: 'Ocurrio un error. Intenta de nuevo más tarde',
      error
    })
  } 
}

const dropTurn = async(req, res) => {

  let id = req.params.id;
  let body = _.pick(req.body, ['turnoActual']);

  try {
    // {new:true} nos devuelve el negocio actualizado
    const userDB = await User.findByIdAndUpdate(id, body, {new: true, runValidators: true});

    return res.json(userDB);

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

    res.redirect('/');
}

const postWhatsapp = async (req, res) => {
    
    const {message, phone} = req.body;

    if(!message || !phone) return res.json("Missing message or phone");
    
    const result = await sendWhatsapp(req.body.message, req.body.phone);
    
    console.log(result);

    await SMS.create({Body: req.body.message, To: req.body.phone});

    res.redirect('/');

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

module.exports = {
    indexController,
    postMessage,
    postWhatsapp,
    receiveMessage,
    loginUser,
    createUser,
    createOwner,
    createAssociate,
    createBusiness,
    updateUser,
    updateOwner,
    updateBusiness,
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
    generateQR,
    detectQR,
    takeTurn,
    dropTurn,
    sendCodeNumber,
    verifyCodeNumber
}