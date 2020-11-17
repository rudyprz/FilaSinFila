const {Schema, model} = require('mongoose')

const businessSchema = new Schema({
    businessID: String,
    ownerID: String,
    nombreC: String,
    direccionC: String,
    tokens: Number,
    turnoActual: Number,
    personasActual: Number,
    maxPersonas: Number,
    turnosAcumulado: Number,
    principal: Boolean
});

module.exports = model('business', businessSchema);