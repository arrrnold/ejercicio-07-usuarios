const express = require('express')
const router = express.Router();
const userModel = require('../models/user');
const userController = require('../controllers/user')

// rutas del CRUD
router.post('/', userController.createUser) // crear
router.get('/',userController.getAllUsers) // ver todos
router.get('/:correo',userController.getUserByEmail) // ver user por email
router.put('/:correo',userController.updateUser) // actualizar
router.delete('/:correo',userController.deleteUser) // borrar
module.exports = router