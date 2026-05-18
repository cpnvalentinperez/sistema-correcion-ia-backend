import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    
    // El formato suele ser "Bearer <token>", por eso usamos split (Clase 03)
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ 
            status: 401, 
            message: "Acceso denegado. No se proporcionó un token." 
        });
    }

    try {
        // Verificamos el token con nuestra clave secreta del .env
        const verified = jwt.verify(token, process.env.JWT_SECRET || 'clave_secreta_techlab');
        req.user = verified;
        next(); // Si todo está bien, pasamos al siguiente paso (el controlador)
    } catch (error) {
        res.status(403).json({ 
            status: 403, 
            message: "Token inválido o expirado." 
        });
    }
};