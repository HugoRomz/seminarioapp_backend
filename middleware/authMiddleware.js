import jwt from 'jsonwebtoken'
import { Usuarios } from '../models/Usuarios.js'

const authMiddleware = async (req, res, next) => {
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            const token = req.headers.authorization.split(' ')[1]
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            req.user = await Usuarios.findOne({
                where: { usuario_id: decoded.id },
                attributes: { exclude: ['password', 'token'] }
              });              
              next()
        } catch {
            const error = new Error ('Token no válido')
            res.status(403).json({msg: error.message})
        }
        
    }else{
     const error = new Error ('Token no válido o inexistente')
     res.status(403).json({msg: error.message})
    }

    next()
}



export  default authMiddleware;