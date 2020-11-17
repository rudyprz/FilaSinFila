const {Schema, model} = require('mongoose')

// Roles
const roles = {
    values: ['ADMIN', 'ASSOCIATE'],
    message: '{VALUE} no es un ról válido'
}

const associateSchema = new Schema({
    associateID: String,
    role: { type: String, default: 'ASSOCIATE', enum: roles },
    nombre: String,
    email: String,
    telefono: String,
    pass: String,
    businessID: String,
    ownerID: String
});

module.exports = model('associate', associateSchema);