const {Schema, model} = require('mongoose')

// Roles
const roles = {
    values: ['ADMIN', 'USER'],
    message: '{VALUE} no es un ról válido'
}

const userSchema = new Schema({
    userID: String,
    role: { type: String, default: 'USER', enum: roles },
    nombre: String,
    email: String,
    telefono: String,
    pass: String,
    date: { type: Date, default: Date.now },
    negocioActual: String,
    turnoActual: String,
    sms: {type: String, default: 'SMS'}
},{
    timestamps: true
});

module.exports = model('user', userSchema);