const {Schema, model} = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

// Roles
const roles = {
    values: ['ADMIN', 'BUSINESS', 'USER'],
    message: '{VALUE} no es un ról válido'
}

const userSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    email: { type: String, unique: true, required: [true, 'Email es necesario'] },
    telefono: { type: String, required: [true, 'Teléfono es necesario'] },
    pass: { type: String, required: [true, 'Contraseña es necesaria'] },
    date: { type: Date, default: Date.now },
    role: { type: String, default: 'USER', enum: roles },
    negocioActual: String,
    turnoActual: String,
    sms: {type: Boolean, default: true}
});

// Validaror
userSchema.plugin(uniqueValidator, { message: 'Error, esperaba {PATH} único.' })

// Elimnar pass de respuesta JSON
userSchema.methods.toJSON = () => {
    var obj = this.toObject();
    delete obj.pass;
    return obj;
}

module.exports = model('user', userSchema);