import jwt from 'jsonwebtoken';

export const login = async (req, res) => {
    const { email, password } = req.body;

    // Validación simple (Usuario ficticio solicitado en la guía)
    if (email === 'valentin@email.com' && password === '123456TNT') {
        
        // Creamos el token (Clase 04: Usando objetos)
        const token = jwt.sign(
            { user: email }, 
            process.env.JWT_SECRET || 'clave_secreta_techlab', 
            { expiresIn: '1h' }
        );

        return res.status(200).json({
            message: "¡Bienvenido a TechLab!",
            token: token
        });
    }

    res.status(401).json({ message: "Credenciales incorrectas" });
};