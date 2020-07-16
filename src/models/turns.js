const {Schema, model} = require('mongoose')

const turnsSchema = new Schema({
    userID: String,
    businessID: String,
    date: { type: Date, default: Date.now },
    turnoAsignado: Number
},{
    timestamps: true
});

module.exports = model('turns', turnsSchema);