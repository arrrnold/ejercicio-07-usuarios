// crear el esquema y luego el modelo de datos de la entidad 'user'
const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({ // el esquema
    nombre: {
        type: String,
        required: true
    },
    apellidos: {
        type: String,
        required: true
    },
    correo: {
        type: String,
        required: true
    },
    clave: {
        type: String,
        required: true
    }

});

const userModel = mongoose.model('User', userSchema) // el modelo

module.exports = userModel // exportar el modelo para poder usarlo en las rutas