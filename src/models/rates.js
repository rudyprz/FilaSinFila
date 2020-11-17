const {Schema, model} = require('mongoose')

const ratesSchema = new Schema({
    userID: String,
    businessID: String,
    date: { type: Date, default: Date.now },
    rateOverall: Number,
    rateTime: Number
},{
    timestamps: true
});

module.exports = model('rates', ratesSchema);