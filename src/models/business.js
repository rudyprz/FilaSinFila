const {Schema, model} = require('mongoose')

const businessSchema = new Schema({
    nombre: String,
    email: String,
    telefono: String,
    negocioId: String,
    nombreC: String,
    direccionC: String,
    nombreF: String,
    direccionF: String,
    turnoActual: String,
    sms: {type: Boolean, default: true}
});

module.exports = model('business', businessSchema);