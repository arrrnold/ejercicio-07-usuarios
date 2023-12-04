const express = require('express')
// const bcrypt = require('bcrypt') // para encriptar contraseñas (sin subir a render)
const bcrypt = require("bcryptjs") // para encriptar contraseñas (para subir a render)
const router = express.Router();
const userModel = require('../models/user');

exports.getAllUsers = async (req, res) => {
    const users = await userModel.find()
    try {
        if (users.length > 0) {
            res.status(200).json({
                estado: 1,
                mensaje: "usuarios encontrados",
                users: users
            })
        } else {
            res.status(404).json({
                estado: 1,
                mensaje: "no existen usuarios"
            })
        }
    } catch (error) {
        res.status(500).json({
            estado: 0,
            mensaje: "ha ocurrido un error desconocido"
        })
    }

}

exports.getUserByEmail = async (req, res) => {
    const {correo} = req.params;
    if (correo === undefined) {
        res.status(400).json({
            estado: 0,
            mensaje: "faltan parámetros (correo)"
        })
    } else {
        try {
            const user = await userModel.find({correo})
            if (user.length > 0) {
                res.status(200).json({
                    estado: 1,
                    mensaje: "usuario encontrado",
                    usuario: user
                })
            } else {
                res.status(404).json({
                    estado: 1,
                    mensaje: "usuario no encontrado"
                })
            }
        } catch (error) {
            res.status(500).json({
                estado: 0,
                mensaje: "ha ocurrido un error inesperado"
            })
        }
    }
}

exports.createUser = async (req, res) => {
    const {nombre, apellidos, correo, clave} = req.body;
    try {
        // Verificar la existencia de los parámetros
        if (nombre === undefined || apellidos === undefined || correo === undefined || clave === undefined) {
            res.status(400).json({
                estado: 0,
                mensaje: "faltan parámetros"
            });
        } else {
            const userFound = await userModel.findOne({correo: correo}).exec();
            if (userFound) {
                res.status(200).json({
                    estado: 1,
                    mensaje: "ya existe un usuario con ese correo"
                });
            } else {
                const salt = await bcrypt.genSalt(8);
                const claveEncriptada = await bcrypt.hash(clave, salt);

                const user = new userModel({
                    nombre: nombre,
                    apellidos: apellidos,
                    correo: correo,
                    clave: claveEncriptada
                });

                await user.save();
                res.status(201).json({
                    estado: 1,
                    mensaje: "usuario creado correctamente",
                    usuario: user
                });
            }
        }
    } catch (error) {
        // Capturar y devolver información sobre el error
        console.log(error)
        res.status(500).json({
            estado: 0,
            mensaje: "Ha ocurrido un error"
        });
    }
};


exports.updateUser = async (req, res) => {
  const { correo } = req.params;
  const { nuevoNombre, nuevosApellidos, nuevaClave, nuevoCorreo } = req.body;

  try {
    const newUser = await userModel.findOne({ correo: nuevoCorreo }).exec();
    if (newUser) {
      return res.status(400).json({
        estado: 0,
        mensaje: "El nuevo correo ya está en uso",
      });
    }

    await userModel.findOneAndUpdate(
      { correo: correo },
      {
        $set: {
          correo: nuevoCorreo,
          nombre: nuevoNombre,
          apellidos: nuevosApellidos,
          clave: nuevaClave,
        },
      }
    );

    res.status(200).json({
      estado: 1,
      mensaje: "Usuario actualizado correctamente",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      estado: 0,
      mensaje: "Ha ocurrido un error desconocido",
    });
  }
};


exports.deleteUser = async (req, res) => {
    const {correo} = req.params

    if (correo == undefined) {
        res.status(400).json({
            estado: 0,
            mensaje: "faltan parametros"
        })
    } else {
        try {

            const deletedUser = await userModel.findOneAndDelete({correo: correo}); // eliminar usuario
            if (!deletedUser) {
                res.status(404).json({
                    estado: 1,
                    mensaje: "usuario no encontrado"
                })
            } else {
                res.status(200).json({
                    estado: 1,
                    mensaje: "usuario borrado correctamente"
                })
            }
        } catch (error) {
            res.status(500).json({
                estado: 0,
                mensaje: "ha ocurrido un error desconocido"
            })
        }
    }
}
