ctrl = {}
const jwt = require("jsonwebtoken")
const User = require("../models/User")//importamos el modelo el usuario
//controlador de rutas 
ctrl.login = async (req, res) => {
    console.log("Solicitud de login", req.body)
    try {
        const user = await User.findOne({ email: req.body.email })//user es un documento
        //user.toObject()
        if (user && await user.matchPassword(req.body.password)) {
            console.log(user.id)
            const token = jwt.sign(
                {//primer parametro es payload
                    //data que queremos firmar
                    id: user.id
                },
                //segundo parametro es KEY
                process.env.KEY_SECRET,
                //tercer parametro son las opciones
                {
                    expiresIn: "1 min",
                }
            )
            const { id, email } = user
            res.json({
                id, email, token
            })
        } else {
            res.status(400).json({ mensaje: "Usuario no registrado, o contraseña incorrecta" })
        }
    } catch (error) {
        console.log(error)
        res.status(400).json({ mensaje: "Ocurrio un error en el servidor" })
    }
}
ctrl.register = async (req, res) => {
    console.log("solicitud registro")
    console.log(req.body)
    if (req.body.password.length >= 6 & isEmail(req.body.email)) {
        try {
            const emailUser = await User.findOne({ email: req.body.email })
            if (emailUser) {
                res.status(201).json({ mensaje: "El correo ya esta registrado. Intente con otro" })
            } else {
                const newUser = new User({
                    email: req.body.email,
                    name: req.body.name
                })
                newUser.password = await newUser.encryptPassword(req.body.password)
                await newUser.save()
                res.status(200).json({ mensaje: "Registro correcto" })
            }
        } catch (error) {
            console.log(error)
            res.status(400).json({ mensaje: "Ocurrio un error en servidor" })
        }
    } else {
        res.status(201).json({ mensaje: "Datos de registro invalidos" })
    }
}

ctrl.perfil = async (req, res) => {//solo 
    console.log(req.user)
    res.json({ mensaje: "tienes permiso autorizado" })
}


function isEmail (email) {
    return true
}

module.exports = ctrl;