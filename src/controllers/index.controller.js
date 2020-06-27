const MessagingResponse = require('twilio').twiml.MessagingResponse;
const {sendMessage} = require('../twilio/send-sms')
const {sendCode, verifyCode} = require('../twilio/verify')
const SMS = require('../models/sms')
const User = require('../models/user')
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

    // Evaluamos si existe el usuario en DB
    if(!usuarioDB){
      return res.status(400).json({
        mensaje: 'Usuario! o contraseña inválidos',
      });
    }

    // Evaluamos la contraseña correcta
    if( !bcrypt.compareSync(body.pass, usuarioDB.pass) ){
      return res.status(400).json({
        mensaje: 'Usuario o contraseña! inválidos',
      });
    }

    // Generar Token
    let token = jwt.sign({
        data: usuarioDB
    }, 'secret', { expiresIn: 60 * 60 * 24 * 30}) // Expira en 30 días

    // Pasó las validaciones
    return res.json({
      usuarioDB,
      token: token
    })
    
  } catch (error) {
    return res.status(400).json({
      mensaje: 'Ocurrio un error',
      error
    });
  }
}

const createUser = async (req, res) => {
    const body = {
        nombre: req.body.nombre,
        email: req.body.email,
        tel: req.body.tel,
        role: req.body.role
    }

    body.pass = bcrypt.hashSync(req.body.pass, saltRounds)

    try {
        const userDB = await User.create(body)
        return res.json(userDB)
    } catch (error) {
        return res.status(500).json({
            mensaje: 'Ocurrio un error al registrarte. Intenta de nuevo.',
            error
        })
    }
}

const updateUser = async(req, res) => {

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'tel', 'role', 'pass']);
    if(body.pass){
        body.pass = bcrypt.hashSync(req.body.pass, saltRounds);
    }
  
    try {
      // {new:true} nos devuelve el usuario actualizado
      const usuarioDB = await User.findByIdAndUpdate(id, body, {new: true, runValidators: true});
  
      return res.json(usuarioDB);
  
    } catch (error) {
      return res.status(400).json({
        mensaje: 'Ocurrio un error. Intenta de nuevo más tarde',
        error
      })
    }  
}

const sendCodeNumber = async (req, res) => {
    const code = await sendCode(req.body.phone)
    console.log('Status:' + code)
    res.send(code)
}

const verifyCodeNumber = async (req, res) => {
    const verify = await verifyCode(req.body.phone, req.body.code)
    console.log(verify)
    res.send(verify)
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
    receiveMessage,
    createUser,
    updateUser,
    sendCodeNumber,
    verifyCodeNumber
}