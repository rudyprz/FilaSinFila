const {Schema, model} = require('mongoose')

// Roles
const roles = {
    values: ['ADMIN', 'OWNER'],
    message: '{VALUE} no es un ról válido'
}

const ownerSchema = new Schema({
    ownerID: String,
    role: { type: String, default: 'OWNER', enum: roles },
    nombre: String,
    email: String,
    telefono: String,
    pass: String,
    nombreF: String,
    direccionF: String,
    resetLink: {type: String, default:''},
    resetExpires: {type: Date, default: ''}
});

module.exports = model('owner', ownerSchema);